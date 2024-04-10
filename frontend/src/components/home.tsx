import { useUser } from "hooks/useUserStatus";
import { match, P } from "ts-pattern";
import { UserState } from "types/user";
import { ConnectWallet } from "./connectWallet";
import { RegisterButton } from "./RegisterButton";
import { LoadingSpinner } from "./loadingSpinner";
import { ApproveForm } from "./approveForm";

export function Home() {
  const { user } = useUser();
  return (
    <div className="w-screen h-screen flex justify-center ">
      <ConnectWallet />

      {match(user.state)
        .with(UserState.CONNECTED, () => <RegisterButton />)
        .with(UserState.NOT_GRANTED, () => <ApproveForm />)
        .with(UserState.GRANTED, () => <div>Connected and approved</div>)
        .with(UserState.LOADING, () => <LoadingSpinner />)
        .otherwise(() => "")}
    </div>
  );
}
