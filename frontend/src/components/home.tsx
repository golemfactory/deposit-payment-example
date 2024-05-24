import { useUser } from "hooks/useUser";
import { ConnectWallet } from "./connectWallet";
import { Allowance } from "./allowace";
import { Register } from "./register";
import { Deposit } from "./deposit";
import { FileUploader } from "./Uploader";
import { useState } from "react";
import { GolemManager } from "./GolemManager";

import { Layout } from "./layout/layout";
import { TopBar } from "./homePage/topBar";
import { Events } from "./homePage/events";
import { Status } from "./homePage/status";
import { Action } from "./homePage/action";

// export function Home() {
//   const [extendVisible, setExtendVisible] = useState(false);
//   const { user } = useUser();
//   return (
//   //   <div className="w-screen h-screen flex justify-center ">
//   //     <ConnectWallet />
//   //     <Register />
//   //     <Allowance isFormVisible={!extendVisible} />
//   //     <Deposit
//   //       showExtendForm={() => {
//   //         setExtendVisible(true);
//   //       }}
//   //       isExtendFormVisible={extendVisible}
//   //       hideExtendForm={() => {
//   //         setExtendVisible(false);
//   //       }}
//   //     />
//   //     <GolemManager isFormVisible={!extendVisible} />
//   //     {!extendVisible && user.hasAllocation() && <FileUploader />}
//   //   </div>
//   // );
// }

export function Home() {
  console.log("rendering home");
  return (
    <Layout
      header={<TopBar />}
      left={
        <div>
          <Events />
        </div>
      }
      center={
        <div className="w-full">
          <Status />
          <Action />
        </div>
      }
    />
  );
}
