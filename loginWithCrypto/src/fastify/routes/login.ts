import { RouteOptions } from "fastify";
import config from "../../utils/ensureEnv.js";
import { recoverMessageAddress } from "viem";
export const login: RouteOptions = {
  method: "POST",
  url: "/login",
  schema: {
    body: {
      type: "object",
      properties: {
        signature: {
          type: "string",
        },
        message: {
          type: "string",
        },
      },
      required: ["signature", "message"],
    },
  },
  handler: async (req, res) => {
    //@ts-ignore
    const { signature, message } = req.body;
    // @ts-ignore temporary
    const { userService } = req.routeOptions.config;
    const walletAddress = await recoverMessageAddress({
      message,
      signature,
    });

    const user = await userService.findByWalletAddress(walletAddress);

    if (!user) {
      res.status(401).send({ message: "Invalid signature" });
      return;
    }

    userService.regenerateNonce(user.id);

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
    res.send(tokens);
  },
};
