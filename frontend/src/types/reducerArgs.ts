export type EventWithPayload<T> = {
  [K in keyof T]: T[K] extends never
    ? { kind: K; payload?: never }
    : { kind: K; payload: T[K] };
}[keyof T];
