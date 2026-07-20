import { describe, expect, it, vi } from "vitest";
import { detectEvmWalletProviders, getPreferredEvmProvider } from "@/lib/wallet-provider";

function provider(flags: Record<string, boolean>) {
  return { request: vi.fn(), ...flags };
}

describe("wallet provider detection", () => {
  it("detects the supported injected EVM wallet families", () => {
    const providers = [
      provider({ isMetaMask: true }),
      provider({ isCoinbaseWallet: true }),
      provider({ isOkxWallet: true }),
      provider({ isTrust: true }),
      provider({ isBitKeep: true }),
      provider({ isTokenPocket: true }),
      provider({ isRabby: true }),
      provider({ isBinance: true }),
    ];

    const detected = detectEvmWalletProviders({ ethereum: { providers } });

    expect(detected.map((item) => item.name)).toEqual([
      "MetaMask",
      "Coinbase Wallet",
      "OKX Wallet",
      "Trust Wallet",
      "Bitget Wallet",
      "TokenPocket",
      "Rabby Wallet",
      "Binance Wallet",
    ]);
  });

  it("prefers a recognized provider but can fall back to a generic EVM wallet", () => {
    const generic = provider({});
    const rabby = provider({ isRabby: true });

    expect(getPreferredEvmProvider({ ethereum: { providers: [generic, rabby] } })?.name).toBe("Rabby Wallet");
    expect(getPreferredEvmProvider({ ethereum: generic })?.name).toBe("EVM Wallet");
  });
});
