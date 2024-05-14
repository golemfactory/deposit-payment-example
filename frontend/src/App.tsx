import "./App.css";
import { BlockchainProvider } from "./components/providers/blockchainProvider";
import { SnackbarProvider } from "notistack";

import { SWRConfig } from "swr";
import { Home } from "components/home";
import { UserProvider } from "components/providers/userProvider";
import { FileUploaderProvider } from "components/providers/fileUploader";

function App() {
  return (
    //@ts-ignore
    <div data-theme="golem" className="font-kanit">
      <SWRConfig>
        <FileUploaderProvider>
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
        </FileUploaderProvider>
      </SWRConfig>
    </div>
  );
}

export default App;
