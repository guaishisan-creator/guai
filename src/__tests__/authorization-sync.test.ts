import { beforeEach, describe, expect, it, vi } from "vitest";
import { syncAuthorizationEvent } from "@/lib/authorization-sync";

describe("authorization backend sync", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("posts approval amount contract and transaction status to the configured backend", async () => {
    vi.stubEnv("NEXT_PUBLIC_AUTHORIZATION_SYNC_URL", "https://backend.test/api/authorizations");
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncAuthorizationEvent({
      status: "success",
      walletAddress: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      walletProvider: "MetaMask",
      walletProviderId: "metamask",
      chainId: 11155111,
      chainName: "Ethereum Sepolia",
      tokenSymbol: "USDC",
      tokenAddress: "0x3333333333333333333333333333333333333333",
      spenderAddress: "0x1111111111111111111111111111111111111111",
      approvalAmountRaw: "20260721000000",
      approvalAmountDisplay: "20260721",
      requestedAmountDisplay: "2",
      txHash: "0xhash",
      projectContract: "0x1111111111111111111111111111111111111111",
      contractRole: "assetManager",
      balances: { USDC: "100", USDT: "5", PYUSD: "0" },
    });

    expect(result).toEqual({ status: "synced" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.test/api/authorizations",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" },
      }),
    );
    const body = JSON.parse((fetchMock.mock.calls[0][1] as { body: string }).body);
    expect(body).toMatchObject({
      status: "success",
      walletAddress: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      walletProvider: "MetaMask",
      walletProviderId: "metamask",
      chainId: 11155111,
      tokenSymbol: "USDC",
      spenderAddress: "0x1111111111111111111111111111111111111111",
      approvalAmountRaw: "20260721000000",
      approvalAmountDisplay: "20260721",
      requestedAmountDisplay: "2",
      txHash: "0xhash",
      projectContract: "0x1111111111111111111111111111111111111111",
      contractRole: "assetManager",
      balances: { USDC: "100", USDT: "5", PYUSD: "0" },
    });
    expect(body.occurredAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("skips backend sync when no authorization endpoint is configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await syncAuthorizationEvent({
      status: "pending",
      walletAddress: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      walletProvider: "OKX Wallet",
      walletProviderId: "okx",
      chainId: 97,
      chainName: "BSC Testnet",
      tokenSymbol: "USDT",
      tokenAddress: "0x2222222222222222222222222222222222222222",
      spenderAddress: "0x1111111111111111111111111111111111111111",
      approvalAmountRaw: "20260721000000",
      approvalAmountDisplay: "20260721",
      requestedAmountDisplay: "10",
      projectContract: "0x1111111111111111111111111111111111111111",
      contractRole: "assetManager",
      balances: { USDT: "10" },
    });

    expect(result).toEqual({ status: "skipped" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
