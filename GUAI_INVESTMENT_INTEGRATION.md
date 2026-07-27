# GUAI Sepolia 理财接入

已在主页“进入智能合约”按钮接入链上操作弹窗：

1. 连接 EVM 钱包
2. 切换 Sepolia
3. 添加 HBUSDT
4. 授权 TestUSDT
5. 调用 Investment.invest
6. 调用 Investment.claim
7. 读取余额与 userInfo

## 合约地址

- Investment: `0x130758E537332011064f497892e4B34271EA21D8`
- TestUSDT: `0xE475af00f7f5aDB7E742489558F23d7f03a4E2A3`
- HBUSDT: `0x828Fe3DFF3F06fEBBE22DDb04BdAac8cc5F33Ce3`

## 主要改动

- 新增 `src/components/finance/investment-entry-button.tsx`
- 修改 `src/components/finance/savings-rate-table.tsx`
- `package.json` 新增 `ethers`

## 部署

在项目目录执行：

```bash
npm install
npm run build
```

然后推送至 GitHub，Vercel 会自动重新部署。
