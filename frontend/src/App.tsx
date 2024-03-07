import "./App.css";
import { RegisterButton } from "./RegisterButton";
import { BlockchainProvider } from "./blockchainProvider";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <BlockchainProvider>
      <SnackbarProvider autoHideDuration={2000}>
        <w3m-button />
        <RegisterButton />
      </SnackbarProvider>
    </BlockchainProvider>
  );
}

export default App;
