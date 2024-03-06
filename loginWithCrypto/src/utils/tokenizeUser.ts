// import jwt from "jsonwebtoken";
// import dayjs from "dayjs";

// const config = process.env;
// export function tokenizeUser(address) {
//   return jwt.sign(
//     {
//       sub: address,
//       iss: config.JWT_ISSUER,
//       exp: dayjs().add(Number(config.JWT_TOKEN_EXPIRATION), "seconds").unix(),
//     },
//     config.JWT_SECRET
//   );
// }
