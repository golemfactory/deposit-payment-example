const config = process.env;

const requiredEnv = [
  "JWT_SECRET",
  "JWT_TOKEN_EXPIRATION",
  "JWT_REFRESH_TOKEN_EXPIRATION",
  "JWT_ISSUER",
];

const ensureEnv = (env: string): string => {
  console.log("config", config);
  if (config[env] === undefined) {
    throw new Error(`Environment variable ${env} is missing`);
  } else {
    // @ts-ignore
    return config[env];
  }
};

export default {
  JWT_SECRET: ensureEnv("JWT_SECRET"),
  JWT_TOKEN_EXPIRATION: ensureEnv("JWT_TOKEN_EXPIRATION"),
  JWT_REFRESH_TOKEN_EXPIRATION: ensureEnv("JWT_REFRESH_TOKEN_EXPIRATION"),
  JWT_ISSUER: ensureEnv("JWT_ISSUER"),
};
