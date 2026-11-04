import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import Header from "./components/Header"; // ナビ（スマホのメニュー開閉を持つ）
import Opening from "./components/Opening"; // 初回訪問のオープニング
import NewsList from "./components/NewsList"; // News の「もっと見る」
import PageEffects from "./components/PageEffects"; // 表示域の監視・パララックス・画面外の停止
import LazyLayerPanel from "./components/LazyLayerPanel"; // レイヤー表示の切り替え（マウスのある端末で、あとから読み込む）
import { pageMetadata, pageUrl, personJsonLd, SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./lib/seo";
import { worksData, type Work } from "./data/works"; // Selected Works のデータ
import { newsData } from "./data/news"; // Activity & News のデータ
import { contactLinks, ContactIcon } from "./components/ContactLinks"; // 連絡先（URL は lib/profile.ts）

// 検索向け: title / description / canonical / og / twitter（値は app/lib/seo.ts）
export const metadata = pageMetadata({ title: SITE_NAME, description: SITE_DESCRIPTION, path: "/" });

// 構造化データ（JSON-LD）: 人物（app/lib/seo.ts の personJsonLd。sameAs は X と GitHub）とサイト
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    personJsonLd,
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  ],
};

// このページは Server Component。動く部分（メニュー・News の件数・オープニング・演出の監視）だけを
// 小さな Client Component に分け、本文と装飾はサーバーで HTML にする

// ＝＝＝ 無限マーキー（基板風の表記。CSS keyframes、画面外では停止） ＝＝＝
const marqueeItems = ["UMZW-29", "REV 2026.11", "FRONT-END", "UI/UX", "REACT NATIVE", "FIGMA", "AIT EEE", "NAGOYA"];

