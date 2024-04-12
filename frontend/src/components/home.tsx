import { useUser } from "hooks/useUser";
import { ConnectWallet } from "./connectWallet";
import { Allowance } from "./allowace";
import { Register } from "./register";
import { useAccount } from "wagmi";
import { useUserData } from "hooks/userUserData";
import { Deposit } from "./deposit";
import { FileUploader } from "./Uploader";
import { useState } from "react";

export function Home() {
  const [extendVisible, setExtendVisible] = useState(false);
  const { user } = useUser();
  return (
    <div className="w-screen h-screen flex justify-center ">
      <ConnectWallet />
      <Register />
      <Allowance />
      <Deposit
        showExtendForm={() => {
          setExtendVisible(true);
        }}
        isExtendFormVisible={extendVisible}
        hideExtendForm={() => {
          setExtendVisible(false);
        }}
      />

      {!extendVisible && user.hasDeposit() && <FileUploader />}
    </div>
  );
}
