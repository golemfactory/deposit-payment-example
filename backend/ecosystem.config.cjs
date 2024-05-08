module.exports = {
  apps: [
    {
      script: "./dist/index.js",
      watch: true,
      env: {
        MONGO_URI:
          "mongodb+srv://pociej:khe4DyXCtR4JgvIa@depositdev.dibhotw.mongodb.net/?retryWrites=true&w=majority&appName=depositDev",
        PORT: 5174,
        HOST: "127.0.0.1",
        DB_NAME: "depositDB",
        YAGNA_APPKEY: "5b30314f24c845eeb57b4a21fe9bac70",
        JWT_SECRET: "vemo24mf10fjqz6mvaslg9",
        JWT_TOKEN_EXPIRATION: "1d",
        JWT_REFRESH_TOKEN_EXPIRATION: "7d",
        JWT_ISSUER: "golem.network",
        SERVICE_FEE: "0.1",
        DEPOSIT_CONTRACT_ADDRESS: "0xA3D86ebF4FAC94114526f4D09C3fA093898347a6",
        YAGNA_SUBNET: "pociej_own",
        YAGNA_API_URL: "http://localhost:7465",
      },
    },
  ],
};
