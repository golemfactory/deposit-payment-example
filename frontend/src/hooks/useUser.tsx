import { UserContext } from "components/providers/userProvider";
import { useContext } from "react";

export function useUser() {
  return useContext(UserContext);
}
