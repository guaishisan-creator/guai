import { describe, expect, it, vi } from "vitest";
import {
  buildClaimPositionCalldata,
  buildExchangeEthCalldata,
  buildWithdrawCalldata,
  claimCommissionPosition,
  exchangeEthCommissionForUsdc,
  estimateUsdcFromEth,
  readEthUsdPrice,
  withdrawUsdcBalance,
} from "@/lib/pool-integration";

const account = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const ledger = "0x5555555555555555555555555555555555555555";

describe("pool account actions", () => {
  it("encodes claim exchange and withdraw calldata", () => {
    expect(buildClaimPositionCalldata(7n)).toBe(
      "0xaab8ab0c0000000000000000000000000000000000000000000000000000000000000007",
    );
    expect(buildExchangeEthCalldata(3n)).toBe(
      "0xed2381f30000000000000000000000000000000000000000000000000000000000000003",
    );
    expect(buildWithdrawCalldata(9n)).toBe(
      "0x5b06dece0000000000000000000000000000000000000000000000000000000000000009",
    );
  });

  it("sends real ledger transactions for manual claim exchange and withdraw", async () => {
    vi.stubEnv("NEXT_PUBLIC_LEDGER_ADDRESS", ledger);
    const request = vi
      .fn()
      .mockResolvedValueOnce("0xclaim")
      .mockResolvedValueOnce({ status: "0x1", blockNumber: "0x2" })
      .mockResolvedValueOnce("0xexchange")
      .mockResolvedValueOnce({ status: "0x1", blockNumber: "0x3" })
      .mockResolvedValueOnce("0xwithdraw")
      .mockResolvedValueOnce({ status: "0x1", blockNumber: "0x4" });

    await claimCommissionPosition({ ethereum: { request }, from: account, positionId: 5n });
    await exchangeEthCommissionForUsdc({ ethereum: { request }, from: account, ethAmount: 2n });
    await withdrawUsdcBalance({ ethereum: { request }, from: account, usdcAmount: 4n });

    expect(request).toHaveBeenNthCalledWith(1, {
      method: "eth_sendTransaction",
      params: [{ from: account, to: ledger, data: buildClaimPositionCalldata(5n) }],
    });
    expect(request).toHaveBeenNthCalledWith(3, {
      method: "eth_sendTransaction",
      params: [{ from: account, to: ledger, data: buildExchangeEthCalldata(2n) }],
    });
    expect(request).toHaveBeenNthCalledWith(5, {
      method: "eth_sendTransaction",
      params: [{ from: account, to: ledger, data: buildWithdrawCalldata(4n) }],
    });
  });

  it("reads ETH/USD feed data and estimates USDC output", async () => {
    vi.stubEnv("NEXT_PUBLIC_ETH_USD_FEED_ADDRESS", "0x7777777777777777777777777777777777777777");
    const request = vi
      .fn()
      .mockResolvedValueOnce("0x0000000000000000000000000000000000000000000000000000000000000008")
      .mockResolvedValueOnce(
        [
          "0x",
          "0000000000000000000000000000000000000000000000000000000000000001",
          "0000000000000000000000000000000000000000000000000000002f2be6aa00",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000000",
          "0000000000000000000000000000000000000000000000000000000000000001",
        ].join(""),
      );

    const price = await readEthUsdPrice({ request });

    expect(price).toEqual({ answer: 202600000000n, decimals: 8 });
    expect(estimateUsdcFromEth(1000000000000000000n, price)).toBe(2026000000n);
  });
});
