import { connectWallet } from "@/lib/wallet-service";
import { sendApproveTransaction, sendDepositTransaction } from "@/lib/pool-integration";

export default function PoolsPage() {
  // 当用户在 21 个池子矩阵里，选中了某个 VIP 池子并点击“投资”时触发
  const handleInvest = async (poolAddress: string, tokenAddress: string, tokenSymbol: string) => {
    const provider = (window as any).ethereum;
    if (!provider) return alert("请在手机钱包内置浏览器中打开此页面！");

    try {
      // ① 先通过总开关连接并核对网络
      const currentAccount = await connectWallet(provider);

      // 假设用户输入了 100 块
      const amountInput = "100"; 
      const parsedAmount = BigInt(amountInput) * 1000000000000000000n; // 18位精度大数

      // ② & ③ 顺应用户点击瞬间的“安全期”，立刻连续顶出“添加代币资产”弹窗
      console.log("正在引导钱包展示代币:", tokenSymbol);
      await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress, // 你的 HBUSDT 地址
            symbol: tokenSymbol,     
            decimals: 18, 
          },
        },
      });

      // ④ 弹出授权（Approve）确认
      alert(`请在钱包中同意授权 ${tokenSymbol} 投资额度...`);
      const approveResult = await sendApproveTransaction({
        ethereum: provider,
        from: currentAccount,
        tokenAddress: tokenAddress,
        spender: poolAddress, // 对应的 VIP 资金池地址
        amount: parsedAmount,
      });

      if (!approveResult.success) return alert("授权失败，投资终止。");

      // ⑤ 授权成功，无缝衔接最终的理财池入金（Deposit）
      alert("授权成功！正在发起理财入金，请在钱包中最终确认...");
      const depositResult = await sendDepositTransaction({
        ethereum: provider,
        from: currentAccount,
        poolAddress: poolAddress,
        amount: parsedAmount,
      });

      if (depositResult.success) {
        alert(`🎉 成功向该理财池投入 ${amountInput} ${tokenSymbol}！`);
        // 💡 这里可以调用你的清单第2项：API 客户端 (api-client.ts) 去通知后端记录或刷新本地数据
      } else {
        alert("银行家扣款回滚，请检查余额是否充足。");
      }

    } catch (error) {
      console.error("池子交互流程中断:", error);
    }
  };

  return (
    // 你的 VIP1 到 VIP7 渲染列表...
    // 按钮点击时：onClick={() => handleInvest("你的投资合约", "你的USDT合约", "HBUSDT")}
    <button>点击投资</button>
  );
}
