import { verifyMessage } from "./verifyMessage";

const address = "0xa68701d9b3eb52f0a7248e7b57d484411a60b045";
const message = "14b2a79636d81fbb10f9";
const signature =
  "0x5d8f425c91437148b65f47e9444d91e868d3566d868649fec58c76010c8f01992edd2db3284088d5f5048fc3bc9eff307e0cd1b8b1a2e6c96a2784eb5fd5358d1b";

describe("Signature authentication", () => {
  it("should properly verify message", async () => {
    expect(await verifyMessage({ message, address, signature })).toBeTruthy();
    expect(
      await verifyMessage({ message: "wrong message", address, signature })
    ).toBeFalsy();
  });
});
