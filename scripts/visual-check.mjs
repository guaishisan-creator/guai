import { mkdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";

function parseArgs(argv) {
  const parsed = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const withoutPrefix = arg.slice(2);
    const equalsIndex = withoutPrefix.indexOf("=");
    if (equalsIndex >= 0) {
      parsed.set(withoutPrefix.slice(0, equalsIndex), withoutPrefix.slice(equalsIndex + 1));
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      parsed.set(withoutPrefix, next);
      index += 1;
    } else {
      parsed.set(withoutPrefix, "true");
    }
  }
  return parsed;
}

function getGitShortSha() {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "nogit";
  }
}

function getUrlPort(rawUrl) {
  const parsed = new URL(rawUrl);
  if (parsed.port) return parsed.port;
  if (parsed.protocol === "https:") return "443";
  if (parsed.protocol === "http:") return "80";
  return "unknown";
}

function createTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

const args = parseArgs(process.argv.slice(2));

const url = args.get("url");
if (!url) {
  console.error(JSON.stringify({
    error: "Missing required --url argument",
    usage: "node scripts/visual-check.mjs --url=http://127.0.0.1:3107 [--out=artifacts]",
  }, null, 2));
  process.exit(1);
}

const outDir = args.get("out") || `${process.env.USERPROFILE}\\Desktop`;
mkdirSync(outDir, { recursive: true });
const gitSha = getGitShortSha();
const port = getUrlPort(url);
const timestamp = createTimestamp();

async function launchBrowser() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel, headless: true });
    } catch {
      // Try the next installed Chromium channel.
    }
  }
  return chromium.launch({ headless: true });
}

function addCheck(checks, name, passed, details = {}) {
  if (!passed) checks.push({ name, ...details });
}

