import { ErrorCode, errorMessages, ErrorPayload } from "./codes.js";

export class CustomError extends Error {
  code: ErrorCode;
  constructor({ code, payload }: ErrorPayload) {
    const message = errorMessages[code];
    // @ts-ignore
    super(message(payload));
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
