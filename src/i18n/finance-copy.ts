import type { Locale } from "./locales";

type FinanceCopy = {
  rates: { amount: string; daily: string; flexible: string; flexibleNote: string; fixed: string; fixedNote: string };
  sections: { advantages: string; popular: string; more: string };
  features: readonly [readonly [string,string,string,string,string], readonly [string,string,string,string,string], readonly [string,string,string,string,string]];
  quick: readonly [readonly [string,string], readonly [string,string], readonly [string,string], readonly [string,string]];
  benefits: readonly [readonly [string,string], readonly [string,string], readonly [string,string], readonly [string,string]];
  coins: readonly string[]; coinColumns: readonly string[];
  advantages: readonly string[]; advantageBody: string;
};

const copy: Record<Locale, FinanceCopy> = {
  en: {
    rates:{amount:"Deposit Amount (USDC)",daily:"Daily Interest",flexible:"Flexible Savings Rates",flexibleNote:"Deposit and withdraw anytime",fixed:"Fixed Savings Rates",fixedNote:"Fixed term"},
    sections:{advantages:"Our Advantages",popular:"Popular Coins",more:"More"},
    features:[["Mystery Box","Every entry wins","Top reward","8888 USDC","Draw Now"],["Invite Friends","Premium rewards","Maximum rebate","15%","Invite Now"],["Liquidity Mining","Provide liquidity","Earn","Platform tokens","Join Now"]],
    quick:[["Mystery Box","Every entry wins"],["Invite Friends","Up to 15% rebate"],["Liquidity Mining","Earn platform tokens"],["Fixed Savings","Daily interest up to 11%"]],
    benefits:[["Secure and Reliable","Multi-layer audits protect assets"],["Smart Contracts","Transparent and verifiable on-chain"],["Multi-chain Support","Supports 12+ major networks"],["Global Operations","Compliance-oriented global service"]],
    coins:["Bitcoin","Ethereum","BNB","XRP","Dogecoin","Polkadot"], coinColumns:["Coin","Price","24H Change","24H Volume","Trend"],
    advantages:["Rewards Program","Blockchain Savings Cash Service","How to stake USDC in your wallet","How to invite friends","What is Blockchain Savings","How Blockchain Savings works","Is Blockchain Savings secure","Our development journey","Blockchain Savings plans","Participant guide","How to join"],
    advantageBody:"Review the applicable plan, supported network, wallet authorization, fees, returns, and exit rules before participating. All actions are transparent and verifiable on-chain; contact support if you need assistance.",
  },
  "zh-CN": {
    rates:{amount:"存款金额（USDC）",daily:"每日利率（Daily Interest）",flexible:"灵活储蓄利率表",flexibleNote:"随存随取",fixed:"定期储蓄利率表",fixedNote:"固定期限"}, sections:{advantages:"我们的优势",popular:"热门币种",more:"更多"},
    features:[["盲盒抽奖","100%中奖","最高奖励","8888 USDC","去抽奖"],["邀请好友","享高额返佣","最高返佣","15%","立即邀请"],["流动性挖矿","提供流动性","赚取","平台通证","立即参与"]], quick:[["盲盒抽奖","100%中奖"],["邀请好友","最高返佣15%"],["流动性挖矿","赚取平台通证"],["定期储蓄","每日利率最高11%"]], benefits:[["安全可靠","多重审计，保障资产安全"],["智能合约","公开透明，链上可验证"],["多链支持","支持12+主流公链"],["全球合规","合规运营，服务全球"]], coins:["比特币","以太坊","币安币","瑞波币","狗狗币","波卡币"], coinColumns:["币种","价格","24H涨跌","24H成交额","趋势"], advantages:["福利活动","Blockchain Savings 现金服务","如何在钱包中质押 USDC","如何邀请朋友加入","什么是 Blockchain Savings","Blockchain Savings 的工作原理","Blockchain Savings 安全可靠吗","Blockchain Savings 的发展历程","Blockchain Savings 储蓄计划","参与者须知","如何加入"], advantageBody:"参与前请核对计划、支持网络、钱包授权、费用、收益和退出规则。所有操作均公开透明并可在链上验证，如需帮助请联系在线支持。",
  },
  "zh-TW": {
    rates:{amount:"存款金額（USDC）",daily:"每日利率（Daily Interest）",flexible:"靈活儲蓄利率表",flexibleNote:"隨存隨取",fixed:"定期儲蓄利率表",fixedNote:"固定期限"}, sections:{advantages:"我們的優勢",popular:"熱門幣種",more:"更多"},
    features:[["盲盒抽獎","100%中獎","最高獎勵","8888 USDC","立即抽獎"],["邀請好友","享高額返佣","最高返佣","15%","立即邀請"],["流動性挖礦","提供流動性","賺取","平台代幣","立即參與"]], quick:[["盲盒抽獎","100%中獎"],["邀請好友","最高返佣15%"],["流動性挖礦","賺取平台代幣"],["定期儲蓄","每日利率最高11%"]], benefits:[["安全可靠","多重稽核保障資產安全"],["智能合約","公開透明，鏈上可驗證"],["多鏈支援","支援12+主流公鏈"],["全球合規","合規營運，服務全球"]], coins:["比特幣","以太幣","幣安幣","瑞波幣","狗狗幣","波卡幣"], coinColumns:["幣種","價格","24H漲跌","24H成交額","趨勢"], advantages:["福利活動","Blockchain Savings 現金服務","如何在錢包中質押 USDC","如何邀請朋友加入","什麼是 Blockchain Savings","Blockchain Savings 的運作方式","Blockchain Savings 安全可靠嗎","Blockchain Savings 的發展歷程","Blockchain Savings 儲蓄計畫","參與者須知","如何加入"], advantageBody:"參與前請核對計畫、支援網路、錢包授權、費用、收益與退出規則。所有操作均公開透明並可在鏈上驗證，如需協助請聯絡線上支援。",
  },
  ja: {
    rates:{amount:"預入金額（USDC）",daily:"日次金利（Daily Interest）",flexible:"フレキシブル貯蓄金利",flexibleNote:"いつでも入出金可能",fixed:"定期貯蓄金利",fixedNote:"固定期間"}, sections:{advantages:"選ばれる理由",popular:"人気の通貨",more:"もっと見る"},
    features:[["ミステリーボックス","必ず当選","最高報酬","8888 USDC","抽選する"],["友達を招待","特別報酬","最大還元","15%","今すぐ招待"],["流動性マイニング","流動性を提供","獲得","プラットフォームトークン","参加する"]], quick:[["ミステリーボックス","必ず当選"],["友達を招待","最大15%還元"],["流動性マイニング","トークンを獲得"],["定期貯蓄","日次金利は最大11%"]], benefits:[["安全性と信頼性","多層監査で資産を保護"],["スマートコントラクト","透明でオンチェーン検証可能"],["マルチチェーン対応","主要12以上のネットワークに対応"],["グローバル運営","コンプライアンス重視のサービス"]], coins:["ビットコイン","イーサリアム","BNB","XRP","ドージコイン","ポルカドット"], coinColumns:["通貨","価格","24H変動","24H取引高","トレンド"], advantages:["特典プログラム","現金サービス","ウォレットでUSDCをステークする方法","友達を招待する方法","Blockchain Savingsとは","仕組みについて","安全性について","サービスの歩み","貯蓄プラン","参加前の確認事項","参加方法"], advantageBody:"参加前にプラン、対応ネットワーク、ウォレット承認、手数料、収益、解約条件をご確認ください。操作はオンチェーンで透明に検証できます。サポートが必要な場合はお問い合わせください。",
  },
  ko: {
    rates:{amount:"예치 금액 (USDC)",daily:"일일 이자율 (Daily Interest)",flexible:"자유 적립 금리",flexibleNote:"언제든 입출금",fixed:"정기 적립 금리",fixedNote:"고정 기간"}, sections:{advantages:"주요 장점",popular:"인기 코인",more:"더보기"},
    features:[["미스터리 박스","100% 당첨","최고 보상","8888 USDC","추첨하기"],["친구 초대","프리미엄 리워드","최대 리베이트","15%","지금 초대"],["유동성 채굴","유동성 제공","획득","플랫폼 토큰","참여하기"]], quick:[["미스터리 박스","100% 당첨"],["친구 초대","최대 15% 리베이트"],["유동성 채굴","플랫폼 토큰 획득"],["정기 적립","일일 이자율 최대 11%"]], benefits:[["안전성과 신뢰성","다중 감사를 통한 자산 보호"],["스마트 계약","투명하고 온체인 검증 가능"],["멀티체인 지원","12개 이상의 주요 네트워크 지원"],["글로벌 운영","규정 준수 중심의 글로벌 서비스"]], coins:["비트코인","이더리움","BNB","XRP","도지코인","폴카닷"], coinColumns:["코인","가격","24H 변동","24H 거래량","추세"], advantages:["리워드 프로그램","현금 서비스","지갑에서 USDC 스테이킹하기","친구 초대 방법","Blockchain Savings 소개","운영 방식","보안 안내","서비스 발전 과정","적립 플랜","참여자 안내","참여 방법"], advantageBody:"참여 전에 플랜, 지원 네트워크, 지갑 승인, 수수료, 수익 및 종료 조건을 확인하세요. 모든 작업은 온체인에서 투명하게 검증할 수 있으며 도움이 필요하면 지원팀에 문의할 수 있습니다.",
  },
  th: {
    rates:{amount:"จำนวนเงินฝาก (USDC)",daily:"ดอกเบี้ยรายวัน (Daily Interest)",flexible:"อัตราออมทรัพย์แบบยืดหยุ่น",flexibleNote:"ฝากและถอนได้ทุกเมื่อ",fixed:"อัตราออมทรัพย์แบบกำหนดเวลา",fixedNote:"ระยะเวลาคงที่"}, sections:{advantages:"จุดเด่นของเรา",popular:"เหรียญยอดนิยม",more:"เพิ่มเติม"},
    features:[["กล่องสุ่ม","ได้รับรางวัลทุกครั้ง","รางวัลสูงสุด","8888 USDC","สุ่มเลย"],["เชิญเพื่อน","รับรางวัลพิเศษ","เงินคืนสูงสุด","15%","เชิญเลย"],["ขุดสภาพคล่อง","เพิ่มสภาพคล่อง","รับ","โทเคนแพลตฟอร์ม","เข้าร่วม"]], quick:[["กล่องสุ่ม","ได้รับรางวัลทุกครั้ง"],["เชิญเพื่อน","เงินคืนสูงสุด 15%"],["ขุดสภาพคล่อง","รับโทเคนแพลตฟอร์ม"],["ออมแบบกำหนดเวลา","ดอกเบี้ยรายวันสูงสุด 11%"]], benefits:[["ปลอดภัยและเชื่อถือได้","การตรวจสอบหลายชั้นช่วยปกป้องสินทรัพย์"],["สมาร์ตคอนแทรกต์","โปร่งใสและตรวจสอบบนเชนได้"],["รองรับหลายเชน","รองรับเครือข่ายหลักมากกว่า 12 แห่ง"],["ดำเนินงานทั่วโลก","บริการที่ให้ความสำคัญกับการปฏิบัติตามกฎ"]], coins:["Bitcoin","Ethereum","BNB","XRP","Dogecoin","Polkadot"], coinColumns:["เหรียญ","ราคา","เปลี่ยนแปลง 24H","ปริมาณ 24H","แนวโน้ม"], advantages:["โปรแกรมรางวัล","บริการเงินสด","วิธีสเตก USDC ในวอลเล็ต","วิธีเชิญเพื่อน","Blockchain Savings คืออะไร","หลักการทำงาน","ความปลอดภัย","เส้นทางการพัฒนา","แผนการออม","คำแนะนำสำหรับผู้เข้าร่วม","วิธีเข้าร่วม"], advantageBody:"โปรดตรวจสอบแผน เครือข่ายที่รองรับ การอนุญาตวอลเล็ต ค่าธรรมเนียม ผลตอบแทน และเงื่อนไขการออกก่อนเข้าร่วม ทุกขั้นตอนโปร่งใสและตรวจสอบได้บนเชน หากต้องการความช่วยเหลือโปรดติดต่อฝ่ายสนับสนุน",
  },
};

