import { useUser } from "hooks/useUser";
import { ConnectWallet } from "./connectWallet";
import { Allowance } from "./allowace";
import { Register } from "./register";
import { useAccount } from "wagmi";
import { useUserData } from "hooks/userUserData";
import { Deposit } from "./deposit";

export function Home() {
  console.log("Home rendered");
  const { address } = useAccount();
  const userData = useUserData();
  return (
    <div className="w-screen h-screen flex justify-center ">
      <ConnectWallet />
      <Register />
      <Allowance />
      <Deposit />
      {/* <Register />
      {/* {match(user.state)
        .with(UserState.CONNECTED, () => <RegisterButton />)
        .with(UserState.LOADING, () => <LoadingSpinner />)
        .otherwise(() => "")} */}
    </div>
  );
}
