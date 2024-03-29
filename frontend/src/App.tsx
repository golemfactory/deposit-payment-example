import { useAccount } from "wagmi";
import "./App.css";
import { RegisterButton } from "./RegisterButton";
import { BlockchainProvider } from "./blockchainProvider";
import { SnackbarProvider } from "notistack";
import { DepositForm } from "./DepositForm";
import { FileUploader } from "./Uploader";
import { ScanResults } from "./ScanResults";
function BlockChainLogin() {
  const { address: walletAddress } = useAccount();
  const loginToken = localStorage.getItem("accessToken");
  return (
    <div className="content-end flex justify-end	">
      {walletAddress ? !loginToken ? <RegisterButton /> : "" : ""}
    </div>
  );
}

import { SWRConfig } from "swr";

function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map<string, unknown>(
    JSON.parse(localStorage.getItem("app-cache") || "[]")
  );

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}

function Deposit() {
  const { address: walletAddress } = useAccount();
  return <div>{walletAddress ? <DepositForm /> : ""}</div>;
}

function App() {
  return (
    //@ts-ignore
    <SWRConfig>
      <BlockchainProvider>
        <SnackbarProvider autoHideDuration={50000}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 grid grid-cols-2">
              <w3m-button />

              <BlockChainLogin />
            </div>

            <div className="col-span-4 col-start-5">
              <Deposit />
            </div>
            <div className="col-span-4 col-start-5">
              <FileUploader />
              <ScanResults />
            </div>
          </div>
        </SnackbarProvider>
      </BlockchainProvider>
    </SWRConfig>
  );
}

export default App;
