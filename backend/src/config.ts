const envConfig = process.env;

const requiredEnv = [
  "MONGO_URI",
  "DB_NAME",
  "JWT_SECRET",
  "JWT_TOKEN_EXPIRATION",
  "JWT_REFRESH_TOKEN_EXPIRATION",
];

const ensureEnv = (env: string) => {
  if (!envConfig[env]) {
    throw new Error(`Environment variable ${env} is missing`);
  }
};

requiredEnv.forEach(ensureEnv);

export const config = { ...envConfig };
