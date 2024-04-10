import { useUser } from "hooks/useUser";
import { ConnectWallet } from "./connectWallet";
import { Allowance } from "./allowace";
import { Register } from "./register";
import { useAccount } from "wagmi";

export function Home() {
  const { user } = useUser();
  const { address } = useAccount();
  return (
    <div className="w-screen h-screen flex justify-center ">
      <ConnectWallet />
      <Allowance />
      {address && <Register />}
      {/* <Register />
      {/* {match(user.state)
        .with(UserState.CONNECTED, () => <RegisterButton />)
        .with(UserState.LOADING, () => <LoadingSpinner />)
        .otherwise(() => "")} */}
    </div>
  );
}
