import { useUser } from "hooks/useUserStatus";
import { match, P } from "ts-pattern";
import { UserState } from "types/user";
import { ConnectWallet } from "./connectWallet";
import { RegisterButton } from "./RegisterButton";
import { LoadingSpinner } from "./loadingSpinner";

export function Home() {
  const user = useUser();
  console.log(user);
  return (
    <div className="w-screen h-screen flex justify-center ">
      <ConnectWallet />

      {match(user.state)
        .with(UserState.CONNECTED, () => <RegisterButton />)
        .with(UserState.REGISTERED, () => <button>Approve</button>)
        .with(UserState.GRANTED, () => <div>Connected and approved</div>)
        .with(UserState.LOADING, () => <LoadingSpinner />)
        .otherwise(() => "")}
    </div>
  );
}
