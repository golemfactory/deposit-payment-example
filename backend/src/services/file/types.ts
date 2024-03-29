export const fileStatus = {
  CLEAN: "clean",
  INFECTED: "infected",
} as const;
export interface IScanResult {
  id: string;
  result: (typeof fileStatus)[keyof typeof fileStatus] | "error";
  data?: object;
}