const Marquee = () => (
  <div data-pause-offscreen className="marquee relative w-full">
    {/* 上下の銅線の両端に置くパッド（overflow の外に出すため、帯の外側に置く） */}
    <span className="marquee-pad -top-[3px] left-3 md:left-6" aria-hidden="true" />
    <span className="marquee-pad -top-[3px] right-3 md:right-6" aria-hidden="true" />
    <span className="marquee-pad -bottom-[3px] left-3 md:left-6" aria-hidden="true" />
    <span className="marquee-pad -bottom-[3px] right-3 md:right-6" aria-hidden="true" />
    <div className="marquee-lines w-full overflow-hidden py-5 md:py-7">
      <div className="marquee-track flex whitespace-nowrap w-max">
        {/* 2周目は見た目の継ぎ目用なので読み上げ対象から外す */}
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center shrink-0" aria-hidden={half === 1 ? true : undefined}>
            {marqueeItems.map((item, i) => (
              <span key={i} className="font-mono text-[13px] md:text-[14px] tracking-[0.14em] text-silk-label px-4 md:px-6">
                {item} ·
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ＝＝＝ 表示域に入ったら .is-in が付く要素（見た目は globals.css の .reveal）＝＝＝
// 監視は app/lib/reveal.ts（rootMargin ごとに 1 つの IntersectionObserver）。ここは印だけを付けるサーバー側の部品
const Reveal = ({
  children,
  className = "",
  variant = "up",
  delay = 0,
  margin = "-50px",
}: {
  children: ReactNode;
  className?: string;
  variant?: "up" | "fade" | "sm" | "mask";
  delay?: number;
  margin?: string;
}) => (
  <div
    className={`reveal reveal-${variant} ${className}`}
    data-reveal-margin={margin}
    style={delay ? { transitionDelay: `${delay}s` } : undefined}
  >
    {children}
  </div>
);

// ＝＝＝ 部品番号付きセクション見出し（マスクリビール） ＝＝＝
// part: 基板上の部品番号（U1 / U2 / U3 / J1）、index: 連番（01〜04）、tag: 見出し右端の小さな注記
// fid: 見出し行の右端に置く位置合わせマーク（文字列ならそのラベル付き、true ならラベルなし）
const SectionTitle = ({
  part,
  index,
  title,
  tag,
  fid,
}: {
  part: string;
  index: string;
  title: string;
  tag?: string;
  fid?: string | true;
}) => (
  <div className="mb-12 md:mb-16">
    <Reveal variant="fade" className="font-mono text-[13px] tracking-[0.14em] text-accent mb-4">
      {part} / {index}
    </Reveal>
    {/* 見出し行。左端のパッド（円 + 短い線）はスパインの真上に乗るよう absolute で配置する。
        見出しは overflow-hidden の箱の中からせり上がる（.reveal-mask） */}
    <div className="relative flex items-end justify-between gap-4">
      <span className="pcb-pad layer-fcu" aria-hidden="true" />
      <Reveal variant="mask">
        <h2 className="font-display font-bold text-4xl md:text-[56px] leading-none tracking-tight text-silk">
          {title}
        </h2>
      </Reveal>
      <div className="flex items-end shrink-0">
        {/* スマホでは見出しの幅を潰さないよう、ラベル行の右端（見出しの上）に逃がす */}
        {tag && (
          <span className="font-mono text-[12px] tracking-[0.12em] text-silk-label shrink-0 absolute right-0 -top-9 md:static md:pb-1">
            {tag}
          </span>
        )}
        {/* 位置合わせマーク。TEST LOG がある行はその右に 40px 空ける。1023px 以下では非表示 */}
        {fid && (
          <span className={`fiducial hidden lg:flex items-center gap-2 shrink-0 pb-1 ${tag ? "ml-10" : "ml-4"}`} aria-hidden="true">
            {typeof fid === "string" && <span className="layer-silks font-mono text-[11px] tracking-[0.1em] text-silk-label">{fid}</span>}
            <span className="flex items-center justify-center w-[26px] h-[26px] rounded-full border border-line">
              <span className="block w-[10px] h-[10px] rounded-full bg-copper" />
            </span>
          </span>
        )}
      </div>
    </div>
  </div>
);

// ＝＝＝ Hero 右列: 回路の絵（配線・ビア・IC・LED）。演出は globals.css の .hero-circuit 配下 ＝＝＝
// LED の発光は filter ではなく radialGradient を塗った大きめの円（.led-glow）、電流の発光は太い半透明の線（.flow-glow）。
// 発光が切れないよう viewBox を少し広げ（上 20・右 20）、overflow: visible にしている
//
// 回路としての整合（U10 = 12 ピン SOIC。左を上から 1〜6、右を下から 7〜12）
//   1: +3V3（左上のビアへ。すぐそばにパスコン C2 100n → GND ビア）   6: GND（下端へ）
//   8: SDA / 7: SCL（どちらも下端へ。R3 / R4 4k7 で +3V3 にプルアップ。その +3V3 は裏層経由＝ビアで表す）
//   12: → R5 330 → D1 → GND ビア   10: → R6 330 → D2 → GND ビア
//   4: RST / 9: INT（配線は描かず、ネット名のラベルで示す。スパインの R1 → RST、R2 → INT の各プルアップと同じネット）   ほかのピンは NC
// 同じ層の配線は交差させない。電源（+3V3・GND）は 5px、信号は 3px
const chipPinYs = [272, 300, 328, 356, 384, 412];
const flowPaths = ["M1020 392 H1100 L1140 432 V560", "M1020 280 H1040 L1070 250 V88 H1096", "M1020 420 H1060 L1100 460 V560"];
// ピンの割り当て（左 1〜6 を上から、右 7〜12 を下から）。プローブの表示用: ピン名とネット
const leftPins = ["VCC", "NC", "NC", "RST", "NC", "GND"];
const rightPins = ["SCL", "SDA", "INT", "OUT2", "NC", "OUT1"]; // 下から 7, 8, 9, 10, 11, 12
const pinNet = (name: string) => (name === "VCC" ? "+3V3" : name);
// プローブの当たり判定（ネットごとの透明な太い線。描画はしない）
const netHits: { net: string; d: string }[] = [
  { net: "+3V3", d: "M740 280 H690 L660 250 V170" },
  { net: "+3V3", d: "M700 280 V296" },
  { net: "+3V3", d: "M1187 516 H1211" },
  { net: "+3V3", d: "M1053 516 H1029" },
  { net: "GND", d: "M740 420 H724 L690 454 V560" },
  { net: "GND", d: "M700 326 V348" },
  { net: "GND", d: "M1144 88 H1168" },
  { net: "GND", d: "M1194 170 H1212" },
  { net: "OUT1", d: "M1020 280 H1040 L1070 250 V181" },
  { net: "LED1", d: "M1070 153 V88 H1096" },
  { net: "OUT2", d: "M1020 336 H1100 L1130 306 V263" },
  { net: "LED2", d: "M1130 235 V170 H1146" },
  { net: "SDA", d: "M1020 392 H1100 L1140 432 V560" },
  { net: "SDA", d: "M1140 516 H1159" },
  { net: "SCL", d: "M1020 420 H1060 L1100 460 V560" },
  { net: "SCL", d: "M1100 516 H1081" },
];
// 裏の層（B.Cu）: ビアどうしをつなぐ配線。+3V3（左上のビア → プルアップ R3・R4 の +3V3 ビア）と
// GND（D1・D2 のカソードのビア → C2 の GND ビア）。レイヤー表示で B.Cu を出したときだけ見える
const backTraces = ["M660 170 V536 H1211 V516", "M1022 536 V516", "M1168 88 H1212 V170", "M1212 170 V348 H700"];

// チップ部品（抵抗: 18×34 黒 / コンデンサ: 16×30 ベージュ、両端が端子）。print は本体への印字
const SmdPart = ({ cx, cy, kind, print, horizontal = false }: { cx: number; cy: number; kind: "r" | "c"; print?: string; horizontal?: boolean }) => {
  const [w, h, t] = kind === "r" ? [18, 34, 6] : [16, 30, 7];
  const body = kind === "r" ? "#1E1F1C" : "#C8A06A";
  const W = horizontal ? h : w;
  const H = horizontal ? w : h;
  const x = cx - W / 2;
  const y = cy - H / 2;
  return (
    <g className="part">
      <rect x={x} y={y} width={W} height={H} rx="2" fill="#B9B9B4" />
      {horizontal
        ? <rect x={x + t} y={y} width={W - 2 * t} height={H} fill={body} />
        : <rect x={x} y={y + t} width={W} height={H - 2 * t} fill={body} />}
      {print && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          transform={horizontal ? undefined : `rotate(90 ${cx} ${cy})`}
          fontFamily="var(--font-jetbrains), 'JetBrains Mono', monospace"
          fontSize="8"
          letterSpacing="0.4"
          fill="#E8E8E2"
        >
          {print}
        </text>
      )}
    </g>
  );
};

// LED（2 端子）: 左にアノード、右にカソードのパッド。シルクの外形線はカソード側を平らにする
const Led = ({ cx, cy, cls }: { cx: number; cy: number; cls: string }) => (
  <g>
    <rect className="pad layer-fcu" x={cx - 29} y={cy - 6} width="10" height="12" rx="1.5" />
    <rect className="pad layer-fcu" x={cx + 19} y={cy - 6} width="10" height="12" rx="1.5" />
    <path className="silk layer-silks" d={`M${cx + 10} ${cy - 17.3} A20 20 0 1 0 ${cx + 10} ${cy + 17.3} Z`} />
    <circle className={`led-glow ${cls}`} cx={cx} cy={cy} r="45" fill="url(#led-glow-grad)" />
    <circle className={`led ${cls}`} cx={cx} cy={cy} r="14" />
  </g>
);

const HeroCircuit = () => (
  <svg viewBox="620 40 600 520" style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }} aria-hidden="true">
    <defs>
      <radialGradient id="led-glow-grad">
        <stop offset="0" stopColor="var(--led-glow)" stopOpacity="0.55" />
        <stop offset="1" stopColor="var(--led-glow)" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* ＝＝ F.Cu（表の銅）: 配線・ビア・パッド。レイヤー表示で切り替わる ＝＝ */}
    <g className="layer-fcu">
    {/* 電源: 1 番 +3V3 → 左上のビア、6 番 GND → 下端 */}
    <path className="trace pwr" d="M740 280 H690 L660 250 V170" />
    <path className="trace pwr t2" d="M740 420 H724 L690 454 V560" />
    {/* パスコン C2: +3V3 の配線から分岐し、GND のビアへ */}
    <path className="trace t2" d="M700 280 V296" />
    <path className="trace t2" d="M700 326 V340" />
    {/* 12 番 → R5 → D1、D1 カソード → GND ビア */}
    <path className="trace t2" d="M1020 280 H1040 L1070 250 V181" />
    <path className="trace t2" d="M1070 153 V88 H1096" />
    <path className="trace t3" d="M1144 88 H1168" />
    {/* 10 番 → R6 → D2、D2 カソード → GND ビア */}
    <path className="trace t3" d="M1020 336 H1100 L1130 306 V263" />
    <path className="trace t3" d="M1130 235 V170 H1146" />
    <path className="trace t3" d="M1194 170 H1212" />
    {/* 8 番 SDA → 下端（外側）、7 番 SCL → 下端（内側）。平行に下ろして交差させない */}
    <path className="trace t3" d="M1020 392 H1100 L1140 432 V560" />
    <path className="trace t4" d="M1020 420 H1060 L1100 460 V560" />
    {/* プルアップ: SDA → 右へ R3 → +3V3 ビア、SCL → 左へ R4 → +3V3 ビア（IC の下の空き） */}
    <path className="trace t4" d="M1140 516 H1159" />
    <path className="trace t4" d="M1187 516 H1211" />
    <path className="trace t4" d="M1100 516 H1081" />
    <path className="trace t4" d="M1053 516 H1029" />
    {flowPaths.map((d) => (
      <path key={`g${d}`} className="flow flow-glow" d={d} />
    ))}
    {flowPaths.map((d) => (
      <path key={`f${d}`} className="flow" d={d} />
    ))}
    {/* ビア: +3V3（左上）、C2 の GND、D1・D2 の GND、プルアップの +3V3（裏層経由） */}
    <circle className="via" cx="660" cy="170" r="8" />
    <circle className="via" cx="700" cy="348" r="7" />
    <circle className="via" cx="1168" cy="88" r="7" />
    <circle className="via" cx="1212" cy="170" r="7" />
    <circle className="via" cx="1211" cy="516" r="7" />
    <circle className="via" cx="1022" cy="516" r="7" />
    {/* IC のピンが乗る銅のパッド */}
    <g className="pad">
      {chipPinYs.map((y) => (
        <rect key={`pl${y}`} x="738" y={y - 2} width="24" height="20" rx="2" />
      ))}
      {chipPinYs.map((y) => (
        <rect key={`pr${y}`} x="998" y={y - 2} width="24" height="20" rx="2" />
      ))}
    </g>
    </g>
    {/* ＝＝ B.Cu（裏の銅）: 半透明の破線。IC の下を通る部分は IC に隠れる ＝＝ */}
    <g className="layer-bcu">
      {backTraces.map((d) => (
        <path key={d} className="bcu" d={d} />
      ))}
    </g>
    {/* 部品: C2 100n、R5 / R6 330、R3 / R4 4k7 */}
    <SmdPart cx={700} cy={311} kind="c" />
    <SmdPart cx={1070} cy={167} kind="r" print="331" />
    <SmdPart cx={1130} cy={249} kind="r" print="331" />
    <SmdPart cx={1173} cy={516} kind="r" print="472" horizontal />
    <SmdPart cx={1067} cy={516} kind="r" print="472" horizontal />
    <g className="chip">
      <rect x="760" y="250" width="240" height="200" rx="6" fill="var(--chip)" />
      <g fill="var(--chip-pin)">
        {chipPinYs.map((y) => (
          <rect key={`l${y}`} x="740" y={y} width="20" height="16" />
        ))}
        {chipPinYs.map((y) => (
          <rect key={`r${y}`} x="1000" y={y} width="20" height="16" />
        ))}
      </g>
      <circle cx="782" cy="272" r="6" fill="var(--chip-pin1)" />
      <text x="880" y="340" textAnchor="middle" fill="var(--chip-text)" fontFamily="var(--font-chakra), 'Chakra Petch', sans-serif" fontWeight="700" fontSize="30">
        UMZW-29
      </text>
      <text x="880" y="372" textAnchor="middle" fill="var(--chip-muted)" fontFamily="var(--font-jetbrains), 'JetBrains Mono', monospace" fontSize="13">
        FRONT-END · UI/UX
      </text>
      <text x="880" y="396" textAnchor="middle" fill="var(--chip-dim)" fontFamily="var(--font-jetbrains), 'JetBrains Mono', monospace" fontSize="11">
        AIT EEE · NAGOYA
      </text>
    </g>
    <Led cx={1120} cy={88} cls="l1" />
    <Led cx={1170} cy={170} cls="l2" />
    {/* ＝＝ F.SilkS（シルク）: 部品番号・ネット名 ＝＝ */}
    <g className="layer-silks" fontFamily="var(--font-jetbrains), 'JetBrains Mono', monospace" fontSize="12" fill="var(--silk-muted)">
      <text x="1104" y="62">D1</text>
      <text x="1150" y="140">D2</text>
      <text x="764" y="238">U10</text>
      {/* 部品番号（シルク） */}
      <text x="684" y="315" textAnchor="end">C2</text>
      <text x="1058" y="171" textAnchor="end">R5</text>
      <text x="1118" y="253" textAnchor="end">R6</text>
      <text x="1173" y="499" textAnchor="middle">R3</text>
      <text x="1067" y="499" textAnchor="middle">R4</text>
      {/* シルク印刷の注記（配線・チップとは重ならない位置） */}
      <text x="672" y="164" fill="var(--silk-label)">+3V3</text>
      <text x="688" y="352" textAnchor="end" fill="var(--silk-label)">GND</text>
      <text x="700" y="552" fill="var(--silk-label)">GND</text>
      <text x="1148" y="552" fill="var(--silk-label)">SDA</text>
      <text x="1108" y="552" fill="var(--silk-label)">SCL</text>
      <text x="1218" y="541" textAnchor="end" fill="var(--silk-label)">+3V3</text>
      <text x="1010" y="520" textAnchor="end" fill="var(--silk-label)">+3V3</text>
      {/* ネット名のラベル: 4 番 RST（左）・9 番 INT（右）。配線は描かず、同じ名前のネット（スパインの R1 / R2）につながる表現 */}
      <text x="732" y="370" textAnchor="end" fill="var(--silk-label)">RST</text>
      <text x="1028" y="370" fill="var(--silk-label)">INT</text>
    </g>
    {/* ＝＝ プローブの当たり判定（透明。F.Cu を消したときは判定も消える） ＝＝ */}
    <g className="net-hit layer-fcu">
      {netHits.map((n, i) => (
        <path key={i} d={n.d} data-net={n.net} />
      ))}
      {chipPinYs.map((y, i) => (
        <rect key={`hl${y}`} x="738" y={y - 2} width="24" height="20" data-net={pinNet(leftPins[i])} data-label={`U10-${i + 1} ${leftPins[i]}`} />
      ))}
      {chipPinYs.map((y, i) => (
        <rect key={`hr${y}`} x="998" y={y - 2} width="24" height="20" data-net={pinNet(rightPins[5 - i])} data-label={`U10-${12 - i} ${rightPins[5 - i]}`} />
      ))}
    </g>
  </svg>
);

