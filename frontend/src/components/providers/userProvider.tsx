import { config } from "config";
import { useAllowance } from "hooks/GLM/useGLMApprove";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { match } from "ts-pattern";
import { ReducerArgs } from "types/reducerArgs";

import { UserState, UserAction } from "types/user";
import { useAccount } from "wagmi";

export const UserContext = createContext<{
  user: User;
}>({
  user: { state: UserState.DISCONNECTED },
});

type User = {
  state: UserState;
  allowanceAmount?: bigint;
};

type Payload = {
  [UserAction.CONNECT]: never;
  [UserAction.DISCONNECT]: never;
  [UserAction.REGISTER]: never;
  [UserAction.ENOUGH_ALLOWANCE]: { allowanceAmount: bigint };
  [UserAction.NOT_ENOUGH_ALLOWANCE]: { allowanceAmount: bigint };
  [UserAction.LOADING]: never;
  [UserAction.APPROVE]: string;
};

const userActionReducer = (user: User, action: ReducerArgs<Payload>) => {
  const { kind, payload = {} } = action;

  const state = match(kind)
    .with(UserAction.CONNECT, () => UserState.CONNECTED)
    .with(UserAction.DISCONNECT, () => UserState.DISCONNECTED)
    .with(UserAction.REGISTER, () => UserState.REGISTERED)
    .with(UserAction.ENOUGH_ALLOWANCE, () => UserState.GRANTED)
    .with(UserAction.NOT_ENOUGH_ALLOWANCE, () => UserState.NOT_GRANTED)
    .with(UserAction.LOADING, () => UserState.LOADING)
    .otherwise(() => user.state);

  return {
    ...user,
    ...payload,
    state,
  };
};

const getUserState = ({
  isConnected,
  isRegistered,
}: {
  isConnected: boolean;
  isRegistered: boolean;
}) => {
  if (isRegistered) {
    return UserState.REGISTERED;
  } else if (isConnected) {
    return UserState.CONNECTED;
  } else if (hasWallet) {
    return UserState.DISCONNECTED;
  }
};

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { isConnected } = useAccount();
  //TODO : check if user is registered
  const isRegistered = !!localStorage.getItem("accessToken");
  const { isFetched, isLoading: isLoadingAllowance, data } = useAllowance();

  const [user, dispatch] = useReducer(
    userActionReducer,
    isRegistered
      ? { state: UserState.REGISTERED }
      : isConnected
        ? { state: UserState.CONNECTED }
        : { state: UserState.DISCONNECTED }
  );

  useEffect(() => {
    if (isConnected) {
      if (isLoadingAllowance) {
        dispatch({ kind: UserAction.LOADING });
      }
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
  }, [isLoadingAllowance, isFetched, data]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
