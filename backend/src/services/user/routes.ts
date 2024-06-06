import { FastifyInstance } from "fastify";
import { container } from "../../di.js";
import fastifyPlugin from "fastify-plugin";
import { jwtDecode } from "jwt-decode";
export const userService = fastifyPlugin(
  (fastify: FastifyInstance, opts, done) => {
    fastify.io.of("/me").use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        next(new Error("Authentication error"));
      }
      next();
    });

    fastify.io.of("/me").on("connection", async (socket) => {
      const user = jwtDecode<{
        _id: string;
      }>(socket.handshake.auth.token);

      if (!user._id) {
        throw new Error(`Wrong token`);
      }
      if (!user) {
        throw new Error(
          `User not found with id ${socket.handshake.auth.token}`
        );
      }

      const userDTO = await container.cradle.userService.getUserDTO(user._id);
      socket.emit("user", userDTO);

      setInterval(async () => {
        const userDTO = await container.cradle.userService.getUserDTO(user._id);
        socket.emit("user", userDTO);
      }, 500);

      //TODO: watch for changes but this will need replica set

      // userModel
      //   .watch(
      //     [
      //       {
      //         $match: {
      //           _id: user._id,
      //         },
      //       },
      //     ],
      //     {
      //       fullDocument: "updateLookup",
      //     }
      //   )
      //   .on("change", async () => {
      //     console.log("change");
      //     const userDTO = await container.cradle.userService.getUserDTO(
      //       user._id
      //     );
      //     socket.emit("user", userDTO);
      //   });
    });
    // fastify.get(
    //   "/me",
    //   {
    //     websocket: true,
    //     onRequest: [fastify.authenticate],
    //   },
    //   async (socket, request) => {
    //     console.log("socket", request.user._id);
    //     const userService = container.cradle.userService;
    //     const requestUser = request.user;
    //     const user = await userService.findById(requestUser._id);
    //     console.log("user", user);
    //     if (!user) {
    //       throw new Error(`User not found with id ${requestUser._id}`);
    //     }

    //   }
    // );
    done();
  }
);
