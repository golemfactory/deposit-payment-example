import chalk from "chalk";

import debug from "debug";

console.log("debug", debug);
export const debugLog = (service: string, ...rest: unknown[]) => {
  console.log(
    chalk.magenta("deposit-backend"),
    chalk.blueBright(`[${service}]:`),
    ...rest
  );
};
