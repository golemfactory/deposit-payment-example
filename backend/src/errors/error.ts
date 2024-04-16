import { ErrorCode, errorMessages } from "./codes.js";

export class CustomError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode) {
    const message = errorMessages[code];
    super(message);
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
