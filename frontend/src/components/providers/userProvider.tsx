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

import { UserState, UserAction, UserStateOrderValue } from "types/user";
import { useAccount } from "wagmi";

type UserProps = {
  state: UserState;
  allowanceAmount?: bigint;
};

interface UserInterface {
  isAtLeastAt(state: UserState): boolean;
  isConnected(): boolean;
  isRegistered(): boolean;
  hasKnownAllowance(): boolean;
  hasEnoughAllowance(): boolean;
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
    .otherwise(() => user.state);

  return {
    ...user,
    ...payload,
    state,
  };
};

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { isConnected } = useAccount();
  //TODO : check if user is registered
  const isRegistered = !!localStorage.getItem("accessToken");
  const { isFetched, isLoading: isLoadingAllowance, data } = useAllowance();
  const [user, dispatch] = useReducer(
    userActionReducer,
    isConnected
      ? isRegistered
        ? { state: UserState.REGISTERED }
        : { state: UserState.CONNECTED }
      : { state: UserState.DISCONNECTED }
  );

  useEffect(() => {
    if (isConnected) {
      dispatch({ kind: UserAction.CONNECT });
      if (isRegistered) {
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
    } else {
      dispatch({ kind: UserAction.DISCONNECT });
    }
  }, [isLoadingAllowance, isFetched, data]);

  return (
    <UserContext.Provider value={{ user: withUserInterface(user) }}>
      {children}
    </UserContext.Provider>
  );
};
