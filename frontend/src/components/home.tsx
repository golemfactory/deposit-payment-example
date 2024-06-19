import { Layout } from "./layout/layout";
import { TopBar } from "./homePage/topBar";
import { Events } from "./homePage/events/events";
import { Status } from "./homePage/status";
import { Action } from "./homePage/action";
import { LayoutProvider } from "./providers/layoutProvider";

export function Home() {
  return (
    <LayoutProvider>
      <Layout
        header={<TopBar />}
        left={
          <div>
            <Events />
          </div>
        }
        center={
          <div className="w-full">
            <Action />
            <div className="mt-12"></div>
            <Status />
          </div>
        }
      />
    </LayoutProvider>
  );
}
