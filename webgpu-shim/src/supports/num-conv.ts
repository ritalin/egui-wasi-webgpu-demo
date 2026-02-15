export const SafeNumber = function (v: bigint | undefined): number | undefined {
  if (v === undefined) {
    return undefined;
  }
  if (v > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`Shim: Value ${v} exceeds Number.MAX_SAFE_INTEGER`);
  }

  return Number(v);
};
