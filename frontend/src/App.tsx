import { useAccount } from "wagmi";
import "./App.css";
import { RegisterButton } from "./RegisterButton";
import { BlockchainProvider } from "./blockchainProvider";
import { SnackbarProvider } from "notistack";

function BlockChainLogin() {
  const { address: walletAddress } = useAccount();

  return <div>{walletAddress ? <RegisterButton /> : ""}</div>;
}
function App() {
  return (
    <BlockchainProvider>
      <SnackbarProvider autoHideDuration={2000}>
        <w3m-button />
        <BlockChainLogin />
      </SnackbarProvider>
    </BlockchainProvider>
  );
}

export default App;