export const getFinanceCopy = (locale: Locale) => copy[locale];

export const chromeCopy: Record<Locale,{promos:readonly (readonly [string,string])[];ticker:readonly string[]}>={
  en:{promos:[["A new way to manage digital assets","Transparent multi-chain savings data"],["Earn USDC with flexible savings","Deposit or withdraw anytime with clear returns"],["Automated on-chain plans","Contract-driven, multi-signature asset management"],["Savings Plan Reward · 3 million ETH","Transparent · Secure · On-chain"]],ticker:["Cryptocurrencies","Exchanges","Market Cap","24H Volume","Market Dominance","On-chain transparency","Multi-signature asset management","Real-time on-chain data","Multi-chain support","Smart contract automation"]},
  "zh-CN":{promos:[["数字资产新方式","多链储蓄与链上透明数据"],["灵活储蓄赚取 USDC","随存随取，收益清晰可见"],["自动执行链上计划","合约驱动，多重签名资产管理"],["储蓄计划奖励 · 3 million ETH","透明 · 安全 · 链上"]],ticker:["加密货币","交易所","市值","24小时量","市场主导","链上公开透明","多重签名资产管理","实时链上数据","多链支持","智能合约自动执行"]},
  "zh-TW":{promos:[["數位資產新方式","多鏈儲蓄與鏈上透明數據"],["靈活儲蓄賺取 USDC","隨存隨取，收益清晰可見"],["自動執行鏈上計畫","合約驅動，多重簽名資產管理"],["儲蓄計畫獎勵 · 3 million ETH","透明 · 安全 · 鏈上"]],ticker:["加密貨幣","交易所","市值","24小時量","市場主導","鏈上公開透明","多重簽名資產管理","即時鏈上數據","多鏈支援","智能合約自動執行"]},
  ja:{promos:[["デジタル資産管理の新しい形","透明なマルチチェーン貯蓄データ"],["フレキシブル貯蓄で USDC を獲得","いつでも入出金でき、収益も明確"],["オンチェーンプランを自動実行","コントラクト駆動のマルチシグ資産管理"],["貯蓄プラン報酬 · 3 million ETH","透明 · 安全 · オンチェーン"]],ticker:["暗号資産","取引所","時価総額","24時間出来高","市場シェア","オンチェーン透明性","マルチシグ資産管理","リアルタイムオンチェーンデータ","マルチチェーン対応","スマートコントラクト自動化"]},
  ko:{promos:[["디지털 자산 관리의 새로운 방식","투명한 멀티체인 적립 데이터"],["자유 적립으로 USDC 획득","언제든 입출금하고 수익을 명확히 확인"],["온체인 플랜 자동 실행","계약 기반 다중 서명 자산 관리"],["적립 플랜 보상 · 3 million ETH","투명 · 안전 · 온체인"]],ticker:["암호화폐","거래소","시가총액","24시간 거래량","시장 점유율","온체인 투명성","다중 서명 자산 관리","실시간 온체인 데이터","멀티체인 지원","스마트 계약 자동화"]},
  th:{promos:[["แนวทางใหม่สำหรับสินทรัพย์ดิจิทัล","ข้อมูลการออมหลายเชนที่โปร่งใส"],["รับ USDC ด้วยการออมแบบยืดหยุ่น","ฝากหรือถอนได้ทุกเมื่อ พร้อมผลตอบแทนที่ชัดเจน"],["ดำเนินแผนบนเชนอัตโนมัติ","จัดการสินทรัพย์แบบหลายลายเซ็นด้วยสัญญา"],["รางวัลแผนการออม · 3 million ETH","โปร่งใส · ปลอดภัย · บนเชน"]],ticker:["คริปโทเคอร์เรนซี","ตลาดซื้อขาย","มูลค่าตลาด","ปริมาณ 24 ชั่วโมง","ส่วนแบ่งตลาด","ความโปร่งใสบนเชน","จัดการสินทรัพย์หลายลายเซ็น","ข้อมูลบนเชนแบบเรียลไทม์","รองรับหลายเชน","สมาร์ตคอนแทรกต์อัตโนมัติ"]},
};
