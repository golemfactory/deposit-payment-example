import { use } from "i18next";
import { useSyncExternalEvents } from "./useSyncExternalEvent";

export const useCreateAllocationEvents = () => {
  return useSyncExternalEvents("allocationEvents");
};
