import { RouteOptions } from "fastify";
import { verifyMessage } from "../../utils/verifyMessage.js";
import config from "../../utils/ensureEnv.js";

export const login: RouteOptions = {
  method: "POST",
  url: "/login",
  schema: {
    body: {
      type: "object",
      properties: {
        walletAddress: {
          type: "string",
          pattern: "^0x[a-fA-F0-9]{40}$",
        },
        messageSignature: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
      required: ["walletAddress", "messageSignature", "message"],
    },
  },
  handler: async (req, res) => {
    //@ts-ignore
    const { walletAddress, messageSignature, message } = req.body;
    // @ts-ignore temporary
    const { userService } = req.routeOptions.config;
    const isOk = await verifyMessage({
      address: walletAddress,
      signature: messageSignature,
      message: message,
    });

    if (isOk) {
      const user = await userService.findByWalletAddress(walletAddress);
      if (!user) {
        res.status(401).send({ message: "Invalid signature" });
        return;
      }
      userService.regenerateNonce(user.id);

      console.log("user", user);

      console.log(
        "config",
        config.JWT_SECRET,
        config.JWT_TOKEN_EXPIRATION,
        config.JWT_REFRESH_TOKEN_EXPIRATION
      );

      const tokens = {
        accessToken: await res.jwtSign(
          { _id: user._id },
          {
            expiresIn: config.JWT_TOKEN_EXPIRATION,
          }
        ),
        refreshToken: await res.jwtSign(
          { _id: user._id },
          {
            expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION,
          }
        ),
      };
      console.log("tokens", tokens);

      res.send(tokens);
    } else {
      res.status(401).send({ message: "Invalid signature" });
    }
  },
};