// ＝＝＝ スパイン（+3V3）から左へ枝分かれした部品（PC のみ表示） ＝＝＝
// 上の端子は水平の短い配線でスパインへ、下の端子は左へ伸びてビア（GND）かネット名（RST / INT）へつなぐ。
// left / width: 部品の左端と幅（中心がスパイン中心 57.5px の 40px 左 = 17.5px になる値。50% 基準の配線位置に幅が要る）
// pinTop / pinBottom: 端子中心の y（部品の上端基準）
const SpineBranch = ({ cls, refName, value, print, net, left, top, width, pinTop, pinBottom, lands = false }: {
  cls: string; refName: string; value: string; print?: string; net: "GND" | "RST" | "INT";
  left: number; top: number; width: number; pinTop: number; pinBottom: number; lands?: boolean;
}) => (
  <span className="spine-branch hidden md:block" style={{ left, top, width }} aria-hidden="true">
    <span className="spine-wire spine-wire--in layer-fcu" style={{ top: pinTop }} />
    <span className="spine-wire spine-wire--out layer-fcu" style={{ top: pinBottom }} />
    {net === "GND" && <span className="spine-via layer-fcu" style={{ top: pinBottom }} />}
    <span className={`spine-net layer-silks${net === "GND" ? " spine-net--via" : ""}`} style={{ top: pinBottom }}>{net}</span>
    {/* プローブの当たり判定（上の配線 = +3V3、下の配線とビア = net） */}
    <span className="spine-hit-wire spine-hit-wire--in layer-fcu" style={{ top: pinTop }} data-net="+3V3" />
    <span className="spine-hit-wire spine-hit-wire--out layer-fcu" style={{ top: pinBottom }} data-net={net} />
    <span className={`spine-part ${cls}`} data-net={net} data-label={`${refName} ${value}`}>
      {print && <span className="spine-part-print">{print}</span>}
      {lands && <span className="spine-land spine-land--top layer-fcu" />}
      {lands && <span className="spine-land spine-land--bottom layer-fcu" />}
      <span className="spine-part-label layer-silks"><span className="ref">{refName}</span> <span className="val">{value}</span></span>
    </span>
  </span>
);

