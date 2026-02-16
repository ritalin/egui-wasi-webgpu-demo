export const SafeU64 = function (v: bigint | undefined): number | undefined {
  if (v === undefined) {
    return undefined;
  }
  if (v < 0n) {
    throw new Error(`Shim: Negative value ${v} is not allowed`);
  }
  if (v > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`Shim: Value ${v} exceeds Number.MAX_SAFE_INTEGER`);
  }

  return Number(v);
};

export const StrictU64 = function (v: bigint): number {
  if (v < 0n) {
    throw new Error(`Shim: Negative value ${v} is not allowed`);
  }
  if (v > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`Shim: Value ${v} exceeds Number.MAX_SAFE_INTEGER`);
  }

  return Number(v);
};
