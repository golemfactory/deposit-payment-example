import { useAccount } from "wagmi";
import "./App.css";
import { RegisterButton } from "./RegisterButton";
import { BlockchainProvider } from "./blockchainProvider";
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

function Deposit() {
  const { address: walletAddress } = useAccount();
  return <div>{walletAddress ? <DepositForm /> : ""}</div>;
}

function App() {
  return (
    <BlockchainProvider>
      <SnackbarProvider autoHideDuration={2000}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 grid grid-cols-2">
            <w3m-button />

            <BlockChainLogin />
          </div>

          <div className="col-span-4 col-start-5">
            <Deposit />
          </div>
        </div>
      </SnackbarProvider>
    </BlockchainProvider>
  );
}

export default App;
