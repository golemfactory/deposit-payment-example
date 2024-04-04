import chalk from "chalk";

export const debugLog = (service: string, ...rest: unknown[]) => {
  console.log(
    chalk.magenta("deposit-backend"),
    chalk.blueBright(`[${service}]:`),
    ...rest
  );
};
