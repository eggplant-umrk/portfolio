import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// ＝＝＝ SNS 共有用の画像（OGP / Twitter カード）を 1200×630 で生成する共通処理 ＝＝＝
// トップは名前と肩書き、詳細ページは作品名を大きく出す。白い基板（点のグリッド・銅色の配線・IC「UMZW-29」）は
// SVG を data URI にして背景に敷き、文字は ImageResponse（satori）で描く。
// フォント: satori は woff2 を読めないので scripts/fonts-src/ の TTF を使う
//   - Chakra Petch Bold（名前・作品名・IC の型番）/ JetBrains Mono Regular（ラベル）
//     satori は可変フォント JetBrainsMono[wght].ttf を読めないため、wght=400 で固定した JetBrainsMono-Regular.ttf
//     （scripts/instance-font.mjs で生成。ASCII と · — など記号のみ）を使う
//   - Zen Kaku Gothic New Bold（日本語の見出し）
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = path.join(process.cwd(), "scripts", "fonts-src");

// 白の基板の配色（globals.css の :root と同じ値）
const BOARD = "#F2F1EA";
const GRID_DOT = "#C9C7BE";
const COPPER = "#B07A3E";
const CHIP = "#1B1D1B";
const CHIP_PIN = "#9A9C9A";
const SILK = "#141613";
const SILK_SOFT = "#3F463F";
const SILK_LABEL = "#5B675F";
const ACCENT = "#B8390F";
const LED = "#D9441A";

// 背景: 点のグリッド + 右側の IC と銅色の配線（文字は含めない）
function boardSvg() {
  const pins = [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const y = 196 + i * 40;
      return `<rect x="738" y="${y}" width="24" height="18" rx="2" fill="${COPPER}"/><rect x="740" y="${y + 1}" width="20" height="16" fill="${CHIP_PIN}"/>` +
        `<rect x="1038" y="${y}" width="24" height="18" rx="2" fill="${COPPER}"/><rect x="1040" y="${y + 1}" width="20" height="16" fill="${CHIP_PIN}"/>`;
    })
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">` +
    `<defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.4" fill="${GRID_DOT}"/></pattern></defs>` +
    `<rect width="1200" height="630" fill="${BOARD}"/><rect width="1200" height="630" fill="url(#g)"/>` +
    // 基板の外形線
    `<rect x="14" y="14" width="1172" height="602" rx="18" fill="none" stroke="${SILK_LABEL}" stroke-opacity="0.45" stroke-width="2"/>` +
    // 配線（左: 電源 2 本、右: 信号 3 本）とビア
    `<g fill="none" stroke="${COPPER}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">` +
    `<path d="M740 205 H690 L660 175 V110"/><path d="M740 405 H700 L670 435 V560"/>` +
    `<path d="M1060 205 H1100 L1130 175 V120"/><path d="M1060 325 H1120 L1150 355 V560"/><path d="M1060 405 H1100 L1130 435 H1180"/>` +
    `</g>` +
    `<g fill="${BOARD}" stroke="${COPPER}" stroke-width="5"><circle cx="660" cy="110" r="11"/><circle cx="1130" cy="120" r="11"/></g>` +
    // IC 本体とピン（文字は satori 側で重ねる）
    `${pins}<rect x="760" y="180" width="280" height="260" rx="8" fill="${CHIP}"/><circle cx="784" cy="204" r="7" fill="${CHIP_PIN}"/>` +
    // LED
    `<circle cx="1130" cy="120" r="34" fill="${LED}" fill-opacity="0.18"/><circle cx="1130" cy="120" r="14" fill="${LED}"/>` +
    `</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

async function font(file: string) {
  return readFile(path.join(FONT_DIR, file));
}

export async function ogImage({ title }: { title?: string } = {}) {
  const [chakra, mono, zen] = await Promise.all([
    font("ChakraPetch-Bold.ttf"),
    font("JetBrainsMono-Regular.ttf"),
    font("ZenKakuGothicNew-Bold.ttf"),
  ]);
  const background = boardSvg();
  const mainText = title ?? "Riku Umezawa";
  // 作品名が長いときは少し小さく（TrailDrop など 9 文字までは 120px）
  const mainSize = mainText.length > 9 ? 96 : 120;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          fontFamily: "JetBrains Mono",
          color: SILK,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={background} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} alt="" />
        {/* IC の印字 */}
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 180,
            width: 280,
            height: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#ECEEE4",
          }}
        >
          <div style={{ fontFamily: "Chakra Petch", fontWeight: 700, fontSize: 44 }}>UMZW-29</div>
          <div style={{ fontSize: 16, marginTop: 10, color: "#B7BBB2", letterSpacing: 2 }}>FRONT-END · UI/UX</div>
          <div style={{ fontSize: 13, marginTop: 6, color: "#8A8F86", letterSpacing: 2 }}>AIT EEE · NAGOYA</div>
        </div>
        {/* 左の文字 */}
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 0,
            height: 630,
            width: 640,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 18, letterSpacing: 6, color: SILK_LABEL }}>RU-PORTFOLIO · REV 2026.11</div>
          <div
            style={{
              fontFamily: "Chakra Petch",
              fontWeight: 700,
              fontSize: mainSize,
              lineHeight: 1.05,
              marginTop: 16,
              letterSpacing: -2,
            }}
          >
            {mainText}
          </div>
          <div style={{ fontSize: 22, letterSpacing: 8, color: ACCENT, marginTop: 22 }}>
            {title ? "CASE STUDY" : "FRONT-END DEVELOPER"}
          </div>
          <div style={{ fontFamily: "Zen Kaku Gothic New", fontWeight: 700, fontSize: 34, color: SILK_SOFT, marginTop: 26 }}>
            {title ? "Riku Umezawa のポートフォリオ" : "フッ軽エンジニア"}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Chakra Petch", data: chakra, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
        { name: "Zen Kaku Gothic New", data: zen, weight: 700, style: "normal" },
      ],
    },
  );
}