// ＝＝＝ IC チップ型の作品カード（詳細ページがあるものはカード全体がリンク） ＝＝＝
const WorkCard = ({ work, featured = false }: { work: Work; featured?: boolean }) => {
  const inner = (
    <>
      {/* 上: 画像枠 */}
      <div className="relative aspect-video bg-frame border-[1.5px] border-b-0 border-line-dashed rounded-t-[6px] overflow-hidden">
        <Image
          src={work.image.src}
          alt={work.image.alt}
          fill
          sizes={featured ? "(min-width: 1280px) 1110px, (min-width: 768px) calc(100vw - 330px), calc(100vw - 104px)" : "(min-width: 1280px) 525px, (min-width: 1024px) calc(50vw - 200px), (min-width: 768px) calc(100vw - 330px), calc(100vw - 104px)"}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      {/* 下: チップ本体（左右の端子は ::before / ::after） */}
      <div className="chip-body relative flex flex-col flex-1 bg-chip rounded-b-[6px] px-8 pt-7 pb-8">
        <span className="chip-notch" aria-hidden="true" />
        <span className="chip-pin1" aria-hidden="true" />
        <p className="font-mono text-[12px] tracking-[0.12em] text-chip-label">{work.ref}</p>
        <p className="text-[13px] max-md:text-[15px] font-bold text-chip-led mt-3">{work.award}</p>
        <h3 className="font-display font-bold text-[34px] leading-tight text-chip-text mt-2">{work.title}</h3>
        {/* 767px 以下: 詳細ページがあるカードは説明文を 3 行で切る（続きは詳細ページで読める）。Taleglot は全文のまま */}
        <p className={`${work.href ? "max-md:line-clamp-3 " : ""}text-[14px] max-md:text-[15px] leading-[1.8] text-chip-soft mt-4`}>{work.description}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {work.tech.map((tech, i) => (
            // 767px 以下: 詳細ページがあるカードは最初の 3 つだけ表示し、残りは下の「+N」で数だけ示す
            <span
              key={tech}
              className={`${work.href && i >= 3 ? "max-md:hidden " : ""}font-mono text-[12px] text-chip-muted border border-chip-line rounded-[3px] px-2 py-1`}
            >
              {tech}
            </span>
          ))}
          {work.href && work.tech.length > 3 && (
            // ただの文字（カード全体がリンクなので、中にボタンは置かない）。読み上げは「ほかN件」
            <span className="md:hidden font-mono text-[12px] text-chip-label px-2 py-1">
              <span aria-hidden="true">+{work.tech.length - 3}</span>
              <span className="sr-only">ほか{work.tech.length - 3}件</span>
            </span>
          )}
        </div>
        <p className="chip-link font-mono text-[13px] text-chip-muted mt-auto pt-6 transition-colors duration-[350ms]">
          {work.href ? "Read Case Study →" : "Preparation..."}
        </p>
      </div>
    </>
  );
  // h-full + flex-col で、同じ段のカードは grid の stretch に合わせて高さがそろう
  const className = "work-card group relative flex flex-col h-full";
  return work.href ? (
    <Link href={work.href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
};

export default function Home() {
  return (
    <div className="pcb-board flex flex-col items-center w-full overflow-hidden relative text-silk">
      {/* 構造化データ（実行されないスクリプト。CSP の script-src には影響しない） */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* canonical と og:url（トップだけ末尾 / を付けた形。metadata API だと origin だけになるため、ここで描画して <head> に移してもらう） */}
      <link rel="canonical" href={pageUrl("/")} />
      <meta property="og:url" content={pageUrl("/")} />
      <PageEffects />
      {/* ＝＝＝ Edge.Cuts: 基板の外形線（ページの外周から 12px 内側） ＝＝＝ */}
      <span className="board-edge layer-edge" aria-hidden="true" />

      {/* ＝＝＝ 取り付け穴 H1・H2（767px 以下では非表示） ＝＝＝ */}
      {/* 中心は外形線の角（端から 12px、上辺はヘッダーの下端 + 12px）から縦横 46px 内側 = 端から 58px。
          点線の円（直径 46px）と外形線のすき間は 23px。ラベルは穴の下（横だと 1440px で Hero の 1 行目と重なる） */}
      <span className="mount-hole left-[43px] top-[calc(var(--header-h)+43px)]" aria-hidden="true">
        <span className="mount-hole-label mount-hole-label--below layer-silks">H1</span>
      </span>
      <span className="mount-hole right-[43px] top-[calc(var(--header-h)+43px)]" aria-hidden="true">
        <span className="mount-hole-label mount-hole-label--below layer-silks">H2</span>
      </span>

      {/* ＝＝＝ ナビゲーションヘッダー ＝＝＝ */}
      <Header delayBase={0.2} />

      {/* ＝＝＝ オープニングアニメーション（初回訪問のみ。components/Opening.tsx） ＝＝＝ */}
      <Opening />

      {/* ＝＝＝ 本文（Hero から Get in Touch まで。ヘッダー・オープニング・レイヤー切り替えは外） ＝＝＝ */}
      {/* 親と同じ縦の flex（w-full・items-center）にして、中の並びと幅を変えない */}
      <main className="w-full flex flex-col items-center">

      {/* ＝＝＝ ヒーローセクション ＝＝＝ */}
      {/* PC は左に文字（最大 640px）・右に回路（最大 540px）の2列、スマホは文字→回路の縦並び。
          起動演出は globals.css の .hero-in / .hero-circuit（CSS アニメーション）で、ページ表示と同時に始まる */}
      <section
        data-pause-offscreen
        className="relative min-h-screen-dvh flex flex-col w-full overflow-hidden pt-[calc(var(--header-h)+48px)] pb-8"
      >

        {/* 演出1：背景の光（filter: blur をやめ、静的な radial-gradient で同じ見た目に） */}
        <div className="hidden md:block hero-glow-desktop absolute inset-0 pointer-events-none z-0" />
        <div className="md:hidden hero-glow-mobile absolute inset-0 pointer-events-none z-0" />

        {/* 演出2：背景の巨大透かし文字（scroll に合わせて translateY、表示は CSS animation） */}
        <div
          data-watermark
          className="watermark-in absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0"
        >
          <p className="font-display text-[15vw] md:text-[12vw] font-bold text-silk/5 select-none tracking-tighter">
            PORTFOLIO
          </p>
        </div>

        {/* 2列レイアウト（回路は背景に敷かず、文字と重ねない） */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-24 flex-grow flex flex-col lg:flex-row lg:items-center justify-center gap-12 lg:gap-16">

          {/* 左列: 文字 */}
          <div className="w-full max-w-[640px] lg:flex-1">
            <p className="hero-in font-mono text-[13px] tracking-[0.18em] text-silk-label" style={{ "--d": "0.1s" } as CSSProperties}>
              &gt; POWER ON … OK
            </p>

            <h1
              className="hero-in font-display font-bold text-[56px] md:text-[80px] xl:text-[104px] leading-[0.95] tracking-tight text-silk mt-5"
              style={{ "--d": "0.3s" } as CSSProperties}
            >
              <span className="block">Riku</span>
              <span className="block">Umezawa</span>
            </h1>
            {/* 日本語の名前（検索向け。名前と同じタイミングで現れる） */}
            <p className="hero-in font-sans text-[16px] tracking-[0.1em] text-silk-label mt-3" style={{ "--d": "0.3s" } as CSSProperties}>
              梅澤 陸
            </p>

            <div className="hero-in mt-6" style={{ "--d": "0.5s" } as CSSProperties}>
              <p className="font-mono text-[16px] tracking-[0.2em] uppercase text-copper-light">
                Front-End Developer
              </p>
              <span className="inline-block font-mono text-xs tracking-wider text-copper-light border-[1.5px] border-copper px-3 py-1.5 rounded-full mt-4">
                <span className="whitespace-nowrap">愛知工業大学</span>{" "}
                <span className="whitespace-nowrap">システム工学研究会・</span>
                <span className="whitespace-nowrap">STECH所属・</span>
                <span className="whitespace-nowrap">NxTEND東海事業部</span>
              </span>
              <p className="text-[26px] font-bold text-silk mt-6">フッ軽エンジニア</p>
            </div>

            {/* 実績ごとに li で必ず改行し、実績の中は意味の塊ごとに nowrap で囲んで塊の間でだけ折り返す。
                塊が長すぎるとスマホ幅で右にはみ出すため、1塊は短く保ち、「・」「、」は行頭に来ないよう直前の塊に含める。
                各行の頭の配線と LED は globals.css の .hero-ach li::before / ::after */}
            <ul className="hero-in hero-ach mt-4 space-y-1 text-silk-soft leading-relaxed" style={{ "--d": "0.7s" } as CSSProperties}>
              <li>
                <span className="whitespace-nowrap">SysHack 2026</span>{" "}
                <span className="whitespace-nowrap">CyberAgent賞</span>
                <span className="whitespace-nowrap">『muscloop』、</span>
              </li>
              <li>
                <span className="whitespace-nowrap">THE HACK 2026</span>{" "}
                <span className="whitespace-nowrap">東海予選1位・</span>
                <span className="whitespace-nowrap">本選デジタルフォルン賞・</span>
                <span className="whitespace-nowrap">副大賞</span>
                <span className="whitespace-nowrap">『TSUNAGU』、</span>
              </li>
              <li>
                <span className="whitespace-nowrap">100Program</span>{" "}
                <span className="whitespace-nowrap">優秀インタビュー賞・</span>
                <span className="whitespace-nowrap">オーディエンス賞</span>
                <span className="whitespace-nowrap">『KOKUDO』、</span>
              </li>
              <li>
                <span className="whitespace-nowrap">100Program</span>{" "}
                <span className="whitespace-nowrap">オーディエンス賞×2</span>
                <span className="whitespace-nowrap">『Taleglot』、</span>
              </li>
              <li>
                <span className="whitespace-nowrap">HACK STAGE 3</span>{" "}
                <span className="whitespace-nowrap">最優秀賞</span>{" "}
                <span className="whitespace-nowrap">受賞</span>
                <span className="whitespace-nowrap">『TrailDrop』</span>
              </li>
            </ul>
          </div>

          {/* 右列: 回路の絵 */}
          <div className="hero-circuit w-full max-w-[320px] lg:max-w-[540px] lg:flex-1 mx-auto lg:mx-0 shrink-0">
            <HeroCircuit />
          </div>
        </div>

        {/* 演出3：スクロールインジケーター + 左右のエディトリアルラベル（配色のみ基板パレット） */}
        <div
          className="fade-in relative z-10 w-full px-8 md:px-24 mt-12 shrink-0 flex items-end justify-between pointer-events-none"
          style={{ "--d": "1.2s" } as CSSProperties}
        >
          <span className="hidden md:block font-mono text-[10px] max-lg:text-[12px] tracking-[0.3em] text-silk-label">
            BASED IN AICHI, JAPAN
          </span>

          <div className="flex flex-col items-center mx-auto md:mx-0">
            <span
              className="font-mono text-[10px] max-lg:text-[12px] tracking-[0.3em] text-silk-label mb-4"
              style={{ writingMode: "vertical-rl" }}
            >
              SCROLL
            </span>
            <div className="w-[1px] h-12 md:h-16 bg-line/40 overflow-hidden relative">
              <div className="scroll-hint-bar w-full h-1/2 bg-accent absolute top-0" />
            </div>
          </div>

          <span className="hidden md:block font-mono text-[10px] max-lg:text-[12px] tracking-[0.3em] text-silk-label">
            2029 NEW GRAD — ENGINEER
          </span>
        </div>
      </section>

      {/* ＝＝＝ マーキー帯 ＝＝＝ */}
      <Marquee />

      {/* ＝＝＝ 基板スパイン：About〜Contact の左を縦に流れる配線（Hero には通さない） ＝＝＝ */}
      {/* 各セクションと同じ max-w / padding の透明な箱を重ね、その中で配線を絶対配置することで
          「本文コンテナの左端から 22px（PC 56px）内側」に 1 本の線を通す */}
      <div data-pause-offscreen className="relative isolate w-full">
        <div className="pointer-events-none absolute inset-0 z-0 px-8 md:px-24" aria-hidden="true">
          <div className="relative h-full max-w-7xl mx-auto">
            <span className="pcb-spine layer-fcu left-[21.5px] md:left-[55.5px]" />
          </div>
        </div>

        {/* ＝＝＝ 背景の配線パターン（本文コンテナの外側の余白。1360px 以上のみ、本文より下に描く） ＝＝＝ */}
        <svg className="trace-bg trace-bg-left layer-fcu" aria-hidden="true">
          <defs>
            <pattern id="trace-pattern-left" width="160" height="360" patternUnits="userSpaceOnUse">
              <g className="trace-bg-lines">
                <path d="M20 0 V60 L50 90 V200 L20 230 V360" />
                <path d="M70 0 V40 L100 70 V150 H140" />
                <path d="M120 200 V260 L90 290 V360" />
              </g>
              <g className="trace-bg-vias">
                <circle cx="140" cy="150" r="6" />
                <circle cx="120" cy="200" r="6" />
                <circle cx="50" cy="145" r="4" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trace-pattern-left)" />
        </svg>
        <svg className="trace-bg trace-bg-right layer-fcu" aria-hidden="true">
          <defs>
            <pattern id="trace-pattern-right" width="160" height="420" patternUnits="userSpaceOnUse">
              <g className="trace-bg-lines">
                <path d="M140 0 V80 L110 110 V240 L140 270 V420" />
                <path d="M90 0 V30 L60 60 V180 H20" />
                <path d="M40 260 H80 L100 280 V420" />
              </g>
              <g className="trace-bg-vias">
                <circle cx="20" cy="180" r="6" />
                <circle cx="40" cy="260" r="6" />
                <circle cx="110" cy="175" r="4" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#trace-pattern-right)" />
        </svg>

      {/* ＝＝＝ About（自己紹介）セクション ＝＝＝ */}
      <section id="about" className="w-full px-8 md:px-24 py-32 scroll-mt-[var(--header-h)]">
        <div className="relative max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          {/* テストポイント TP1: スパインの始まり（見出しより上）。中心をスパイン（22px / 56px）に合わせる */}
          <span className="spine-tp layer-fcu left-[14.5px] md:left-[48.5px] -top-[73px]" aria-hidden="true">
            <span className="spine-tp-label layer-silks">TP1 · +3V3</span>
          </span>
          <SectionTitle part="U1" index="01" title="About Me" fid="FID1" />
          <div className="flex flex-col lg:flex-row gap-16">

          {/* 左: 本文 */}
          <Reveal margin="-100px" className="w-full lg:flex-1">
            <div className="space-y-6 text-[16px] leading-[2] text-silk-soft font-noto">
              <p>
                愛知工業大学で電気電子工学を専攻している29卒です。大学ではC言語や物理法則などハードウェア寄りの領域を学んでいますが、高校は情報デザイン学科を卒業しておりユーザーの目に直接触れ、体験を根本から変えることができるWebフロントエンドやUI/UXデザインの世界に強く惹かれました。
              </p>
              <p>
                現在はReact Nativeを中心に、Figmaを用いたデザインの基礎設計から実装まで一貫して手を動かす開発を探求しています。あわせてTSUNAGU開発では要件定義から携わり、個人ではRaspberry Piを使ってサーバー領域の学習にも手を出しています。
              </p>
              <p>
                チーム「cpy」としてSysHack 2026や技育博に出場し、プロダクトを形にする楽しさを知りました。THE HACK 2026本選ではTSUNAGUでデジタルフォルン賞・副大賞をW受賞し、VORN Challenge 2026本戦への出場権も獲得しています。2026年8月にはSTECHにも加入し、今後は東海・関東・関西など各地の技術イベントにも積極的に足を運び、エンジニアとしての視野と技術力をさらに広げていきたいと考えています。
              </p>
            </div>
          </Reveal>

          {/* 右: 部品表（BOM）としてのスキル一覧 */}
          <Reveal margin="-100px" delay={0.2} className="w-full lg:w-[320px] lg:shrink-0">
            <p className="font-mono text-[12px] tracking-[0.14em] text-silk-label mb-4">BOM — SKILLS &amp; TECHNOLOGIES</p>
            <div className="silk-frame">
              <span className="silk-frame-label" aria-hidden="true">U1A · BOM</span>
            <table className="bom w-full font-mono text-[14px]">
              <thead>
                <tr>
                  <th scope="col">REF</th>
                  <th scope="col">PART</th>
                </tr>
              </thead>
              <tbody>
                {["Figma", "React Native (Expo)", "React", "Firebase", "AWS", "Raspberry Pi", "GitHub", "C", "Python"].map((skill, i) => (
                  <tr key={skill}>
                    <td>IC{i + 1}</td>
                    <td>{skill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </Reveal>

          </div>
        </div>
      </section>

      {/* ＝＝＝ ニュース＆アクティビティ セクション ＝＝＝ */}
      <section id="news" className="w-full px-8 md:px-24 py-24 scroll-mt-[var(--header-h)]">
        <div className="relative max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          {/* About と News の間の抵抗 R1（+3V3 → R1 → RST） */}
          <SpineBranch cls="spine-part--r1" refName="R1" value="10k" print="103" net="RST" left={8.5} width={18} top={-33} pinTop={3} pinBottom={31} />
          <SectionTitle part="U2" index="02" title="Activity & News" tag="TEST LOG" fid />

          {/* 一覧と「もっと見る」（表示件数の状態だけクライアント側。components/NewsList.tsx） */}
          <NewsList items={newsData} />
        </div>
      </section>

      {/* ＝＝＝ プロジェクトセクション ＝＝＝ */}
      <section id="projects" className="w-full px-8 md:px-24 py-32 scroll-mt-[var(--header-h)]">
        <div className="relative max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          {/* News と Works の間のコンデンサ C1（+3V3 → C1 → GND） */}
          <SpineBranch cls="spine-part--c" refName="C1" value="100n" net="GND" left={10.5} width={14} top={-47} pinTop={3.5} pinBottom={26.5} />
          <SectionTitle part="U3" index="03" title="Selected Works" fid="FID2" />

          {/* 1件目は横幅いっぱい、2〜5件目は2列（スマホは1列）。端子が左右に 10px はみ出すぶん横の余白を確保 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[56px] gap-x-[64px] px-[10px]">
            {worksData.map((work, i) => (
              <Reveal key={work.title} margin="-100px" className={i === 0 ? "lg:col-span-2" : ""}>
                <WorkCard work={work} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ＝＝＝ フッター（コンタクトセクション） ＝＝＝ */}
      <footer id="contact" className="relative w-full px-8 md:px-24 pt-32 pb-12 border-t border-line scroll-mt-[var(--header-h)]">
        {/* ＝＝＝ 取り付け穴 H3・H4（中心は左右の端から 58px、ページの下端から 100px）。
            下端から 58px だと左下に固定の LAYERS ボタン（下 24px・高さ 44px）に点線の円がかかるので、円の下端が
            ボタンの上端から 9px 離れる高さにする。ラベルは穴の上（横だと 1440px で H4 が「BACK TO TOP ↑」と重なる） ＝＝＝ */}
        <span className="mount-hole left-[43px] bottom-[85px]" aria-hidden="true">
          <span className="mount-hole-label mount-hole-label--above layer-silks">H3</span>
        </span>
        <span className="mount-hole right-[43px] bottom-[85px]" aria-hidden="true">
          <span className="mount-hole-label mount-hole-label--above layer-silks">H4</span>
        </span>
        <div className="relative max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          {/* Works と Contact の間の抵抗 R2（+3V3 → R2 → INT: 割り込み信号のプルアップ。リード線の先はスルーホールのランド） */}
          <SpineBranch cls="spine-part--r2" refName="R2" value="4k7" net="INT" left={9.5} width={16} top={-50} pinTop={-10} pinBottom={46} lands />
          <SectionTitle part="J1" index="04" title="Get in Touch" />

          <Reveal margin="0px" delay={0.1} className="max-w-md mb-12">
            <p className="text-silk-muted leading-relaxed">
              お仕事のご相談、イベントのお誘い、おすすめのラーメン情報など、お気軽にご連絡ください。
            </p>
          </Reveal>

          {/* コネクタ: 点線枠の中に各連絡先を「ピン」として並べる。右側（足りなければ下）に BOARD INFO */}
          <div className="flex flex-wrap items-start gap-6 mb-24">
          <Reveal margin="0px" delay={0.2} className="max-w-3xl border-[1.5px] border-dashed border-line-strong rounded-[6px] px-8 py-7">
            <p className="font-mono text-[12px] tracking-[0.12em] text-silk-label mb-6">J1 — CONNECTOR</p>
            <div className="flex flex-wrap gap-7">
              {contactLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="pin flex flex-col items-start gap-3"
                >
                  {/* ピン番号 */}
                  <span className="layer-silks font-mono text-[10px] max-lg:text-[12px] leading-none text-silk-label" aria-hidden="true">{i + 1}</span>
                  {/* 1 番ピン（X）だけ四角いパッド、2・3 番は丸いパッド */}
                  <span className={`pin-pad layer-fcu${i > 0 ? " pin-pad--round" : ""}`} aria-hidden="true" />
                  <span className="pin-label flex items-center gap-2 font-mono text-[13px] text-silk transition-colors duration-200">
                    <ContactIcon kind={link.icon} />
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
          <Reveal margin="0px" delay={0.3}>
            <div className="silk-frame" aria-hidden="true">
              <span className="silk-frame-label">BOARD INFO</span>
              <p className="font-mono text-[11px] max-lg:text-[12px] leading-[1.7] tracking-[0.12em] text-silk-label whitespace-pre">{"RU-PORTFOLIO\nREV 2026.11 · 2 LAYER\nDESIGNED IN NAGOYA"}</p>
            </div>
          </Reveal>
          </div>

          {/* フッター（従来の「BACK TO TOP ↑」リンクは残す） */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8 border-t border-line font-mono text-[12px] tracking-[0.12em] text-silk-label">
            <p>© RIKU UMEZAWA</p>
            <p>BOARD: PORTFOLIO · REV 2026.11 · MADE IN NAGOYA</p>
            <a href="#" className="hover:text-copper-hover active:text-copper-hover transition-colors max-lg:inline-flex max-lg:items-center max-lg:min-h-11">
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </footer>

        {/* ＝＝＝ プローブの当たり判定: スパイン（+3V3）の上に重ねる 14px 幅の透明な帯。本文には重ならない ＝＝＝ */}
        <div className="pointer-events-none absolute inset-0 z-10 px-8 md:px-24" aria-hidden="true">
          <div className="relative h-full max-w-7xl mx-auto">
            <span className="spine-hit layer-fcu left-[16.5px] md:left-[50.5px]" data-net="+3V3" />
          </div>
        </div>
      </div>
      {/* ＝＝＝ /基板スパイン ＝＝＝ */}
      </main>
      {/* ＝＝＝ レイヤー表示の切り替え（左下に固定、1024px 以上のみ。マウスのある端末で、手が空いてから読み込む） ＝＝＝ */}
      <LazyLayerPanel />
    </div>
  );
}
