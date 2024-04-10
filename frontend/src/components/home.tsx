import { useUser } from "hooks/useUser";
import { ConnectWallet } from "./connectWallet";
import { Allowance } from "./allowace";
import { Register } from "./register";

export function Home() {
  const { user } = useUser();
  return (
    <div className="w-screen h-screen flex justify-center ">
      <ConnectWallet />
      <Allowance />
      <Register />
      {/* <Register />
      {/* {match(user.state)
        .with(UserState.CONNECTED, () => <RegisterButton />)
        .with(UserState.LOADING, () => <LoadingSpinner />)
        .otherwise(() => "")} */}
    </div>
  );
}