async function capturePage({ browser, name, viewport, mobile, selector }) {
  const page = await browser.newPage({
    viewport,
    isMobile: mobile,
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load");

  if (selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  const info = await page.evaluate((targetSelector) => {
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    const rect = target?.getBoundingClientRect();
    const desktopHome = document.querySelector('[data-testid="desktop-home"]');
    const mobileHome = document.querySelector('[data-testid="mobile-home"]');
    const matrix = document.querySelector('[data-testid="desktop-proof-matrix"]');
    const matrixByClass = document.querySelector(".savings-proof-matrix");
    const terminal = document.querySelector('[data-testid="savings-proof-terminal"]');
    const firstProofNode = document.querySelector(".savings-proof-node");
    const footer = document.querySelector('[data-testid="desktop-flow-footer"]');
    const lanes = document.querySelector('[data-testid="desktop-flow-lanes"]');
    const splitGridTracks = (value) => {
      const tracks = [];
      let depth = 0;
      let current = "";
      for (const char of value.trim()) {
        if (char === "(") depth += 1;
        if (char === ")") depth -= 1;
        if (/\s/.test(char) && depth === 0) {
          if (current) {
            tracks.push(current);
            current = "";
          }
          continue;
        }
        current += char;
      }
      if (current) tracks.push(current);
      return tracks;
    };
    const isVisible = (element) => {
      if (!element) return false;
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };
    const matrixStyle = matrixByClass ? getComputedStyle(matrixByClass) : null;
    const firstNodeStyle = firstProofNode ? getComputedStyle(firstProofNode) : null;
    const borderWidths = firstNodeStyle ? [
      firstNodeStyle.borderTopWidth,
      firstNodeStyle.borderRightWidth,
      firstNodeStyle.borderBottomWidth,
      firstNodeStyle.borderLeftWidth,
    ].map((value) => Number.parseFloat(value) || 0) : [];
    const firstNodeRect = firstProofNode?.getBoundingClientRect();
    const gridColumns = matrixStyle?.gridTemplateColumns || "";
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      targetFound: Boolean(target),
      targetVisible: isVisible(target),
      targetRect: rect ? { top: rect.top, bottom: rect.bottom, height: rect.height } : null,
      desktopHome: Boolean(desktopHome),
      desktopHomeVisible: isVisible(desktopHome),
      mobileHome: Boolean(mobileHome),
      mobileHomeVisible: isVisible(mobileHome),
      desktopFooter: Boolean(footer),
      desktopFooterVisible: isVisible(footer),
      proofMatrix: Boolean(matrix),
      proofMatrixVisible: isVisible(matrix),
      proofTerminalVisible: isVisible(terminal),
      proofNodeCount: document.querySelectorAll('[data-testid="savings-proof-node"]').length,
      proofMetricCount: document.querySelectorAll('[data-testid="savings-proof-metric"]').length,
      proofRiskCount: document.querySelectorAll('[data-testid="savings-proof-risk"]').length,
      flowLaneCount: document.querySelectorAll('[data-testid="desktop-flow-lane"]').length,
      proofMatrixComputed: {
        display: matrixStyle?.display || null,
        gridTemplateColumns: gridColumns,
        gridTemplateColumnCount: splitGridTracks(gridColumns).length,
      },
      firstProofNodeComputed: {
        borderWidths,
        hasNonZeroBorder: borderWidths.some((width) => width > 0),
        minHeight: firstNodeStyle?.minHeight || null,
        minHeightPx: firstNodeStyle ? Number.parseFloat(firstNodeStyle.minHeight) || 0 : 0,
        rectHeight: firstNodeRect?.height || 0,
      },
      proofText: matrix?.textContent || "",
      lanesText: lanes?.textContent?.slice(0, 140) || "",
    };
  }, selector);

  const screenshot = path.join(outDir, `hb-chain-dev-${port}-${name}-${viewport.width}x${viewport.height}-${gitSha}-${timestamp}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  await page.close();
  return { name, screenshot, ...info };
}

function getFailedChecks(pc, h5) {
  const failed = [];
  addCheck(failed, "pc.desktop-home.visible", pc.desktopHomeVisible, { actual: pc.desktopHomeVisible });
  addCheck(failed, "pc.mobile-home.notVisible", !pc.mobileHomeVisible, { actual: pc.mobileHomeVisible });
  addCheck(failed, "pc.desktop-proof-matrix.visible", pc.proofMatrixVisible, { actual: pc.proofMatrixVisible });
  addCheck(failed, "pc.savings-proof-terminal.visible", pc.proofTerminalVisible, { actual: pc.proofTerminalVisible });
  addCheck(failed, "pc.savings-proof-node.count", pc.proofNodeCount === 5, { expected: 5, actual: pc.proofNodeCount });
  addCheck(failed, "pc.savings-proof-metric.count", pc.proofMetricCount === 3, { expected: 3, actual: pc.proofMetricCount });
  addCheck(failed, "pc.savings-proof-risk.count", pc.proofRiskCount === 3, { expected: 3, actual: pc.proofRiskCount });
  addCheck(failed, "pc.desktop-flow-footer.visible", pc.desktopFooterVisible, { actual: pc.desktopFooterVisible });
  addCheck(failed, "pc.desktop-flow-lane.count", pc.flowLaneCount === 2, { expected: 2, actual: pc.flowLaneCount });
  addCheck(failed, "pc.noHorizontalOverflow", !pc.overflowX, { scrollWidth: pc.scrollWidth, clientWidth: pc.clientWidth });
  addCheck(failed, "pc.savings-proof-matrix.displayGrid", pc.proofMatrixComputed.display === "grid", { actual: pc.proofMatrixComputed.display });
  addCheck(failed, "pc.savings-proof-engine.minThreeColumns", pc.proofMatrixComputed.gridTemplateColumnCount >= 3, {
    expected: ">=3",
    actual: pc.proofMatrixComputed.gridTemplateColumnCount,
    gridTemplateColumns: pc.proofMatrixComputed.gridTemplateColumns,
  });
  addCheck(failed, "pc.savings-proof-node.nonZeroBorder", pc.firstProofNodeComputed.hasNonZeroBorder, {
    borderWidths: pc.firstProofNodeComputed.borderWidths,
  });
  addCheck(failed, "pc.savings-proof-node.nonZeroHeight", pc.firstProofNodeComputed.rectHeight > 0, {
    rectHeight: pc.firstProofNodeComputed.rectHeight,
    minHeight: pc.firstProofNodeComputed.minHeight,
  });

  addCheck(failed, "h5.mobile-home.visible", h5.mobileHomeVisible, { actual: h5.mobileHomeVisible });
  addCheck(failed, "h5.desktop-home.notVisible", !h5.desktopHomeVisible, { actual: h5.desktopHomeVisible });
  addCheck(failed, "h5.desktop-proof-matrix.notVisible", !h5.proofMatrixVisible, { actual: h5.proofMatrixVisible });
  addCheck(failed, "h5.desktop-flow-footer.notVisible", !h5.desktopFooterVisible, { actual: h5.desktopFooterVisible });
  addCheck(failed, "h5.noHorizontalOverflow", !h5.overflowX, { scrollWidth: h5.scrollWidth, clientWidth: h5.clientWidth });
  return failed;
}

const browser = await launchBrowser();
try {
  const pc = await capturePage({
    browser,
    name: "pc",
    viewport: { width: 1536, height: 1100 },
    mobile: false,
    selector: '[data-testid="desktop-proof-matrix"]',
  });
  const h5 = await capturePage({
    browser,
    name: "h5",
    viewport: { width: 540, height: 1100 },
    mobile: true,
    selector: null,
  });
  const failedChecks = getFailedChecks(pc, h5);
  const result = { url, port, gitSha, timestamp, pc, h5 };
  if (failedChecks.length > 0) {
    console.log(JSON.stringify({ ...result, FAILED_CHECKS: failedChecks }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ ...result, FAILED_CHECKS: [] }, null, 2));
  }
} finally {
  await browser.close();
}
