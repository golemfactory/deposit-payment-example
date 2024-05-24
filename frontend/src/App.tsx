import "./App.css";
import { BlockchainProvider } from "./components/providers/blockchainProvider";
import { SnackbarProvider } from "notistack";

import { SWRConfig } from "swr";
import { Home } from "components/home";
import { UserProvider } from "components/providers/userProvider";
import { FileUploaderProvider } from "components/providers/fileUploader";
import { formatEther } from "viem";

function App() {
  return (
    //@ts-ignore
    <div data-theme="golem" className="font-kanit">
      <SWRConfig>
        <FileUploaderProvider>
          <BlockchainProvider>
            <SnackbarProvider autoHideDuration={50000}>
              <UserProvider>
                <Home />
              </UserProvider>
            </SnackbarProvider>
          </BlockchainProvider>
        </FileUploaderProvider>
      </SWRConfig>
    </div>
  );
}

export default App;
