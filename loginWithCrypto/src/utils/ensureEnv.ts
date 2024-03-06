const config = process.env;

const requiredEnv = [
  "JWT_SECRET",
  "JWT_TOKEN_EXPIRATION",
  "JWT_REFRESH_TOKEN_EXPIRATION",
  "JWT_ISSUER",
];

const ensureEnv = (env: string) => {
  if (!config[env]) {
    throw new Error(`Environment variable ${env} is missing`);
  }
};

requiredEnv.forEach(ensureEnv);

export { config };
