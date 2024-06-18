import { config } from "config";
import { useAllowance } from "hooks/GLM/useGLMApprove";
import { useUserData } from "hooks/userUserData";
import { abi as depositContractAbi } from "hooks/depositContract/abi";

import {
  PropsWithChildren,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { match } from "ts-pattern";
import { EventWithPayload } from "types/reducerArgs";
import { UserState, UserAction, UserStateOrderValue } from "types/user";
import { useAccount, useReadContract } from "wagmi";
import { useChainId } from "hooks/useChainId";
import { useCurrentAgreement } from "hooks/yagna/useCurrentAgreement";
import { useLocalStorage } from "hooks/useLocalStorage";

import debug from "debug";

const log = debug("userProvider");

log("UserProvider");

type UserProps = {
  state: UserState;
  allowanceAmount?: bigint;
  currentDeposit?: {
    isCurrent: boolean;
    isValid: boolean;
    nonce: bigint;
  };
  currentAllocation?: {
    id: string;
  };
  currentAgreement?: {
    id: string;
    state: string;
  };
};

interface UserInterface {
  isAtLeastAt(state: UserState): boolean;
  isConnected(): boolean;
  isRegistered(): boolean;
  isLoggingIn(): boolean;
  hasKnownAllowance(): boolean;
  hasEnoughAllowance(): boolean;
  hasDepositDataLoaded(): boolean;
  hasDeposit(): boolean;
  hasAllocation(): boolean;
  hasAgreement(): boolean;
  login(data: {
    walletAddress: string;
    messageSignature: string;
    message: string;
  }): void;
}

const withUserInterface = function (
  user: UserProps
): UserProps & Omit<UserInterface, "login"> {
  return {
    ...user,
    isAtLeastAt(state: UserState) {
      return UserStateOrderValue[user.state] >= UserStateOrderValue[state];
    },
    isConnected() {
      return this.isAtLeastAt(UserState.CONNECTED);
    },
    isLoggingIn() {
      return this.state === UserState.LOGGING_IN;
    },
    isRegistered() {
      return this.isAtLeastAt(UserState.REGISTERED);
    },
    hasKnownAllowance() {
      return this.isAtLeastAt(UserState.GRANTED);
    },
    hasEnoughAllowance() {
      return (
        user.allowanceAmount !== undefined &&
        user.allowanceAmount > config.minimalAllowance
      );
    },
    hasDepositDataLoaded() {
      return this.isAtLeastAt(UserState.HAS_DEPOSIT);
    },
    hasDeposit() {
      return !!user.currentDeposit;
    },
    hasAllocation() {
      return !!user.currentAllocation?.id;
    },
    hasAgreement() {
      return !!user.currentAgreement?.id;
    },
  };
};

export const UserContext = createContext<{
  user: UserProps & UserInterface;
}>({
  user: {
    ...withUserInterface({ state: UserState.DISCONNECTED }),
    login: (data) => {},
  },
});

type Payload = {
  [UserAction.CONNECT]: never;
  [UserAction.DISCONNECT]: never;
  [UserAction.REGISTER]: never;
  [UserAction.LOGIN]: never;
  [UserAction.ENOUGH_ALLOWANCE]: { allowanceAmount: bigint };
  [UserAction.NOT_ENOUGH_ALLOWANCE]: { allowanceAmount: bigint };
  [UserAction.LOADING]: never;
  [UserAction.APPROVE]: string;
  [UserAction.HAS_DEPOSIT]: {
    currentDeposit: {
      isCurrent: boolean;
      isValid: boolean;
      nonce: number;
      id: string;
    };
  };
  [UserAction.HAS_NO_DEPOSIT]: {
    currentDeposit: null;
  };
  [UserAction.HAS_ALLOCATION]: {
    currentAllocation: unknown;
  };

  [UserAction.HAS_NO_ALLOCATION]: {
    currentAllocation: null;
  };

  [UserAction.HAS_AGREEMENT]: {
    currentAgreement: unknown;
  };
};

const userActionReducer = (
  user: UserProps,
  action: EventWithPayload<Payload>
) => {
  const { kind, payload = {} } = action;
  const state: UserState = match(kind)
    .with(UserAction.CONNECT, () => UserState.CONNECTED)
    .with(UserAction.DISCONNECT, () => UserState.DISCONNECTED)
    .with(UserAction.LOGIN, () => UserState.LOGGING_IN)
    .with(UserAction.REGISTER, () => UserState.REGISTERED)
    .with(UserAction.ENOUGH_ALLOWANCE, () => UserState.GRANTED)
    .with(UserAction.NOT_ENOUGH_ALLOWANCE, () => UserState.NOT_GRANTED)
    .with(UserAction.LOADING, () => UserState.LOADING)
    .with(UserAction.HAS_DEPOSIT, () => UserState.HAS_DEPOSIT)
    .with(UserAction.HAS_NO_DEPOSIT, () => UserState.HAS_NO_DEPOSIT)
    .with(UserAction.HAS_ALLOCATION, () => UserState.HAS_ALLOCATION)
    .with(UserAction.HAS_NO_ALLOCATION, () => UserState.HAS_NO_ALLOCATION)
    .otherwise(() => user.state);

  const newUser = {
    ...user,
    ...payload,
    state:
      UserStateOrderValue[state] > UserStateOrderValue[user.state]
        ? state
        : user.state,
  };

  return newUser;
};

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [currentDepositNonce, setCurrentDepositNonce] = useState(0n);
  const { data: userData, isLoading: isUserLoading } = useUserData();
  //TODO : get rid of
  const [isRegistered, setIsRegistered] = useState(false);
  const currentAgreement = useCurrentAgreement();

  // const accessToken = useLocalStorage("accessToken");
  const [accessToken] = useLocalStorage("accessToken");
  const [user, dispatch] = useReducer(
    userActionReducer,
    isConnected
      ? isRegistered
        ? { state: UserState.REGISTERED }
        : { state: UserState.CONNECTED }
      : { state: UserState.DISCONNECTED }
  );

  const { data: depositData } = useReadContract({
    address: config.depositContractAddress[chainId],
    abi: depositContractAbi,
    functionName: "getDepositByNonce",
    //@ts-ignore
    args: [currentDepositNonce || BigInt(0), address],
    query: {
      refetchInterval: 1000,
    },
  });

  useEffect(() => {
    if (address && accessToken) {
      dispatch({ kind: UserAction.REGISTER });
    }
  }, [accessToken, address]);

  useEffect(() => {
    const currentDeposit = (userData?.deposits || []).find(
      (deposit: { isCurrent: boolean }) => deposit.isCurrent
    );
    if (!isUserLoading && userData?._id) {
      setIsRegistered(true);
    }
    if ((user.allowanceAmount || 0) >= config.minimalAllowance) {
      if (currentDeposit) {
        setCurrentDepositNonce(BigInt(currentDeposit.nonce));
      }
      //@ts-ignore
      if (currentDeposit && depositData?.amount) {
        dispatch({ kind: UserAction.HAS_DEPOSIT, payload: { currentDeposit } });
      } else {
        if (userData?.deposits) {
          dispatch({
            kind: UserAction.HAS_NO_DEPOSIT,
            payload: { currentDeposit: null },
          });
        }
      }
    }
  }, [isUserLoading, userData, user.allowanceAmount, depositData]);

  const { isFetched: isAllowanceFetched, amount: allowanceAmount } =
    useAllowance();

  useEffect(() => {
    if (user.currentDeposit) {
      if (userData?.currentAllocation.id) {
        dispatch({
          kind: UserAction.HAS_ALLOCATION,
          payload: {
            currentAllocation: userData.currentAllocation,
          },
        });
      } else {
        dispatch({
          kind: UserAction.HAS_NO_ALLOCATION,
          payload: { currentAllocation: null },
        });
      }
    }
  }, [
    userData?.currentActivity,
    userData?.currentAllocation,
    user.currentDeposit,
  ]);

  useEffect(() => {
    if (isConnected) {
      dispatch({ kind: UserAction.CONNECT });
      if (isRegistered) {
        if (isAllowanceFetched && allowanceAmount !== undefined) {
          if (allowanceAmount > config.minimalAllowance) {
            console.log("enough allowance");
            dispatch({
              kind: UserAction.ENOUGH_ALLOWANCE,
              payload: { allowanceAmount },
            });
          } else {
            dispatch({
              kind: UserAction.NOT_ENOUGH_ALLOWANCE,
              payload: { allowanceAmount },
            });
          }
        }
      }
    } else {
      dispatch({ kind: UserAction.DISCONNECT });
    }
  }, [isAllowanceFetched, allowanceAmount, isRegistered]);

  return (
    <UserContext.Provider
      //@ts-ignore
      value={{ user: { ...withUserInterface(user), currentAgreement } }}
    >
      {children}
    </UserContext.Provider>
  );
};
