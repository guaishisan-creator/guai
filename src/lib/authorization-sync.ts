import type { AssetSymbol } from "./asset-manager-client";

export type AuthorizationSyncStatus = "pending" | "submitted" | "success" | "failed";
export type AuthorizationContractRole = "assetManager" | "pool" | "ledger" | "unknown";

export type AuthorizationSyncPayload = {
  status: AuthorizationSyncStatus;
  walletAddress: string;
  walletProvider: string;
  walletProviderId: string;
  chainId: number;
  chainName: string;
  tokenSymbol: AssetSymbol;
  tokenAddress: string;
  spenderAddress: string;
  approvalAmountRaw: string;
  approvalAmountDisplay: string;
  requestedAmountDisplay: string;
  projectContract: string;
  contractRole: AuthorizationContractRole;
  balances: Partial<Record<AssetSymbol, string>>;
  txHash?: string;
  errorMessage?: string;
  occurredAt?: string;
};

export type AuthorizationSyncResult =
  | { status: "skipped" }
  | { status: "synced" }
  | { status: "failed"; error: string };

export async function syncAuthorizationEvent(
  payload: AuthorizationSyncPayload,
): Promise<AuthorizationSyncResult> {
  const url = process.env.NEXT_PUBLIC_AUTHORIZATION_SYNC_URL?.trim();
  if (!url) return { status: "skipped" };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...payload,
        occurredAt: payload.occurredAt || new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      return { status: "failed", error: `Authorization sync failed: ${response.status}` };
    }
    return { status: "synced" };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Authorization sync failed",
    };
  }
}
