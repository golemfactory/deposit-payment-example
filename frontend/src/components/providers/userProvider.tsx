import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

import { UserState, UserAction } from "types/user";

export const UserContext = createContext({
  state: UserState.DISCONNECTED,
});

export function useUser() {
  return useContext(UserContext);
}

const userActionReducer = (state: UserState, action: UserAction) => {
  switch (action) {
    case UserAction.CONNECT:
      return UserState.CONNECTED;
    case UserAction.DISCONNECT:
      return UserState.DISCONNECTED;
    case UserAction.REGISTER:
      return UserState.REGISTERED;
    case UserAction.APPROVE:
      return UserState.GRANTED;
    default:
      return state;
  }
};

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(
    userActionReducer,
    UserState.DISCONNECTED
  );
  return (
    <UserContext.Provider value={{ state: UserState.CONNECTED }}>
      {children}
    </UserContext.Provider>
  );
};
