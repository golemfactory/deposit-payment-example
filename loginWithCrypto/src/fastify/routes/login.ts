import { RouteOptions } from "fastify";
import { verifyMessage } from "../../utils/verifyMessage.js";
import jwt from "jsonwebtoken";
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
      const tokens = {
        accessToken: jwt.sign({ id: user.id }, config.JWT_SECRET, {
          expiresIn: config.JWT_TOKEN_EXPIRATION,
        }),
        refreshToken: jwt.sign({ id: user.id }, config.JWT_SECRET, {
          expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION,
        }),
      };

      res.send(tokens);
    } else {
      res.status(401).send({ message: "Invalid signature" });
    }
  },
};
