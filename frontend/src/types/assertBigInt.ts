export function assertBigInt(value: unknown): asserts value is bigint {
  if (typeof value !== "bigint") {
    throw new Error(`Expected BigInt, got ${typeof value}`);
  }
}

export function assertOptionalBigInt(
  value: unknown
): asserts value is bigint | undefined {
  if (value !== undefined && typeof value !== "bigint") {
    throw new Error(`Expected BigInt or undefined, got ${typeof value}`);
  }
}
