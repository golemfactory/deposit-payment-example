import { useAccount } from "wagmi";
import "./App.css";
import { RegisterButton } from "./components/RegisterButton";
import { BlockchainProvider } from "./components/providers/blockchainProvider";
import { SnackbarProvider } from "notistack";
import { DepositForm } from "./DepositForm";

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
import { Home } from "components/home";
import { UserProvider } from "components/providers/userProvider";

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
    <div data-theme="golem" className="font-kanit">
      <SWRConfig>
        <BlockchainProvider>
          <SnackbarProvider autoHideDuration={50000}>
            <UserProvider>
              <div
                id="app"
                className="grid grid-cols-12 gap-4 h-screen overflow-hidden"
              >
                <Home />
              </div>
            </UserProvider>
          </SnackbarProvider>
        </BlockchainProvider>
      </SWRConfig>
    </div>
  );
}

export default App;
