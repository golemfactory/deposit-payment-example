export function assertBigInt(value: unknown): asserts value is BigInt {
  if (typeof value !== "bigint") {
    throw new Error(`Expected BigInt, got ${typeof value}`);
  }
}
