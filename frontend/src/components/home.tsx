import { useUser } from "hooks/useUser";
import { ConnectWallet } from "./connectWallet";
import { Allowance } from "./allowace";
import { Register } from "./register";
import { Deposit } from "./deposit";
import { FileUploader } from "./Uploader";
import { useState } from "react";
import { useLogin } from "hooks/useLogin";
import { GolemManager } from "./GolemManager";

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
      <GolemManager />
      {!extendVisible && user.hasAllocation() && <FileUploader />}
    </div>
  );
}
