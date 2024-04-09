import { useUser } from "hooks/useUserStatus";
import { match, P } from "ts-pattern";
import { UserState } from "types/user";
import { ConnectWallet } from "./connectWallet";

export function Home() {
  const user = useUser();
  return (
    <div>
      {match(user.state)
        .with(UserState.DISCONNECTED, () => <ConnectWallet />)
        .with(UserState.CONNECTED, () => <button>Register</button>)
        .with(UserState.REGISTERED, () => <button>Approve</button>)
        .with(UserState.GRANTED, () => <div>Connected and approved</div>)
        .exhaustive()}
    </div>
  );
}
