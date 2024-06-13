import "./App.css";
import { BlockchainProvider } from "./components/providers/blockchainProvider";
import { SnackbarProvider } from "notistack";

import { SWRConfig } from "swr";
import { Home } from "components/home";
import { UserProvider } from "components/providers/userProvider";
import { FileUploaderProvider } from "components/providers/fileUploader";
import { FlowEventsProvider } from "components/providers/flowEventsProvider";

function App() {
  return (
    //@ts-ignore
    <div data-theme="golem" className="font-kanit">
      <SWRConfig>
        <FlowEventsProvider>
          <FileUploaderProvider>
            <BlockchainProvider>
              <SnackbarProvider autoHideDuration={3000}>
                <UserProvider>
                  <Home />
                </UserProvider>
              </SnackbarProvider>
            </BlockchainProvider>
          </FileUploaderProvider>
        </FlowEventsProvider>
      </SWRConfig>
    </div>
  );
}

export default App;
