import { config } from "config";
import { useAllowance } from "hooks/GLM/useGLMApprove";
import { useUserData } from "hooks/userUserData";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { match } from "ts-pattern";
import { ReducerArgs } from "types/reducerArgs";

import { UserState, UserAction, UserStateOrderValue } from "types/user";
import { useAccount } from "wagmi";

type UserProps = {
  state: UserState;
  allowanceAmount?: bigint;
  currentDeposit?: {
    isCurrent: boolean;
    isValid: boolean;
    nonce: bigint;
  };
};

interface UserInterface {
  isAtLeastAt(state: UserState): boolean;
  isConnected(): boolean;
  isRegistered(): boolean;
  hasKnownAllowance(): boolean;
  hasEnoughAllowance(): boolean;
  hasDepositDataLoaded(): boolean;
  hasDeposit(): boolean;
}

const withUserInterface = function (user: UserProps) {
  return {
    ...user,
    isAtLeastAt(state: UserState) {
      return UserStateOrderValue[user.state] >= UserStateOrderValue[state];
    },
    isConnected() {
      return this.isAtLeastAt(UserState.CONNECTED);
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
  };
};

export const UserContext = createContext<{
  user: UserProps & UserInterface;
}>({
  user: withUserInterface({ state: UserState.DISCONNECTED }),
});

type Payload = {
  [UserAction.CONNECT]: never;
  [UserAction.DISCONNECT]: never;
  [UserAction.REGISTER]: never;
  [UserAction.ENOUGH_ALLOWANCE]: { allowanceAmount: bigint };
  [UserAction.NOT_ENOUGH_ALLOWANCE]: { allowanceAmount: bigint };
  [UserAction.LOADING]: never;
  [UserAction.APPROVE]: string;
  [UserAction.HAS_DEPOSIT]: {
    currentDeposit: {
      isCurrent: boolean;
      isValid: boolean;
      nonce: number;
    };
  };
  [UserAction.HAS_NO_DEPOSIT]: never;
};

const userActionReducer = (user: UserProps, action: ReducerArgs<Payload>) => {
  const { kind, payload = {} } = action;
  const state = match(kind)
    .with(UserAction.CONNECT, () => UserState.CONNECTED)
    .with(UserAction.DISCONNECT, () => UserState.DISCONNECTED)
    .with(UserAction.REGISTER, () => UserState.REGISTERED)
    .with(UserAction.ENOUGH_ALLOWANCE, () => UserState.GRANTED)
    .with(UserAction.NOT_ENOUGH_ALLOWANCE, () => UserState.NOT_GRANTED)
    .with(UserAction.LOADING, () => UserState.LOADING)
    .with(UserAction.HAS_DEPOSIT, () => UserState.HAS_DEPOSIT)
    .with(UserAction.HAS_NO_DEPOSIT, () => UserState.HAS_NO_DEPOSIT)
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
  const { isConnected } = useAccount();
  const { userData, isLoading: isUserLoading } = useUserData();
  //TODO : check if user is registered
  const [isRegistered, setIsRegistered] = useState(false);

  const [user, dispatch] = useReducer(
    userActionReducer,
    isConnected
      ? isRegistered
        ? { state: UserState.REGISTERED }
        : { state: UserState.CONNECTED }
      : { state: UserState.DISCONNECTED }
  );

  useEffect(() => {
    const currentDeposit = (userData?.deposits || []).find(
      (deposit) => deposit.isCurrent
    );
    if (!isUserLoading && userData?._id) {
      console.log("userData", userData);
      setIsRegistered(true);
    }
    if (currentDeposit) {
      console.log("currentDeposit", currentDeposit);
      dispatch({ kind: UserAction.HAS_DEPOSIT, payload: { currentDeposit } });
    } else {
      if (userData?.deposits) {
        console.log("aaa");
        dispatch({ kind: UserAction.HAS_NO_DEPOSIT });
      }
    }
  }, [isUserLoading, userData]);

  const { isFetched, isLoading: isLoadingAllowance, data } = useAllowance();

  useEffect(() => {
    if (isConnected) {
      dispatch({ kind: UserAction.CONNECT });
      if (isRegistered) {
        if (isFetched && data !== undefined) {
          if (data > config.minimalAllowance) {
            dispatch({
              kind: UserAction.ENOUGH_ALLOWANCE,
              payload: { allowanceAmount: data },
            });
          } else {
            dispatch({
              kind: UserAction.NOT_ENOUGH_ALLOWANCE,
              payload: { allowanceAmount: data },
            });
          }
        }
      }
    } else {
      dispatch({ kind: UserAction.DISCONNECT });
    }
  }, [isFetched, data, isRegistered]);

  return (
    <UserContext.Provider value={{ user: withUserInterface(user) }}>
      {children}
    </UserContext.Provider>
  );
};
