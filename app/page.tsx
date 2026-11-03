"use client";

import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import BoardSwitch from "./components/BoardSwitch";

// ＝＝＝ 固定ナビゲーションヘッダー ＝＝＝
const navLinks = [
  { part: "U1", label: "ABOUT", href: "#about" },
  { part: "U2", label: "NEWS", href: "#news" },
  { part: "U3", label: "WORKS", href: "#projects" },
  { part: "J1", label: "CONTACT", href: "#contact" },
];

const Header = ({ delayBase }: { delayBase: number }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="header-in fixed top-0 left-0 w-full z-40 h-[var(--header-h)] px-6 md:px-12 lg:px-24 flex items-center justify-between md:backdrop-blur-md bg-board/90 md:bg-board/70 border-b border-line"
      style={{ "--d": `${delayBase}s` } as CSSProperties}
    >
      {/* ロゴ風「RU」（銅色の枠）+ リビジョン表記 */}
      <a href="#" className="flex items-center gap-3 whitespace-nowrap group" aria-label="RIKU UMEZAWA">
        <span className="flex items-center justify-center w-9 h-9 rounded-[4px] border-2 border-copper font-display font-bold text-sm tracking-tight text-copper-light group-hover:text-copper-hover transition-colors">
          RU
        </span>
        <span className="font-mono text-[12px] tracking-[0.12em] text-silk-label">REV 2026.11</span>
      </a>

      {/* デスクトップ用ナビ + 基板の色切り替え（lg 以上のみ表示。768〜1023px ではヘッダーに入りきらないためメニュー側） */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
      <nav className="flex items-center gap-6 xl:gap-10">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group font-mono text-[13px] tracking-[0.12em] flex items-center gap-2 transition-colors"
          >
            <span className="text-silk-label">{link.part}</span>
            <span className="text-nav group-hover:text-copper-hover transition-colors">{link.label}</span>
          </a>
        ))}
      </nav>
      <BoardSwitch />
      </div>

      {/* ハンバーガーボタン（lg未満のみ表示） */}
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
        className="lg:hidden relative z-50 flex flex-col justify-center items-center gap-[5px] w-8 h-8 shrink-0 text-silk"
      >
        <span
          className={`block w-6 h-[2px] bg-current transition-[translate,rotate] duration-300 ease-in-out ${isMenuOpen ? "translate-y-[6px] rotate-45" : ""}`}
        />
        <span
          className={`block w-6 h-[2px] bg-current transition-opacity duration-200 ease-in-out ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`block w-6 h-[2px] bg-current transition-[translate,rotate] duration-300 ease-in-out ${isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
        />
      </button>

      {/* モバイル用フルスクリーンメニュー（常時マウントし、opacity / visibility で開閉）。
          基板の色切り替えは <nav> の外、同じ固定レイヤーの中に置く */}
      <div
        aria-hidden={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-board transition-[opacity,visibility] duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            tabIndex={isMenuOpen ? 0 : -1}
            className={`group font-mono text-2xl font-bold tracking-[0.12em] flex items-baseline gap-3 transition-[opacity,translate] duration-[400ms] ease-out ${
              isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: isMenuOpen ? `${0.1 + i * 0.06}s` : "0s" }}
          >
            <span className="text-base text-silk-label">{link.part}</span>
            <span className="text-nav group-hover:text-copper-hover transition-colors">{link.label}</span>
          </a>
        ))}
        </nav>
        <BoardSwitch variant="menu" />
      </div>
    </header>
  );
};

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

// ＝＝＝ 表示域に入ったら .is-in を付けるラッパー（Framer Motion の whileInView の代替。見た目は globals.css の .reveal） ＝＝＝
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
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

// ＝＝＝ 部品番号付きセクション見出し（マスクリビール） ＝＝＝
// part: 基板上の部品番号（U1 / U2 / U3 / J1）、index: 連番（01〜04）、tag: 見出し右端の小さな注記
const SectionTitle = ({
  part,
  index,
  title,
  tag,
}: {
  part: string;
  index: string;
  title: string;
  tag?: string;
}) => (
  <div className="mb-12 md:mb-16">
    <Reveal variant="fade" className="font-mono text-[13px] tracking-[0.14em] text-accent mb-4">
      {part} / {index}
    </Reveal>
    {/* 見出し行。左端のパッド（円 + 短い線）はスパインの真上に乗るよう absolute で配置する。
        見出しは overflow-hidden の箱の中からせり上がる（.reveal-mask） */}
    <div className="relative flex items-end justify-between gap-4">
      <span className="pcb-pad" aria-hidden="true" />
      <Reveal variant="mask">
        <h3 className="font-display font-bold text-4xl md:text-[56px] leading-none tracking-tight text-silk">
          {title}
        </h3>
      </Reveal>
      {/* スマホでは見出しの幅を潰さないよう、ラベル行の右端（見出しの上）に逃がす */}
      {tag && (
        <span className="font-mono text-[12px] tracking-[0.12em] text-silk-label shrink-0 absolute right-0 -top-9 md:static md:pb-1">
          {tag}
        </span>
      )}
    </div>
  </div>
);

// ＝＝＝ Hero 右列: 回路の絵（配線・ビア・IC・LED）。演出は globals.css の .hero-circuit 配下 ＝＝＝
// LED の発光は filter ではなく radialGradient を塗った大きめの円（.led-glow）、電流の発光は太い半透明の線（.flow-glow）。
// 発光が切れないよう viewBox を少し広げ（上 20・右 20）、overflow: visible にしている
const chipPinYs = [272, 300, 328, 356, 384, 412];
const flowPaths = ["M740 392 H700 L660 432 V560", "M1020 280 H1080 L1120 240 V104", "M1020 392 H1100 L1140 432 V560"];

const HeroCircuit = () => (
  <svg viewBox="620 40 600 520" style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }} aria-hidden="true">
    <defs>
      <radialGradient id="led-glow-grad">
        <stop offset="0" stopColor="var(--led-glow)" stopOpacity="0.55" />
        <stop offset="1" stopColor="var(--led-glow)" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path className="trace" d="M740 392 H700 L660 432 V560" />
    <path className="trace t2" d="M740 420 H724 L690 454 V560" />
    <path className="trace t2" d="M1020 280 H1080 L1120 240 V104" />
    <path className="trace t3" d="M1020 336 H1140 L1170 306 V186" />
    <path className="trace t3" d="M1020 392 H1100 L1140 432 V560" />
    <path className="trace t4" d="M1020 420 H1060 L1100 460 H1200" />
    <path className="trace t4" d="M740 280 H690 L660 250 V170" />
    <path className="trace t4" d="M740 336 H700" />
    {flowPaths.map((d) => (
      <path key={`g${d}`} className="flow flow-glow" d={d} />
    ))}
    {flowPaths.map((d) => (
      <path key={`f${d}`} className="flow" d={d} />
    ))}
    <circle className="via" cx="660" cy="170" r="8" />
    <circle className="via" cx="700" cy="336" r="7" />
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
    <g fontFamily="var(--font-jetbrains), 'JetBrains Mono', monospace" fontSize="12" fill="var(--silk-muted)">
      <circle className="led-glow l1" cx="1120" cy="88" r="45" fill="url(#led-glow-grad)" />
      <circle className="led l1" cx="1120" cy="88" r="14" />
      <text x="1142" y="92">D1</text>
      <circle className="led-glow l2" cx="1170" cy="170" r="45" fill="url(#led-glow-grad)" />
      <circle className="led l2" cx="1170" cy="170" r="14" />
      <text x="1150" y="140">D2</text>
      <text x="764" y="238">U0</text>
    </g>
  </svg>
);

// ＝＝＝ Selected Works のデータ（並び順・文章・画像・リンク先は従来どおり） ＝＝＝
const worksData = [
  {
    ref: "U101",
    title: "TSUNAGU",
    award: "THE HACK 2026 東海予選1位通過 → 本選 デジタルフォルン賞・副大賞 受賞",
    description:
      "「通信が途絶えても、現場の状況は途絶えない」——災害時の避難所状況を収集・可視化するOffline First型の報告プラットフォーム。通信断時はLoRaで最低限の状況を本部へ届けます。",
    tech: ["React 19", "Vite", "FastAPI", "PostgreSQL", "AWS", "Terraform", "LoRa (ESP32)"],
    image: { src: "/tsunagu-hero.png", alt: "TSUNAGU メインビジュアル" },
    href: "/tsunagu",
  },
  {
    ref: "U102",
    title: "KOKUDO",
    award: "100program 優秀インタビュー賞・オーディエンス賞 受賞",
    description:
      "実際に走った距離を全国の国道に重ね、キャラクターとともに目標期日までの完走を目指す、ランニング・ウォーキング記録アプリです。",
    tech: ["Flutter (Dart)", "MapLibre GL", "geolocator", "health", "SQLite (sqflite)", "Firebase Authentication", "Cloud Firestore", "Terraform"],
    image: { src: "/KOKUDO_feature_a.png", alt: "KOKUDO メインビジュアル" },
    href: null,
  },
  {
    ref: "U103",
    title: "TrailDrop",
    award: "HACK STAGE 3 最優秀賞受賞",
    description:
      "目的地へ向かう旅行者のルートと通過時間から、その途中で受け取れる地域の商品を見つけ、予約・受取までをつなげるサービス。旅行者は出発地・目的地・出発時間を入力すると、ルート上の地域商品を確認でき、予約後に発行されるQRコードを使って道の駅などの無人受取ロッカーで商品を受け取れる。「わざわざ寄る」のではなく「通り道だから寄れる」ことで、いつもの旅に地域との接点をつくることを目指す。",
    tech: ["React", "Vite", "Tailwind CSS", "Python", "FastAPI", "Supabase", "PostgreSQL", "Google Routes API", "Google Maps", "qrcode.react"],
    image: { src: "/traildrop-hero.png", alt: "TrailDrop メインビジュアル" },
    href: "/traildrop",
  },
  {
    ref: "U104",
    title: "muscloop",
    award: "SysHack2026 CyberAgent Award",
    description:
      "モダンな技術スタックを用いた滑らかなユーザー体験にこだわっています。 今後はApple Developer Programに登録し、HealthKitと連携した本格的なヘルスケアデータ取得を実装予定です。",
    tech: ["React Native (Expo)", "FastAPI", "Firebase", "Docker", "AWS ECS", "HealthKit (実装予定)"],
    image: { src: "/muscloop.webp", alt: "muscloop Pamphlet" },
    href: "/muscloop",
  },
  {
    ref: "U105",
    title: "Taleglot",
    award: "100program オーディエンス賞×2 受賞",
    description:
      "言語と文化を学べるインタラクティブ絵本。タイに実在する民話を、絵本のように読み進めながらタイ語にふれられる学習アプリです。",
    tech: ["React", "Vite", "JavaScript", "localStorage", "HTML / CSS"],
    image: { src: "/taleglot.png", alt: "Taleglot メインビジュアル" },
    href: null,
  },
];

// ＝＝＝ IC チップ型の作品カード（詳細ページがあるものはカード全体がリンク） ＝＝＝
const WorkCard = ({ work, featured = false }: { work: (typeof worksData)[number]; featured?: boolean }) => {
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
        <p className="text-[13px] font-bold text-chip-led mt-3">{work.award}</p>
        <h4 className="font-display font-bold text-[34px] leading-tight text-chip-text mt-2">{work.title}</h4>
        <p className="text-[14px] leading-[1.8] text-chip-soft mt-4">{work.description}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {work.tech.map((tech) => (
            <span key={tech} className="font-mono text-[12px] text-chip-muted border border-chip-line rounded-[3px] px-2 py-1">
              {tech}
            </span>
          ))}
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

// ＝＝＝ Get in Touch のアイコン（従来の X / GitHub / メールの SVG をピン名の横に小さく残す） ＝＝＝
const ContactIcon = ({ kind }: { kind: "x" | "github" | "mail" }) => {
  if (kind === "x") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (kind === "github") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
};

const contactLinks: { label: string; href: string; icon: "x" | "github" | "mail"; external: boolean }[] = [
  { label: "rikuumezawa", href: "https://x.com/rikuumezawa", icon: "x", external: true },
  { label: "eggplant-umrk", href: "https://github.com/eggplant-umrk", icon: "github", external: true },
  { label: "eggplant2006@au.com", href: "mailto:eggplant2006@au.com", icon: "mail", external: false },
];

const newsData = [
  { date: "2026/11/02", text: "技育展 予選敗退" },
  { date: "2026/10/10", text: "Matsuriba夏祭り参加" },
  { date: "2026/10/03", text: "STECH FES LT参加" },
  { date: "2026/09/29", text: "HACK STAGE 3 最優秀賞 受賞" },
  { date: "2026/09/19", text: "100program 優秀インタビュー賞・オーディエンス賞×3 受賞" },
  { date: "2026/09/09", text: "特定非営利活動法人NxTEND東海事業部所属" },
  { date: "2026/08/28", text: "STECH に加入" },
  { date: "2026/08/22", text: "THE HACK 2026 本選 デジタルフォルン賞・副大賞を受賞" },
  { date: "2026/08/09", text: "THE HACK 2026 東海予選1位通過" },
  { date: "2026/08/08", text: "100program 10期 参加" },
  { date: "2026/08/01", text: "STECH CONNECT TOKAI 2026 参加" },
  { date: "2026/07/17", text: "29Tech vol.2 参加" },
  { date: "2026/07/11", text: "技育祭関西 参加" },
  { date: "2026/07/09", text: "Matsuriba vol.15 参加" },
  { date: "2026/06/20", text: "技育祭九州 参加" },
  { date: "2026/05/30", text: "技育博2026 vol1 に出展・参加" },
  { date: "2026/05/15", text: "Matsuriba vol.14 参加" },
  { date: "2026/04/26", text: "技育祭東海 参加" },
  { date: "2026/04/17", text: "エンジニアとしての個人名刺を作成!" },
  { date: "2026/03/31", text: "SysHack 2026 参加 / CyberAgent賞を受賞" },
  { date: "2026/03/08", text: "Matsurib MAX 2026 参加" },
  { date: "2026/02/11", text: "ニックトレイン 参加" },
];

export default function Home() {
  // Activity & News: 初期 5 件、「もっと見る」で 5 件ずつ追加、全件表示後は「閉じる」で 5 件に戻す
  const NEWS_STEP = 5;
  const [visibleNews, setVisibleNews] = useState(NEWS_STEP);
  // 👇 オープニングのスライドが終わったらオーバーレイを DOM から消すためのステート
  const [isOpeningDone, setIsOpeningDone] = useState(false);

  const watermarkRef = useRef<HTMLDivElement>(null);

  // 初回訪問の判定は layout.tsx の <head> のインラインスクリプトが描画前に行い、初回なら <html data-intro="play"> が付く
  // （オープニングの表示は CSS 側で html[data-intro="play"] のときだけ）。ここでは訪問済みフラグの書き込みだけを
  // 従来どおりマウント時に行う
  useEffect(() => {
    try {
      if (document.documentElement.dataset.intro === "play") {
        sessionStorage.setItem("portfolio_visited", "true");
      }
    } catch {
      // sessionStorage が使えない環境では何もしない
    }
  }, []);

  // 透かし文字のパララックス（scroll を rAF でまとめて translateY だけ動かす）
  useEffect(() => {
    const el = watermarkRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.transform = `translateY(${Math.min(window.scrollY, 1000) * 0.25}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // 常時動くアニメーション（data-pause-offscreen を付けた箱の中）は、画面外とタブ非表示のとき止める
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-pause-offscreen]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("is-paused", !e.isIntersecting);
    });
    targets.forEach((t) => io.observe(t));
    const onVisibility = () => document.documentElement.classList.toggle("is-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const allNewsShown = visibleNews >= newsData.length;
  const displayNews = newsData.slice(0, visibleNews);
  const handleNewsButton = () => {
    if (!allNewsShown) {
      setVisibleNews((n) => Math.min(n + NEWS_STEP, newsData.length));
      return;
    }
    setVisibleNews(NEWS_STEP);
    // 閉じたとき、News の見出しが画面外（ヘッダーの下に隠れている場合を含む）なら見出しまで戻す
    const section = document.getElementById("news");
    const heading = section?.querySelector("h3");
    if (section && heading) {
      const rect = heading.getBoundingClientRect();
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      if (rect.top < headerH || rect.bottom > window.innerHeight) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="pcb-board flex flex-col items-center w-full overflow-hidden relative text-silk">

      {/* ＝＝＝ ナビゲーションヘッダー ＝＝＝ */}
      <Header delayBase={0.2} />

      {/* ＝＝＝ オープニングアニメーション ＝＝＝ */}
      {/* 常に描画しておき、CSS で html[data-intro="play"]（初回訪問）のときだけ表示する。
          Hero の起動演出はこれの終了を待たず同時に進む。スライドし終わったら DOM から消す */}
      {!isOpeningDone && (
        <div
          className="opening fixed inset-0 z-[95] flex items-center justify-center bg-board-outer"
          onAnimationEnd={(e) => {
            if (e.animationName === "opening-slide") setIsOpeningDone(true); // 👇 スライドし終わったら完了フラグを立てる
          }}
        >
          <p className="opening-text text-silk text-lg md:text-2xl font-medium tracking-[0.2em] font-sans">
            Welcome to my portfolio.
          </p>
        </div>
      )}

      {/* ＝＝＝ ヒーローセクション ＝＝＝ */}
      {/* PC は左に文字（最大 640px）・右に回路（最大 540px）の2列、スマホは文字→回路の縦並び。
          起動演出は globals.css の .hero-in / .hero-circuit（CSS アニメーション）で、ページ表示と同時に始まる */}
      <main
        data-pause-offscreen
        className="relative min-h-screen flex flex-col w-full overflow-hidden pt-[calc(var(--header-h)+48px)] pb-8"
      >

        {/* 演出1：背景の光（filter: blur をやめ、静的な radial-gradient で同じ見た目に） */}
        <div className="hidden md:block hero-glow-desktop absolute inset-0 pointer-events-none z-0" />
        <div className="md:hidden hero-glow-mobile absolute inset-0 pointer-events-none z-0" />

        {/* 演出2：背景の巨大透かし文字（scroll に合わせて translateY、表示は CSS animation） */}
        <div
          ref={watermarkRef}
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

            <div className="hero-in mt-6" style={{ "--d": "0.5s" } as CSSProperties}>
              <h2 className="font-mono text-[16px] tracking-[0.2em] uppercase text-copper-light">
                Front-End Developer
              </h2>
              <span className="inline-block font-mono text-xs tracking-wider text-copper-light border-[1.5px] border-copper px-3 py-1.5 rounded-full mt-4">
                <span className="whitespace-nowrap">愛知工業大学</span>{" "}
                <span className="whitespace-nowrap">システム工学研究会・</span>
                <span className="whitespace-nowrap">STECH所属・</span>
                <span className="whitespace-nowrap">NxTEND東海事業部</span>
              </span>
              <p className="text-[26px] font-bold text-silk mt-6">ラーメンと旅行大好きエンジニア</p>
            </div>

            {/* 実績ごとに li で必ず改行し、実績の中は意味の塊ごとに nowrap で囲んで塊の間でだけ折り返す。
                塊が長すぎるとスマホ幅で右にはみ出すため、1塊は短く保ち、「・」「、」は行頭に来ないよう直前の塊に含める。
                各行の頭の配線と LED は globals.css の .hero-ach li::before / ::after */}
            <ul className="hero-in hero-ach mt-4 space-y-1 text-silk-soft leading-relaxed" style={{ "--d": "0.7s" } as CSSProperties}>
              <li>
                <span className="whitespace-nowrap">SysHack2026</span>{" "}
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
                <span className="whitespace-nowrap">100program</span>{" "}
                <span className="whitespace-nowrap">優秀インタビュー賞・</span>
                <span className="whitespace-nowrap">オーディエンス賞</span>
                <span className="whitespace-nowrap">『KOKUDO』、</span>
              </li>
              <li>
                <span className="whitespace-nowrap">100program</span>{" "}
                <span className="whitespace-nowrap">オーディエンス賞×2</span>
                <span className="whitespace-nowrap">『taleglot』、</span>
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
          <span className="hidden md:block font-mono text-[10px] tracking-[0.3em] text-silk-label">
            BASED IN AICHI, JAPAN
          </span>

          <div className="flex flex-col items-center mx-auto md:mx-0">
            <span
              className="font-mono text-[10px] tracking-[0.3em] text-silk-label mb-4"
              style={{ writingMode: "vertical-rl" }}
            >
              SCROLL
            </span>
            <div className="w-[1px] h-12 md:h-16 bg-line/40 overflow-hidden relative">
              <div className="scroll-hint-bar w-full h-1/2 bg-accent absolute top-0" />
            </div>
          </div>

          <span className="hidden md:block font-mono text-[10px] tracking-[0.3em] text-silk-label">
            2029 NEW GRAD — ENGINEER
          </span>
        </div>
      </main>

      {/* ＝＝＝ マーキー帯 ＝＝＝ */}
      <Marquee />

      {/* ＝＝＝ 基板スパイン：About〜Contact の左を縦に流れる配線（Hero には通さない） ＝＝＝ */}
      {/* 各セクションと同じ max-w / padding の透明な箱を重ね、その中で配線を絶対配置することで
          「本文コンテナの左端から 22px（PC 56px）内側」に 1 本の線を通す */}
      <div data-pause-offscreen className="relative w-full">
        <div className="pointer-events-none absolute inset-0 z-0 px-8 md:px-24" aria-hidden="true">
          <div className="relative h-full max-w-7xl mx-auto">
            <span className="pcb-spine left-[22px] md:left-[56px]" />
          </div>
        </div>

      {/* ＝＝＝ About（自己紹介）セクション ＝＝＝ */}
      <section id="about" className="w-full px-8 md:px-24 py-32 scroll-mt-[var(--header-h)]">
        <div className="max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          <SectionTitle part="U1" index="01" title="About Me" />
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
                チーム「CPY」としてSysHack2026や技育博に出場し、プロダクトを形にする楽しさを知りました。THE HACK 2026本選ではTSUNAGUでデジタルフォルン賞・副大賞をW受賞し、VORN Challenge 2026本戦への出場権も獲得しています。2026年8月にはSTECHにも加入し、今後は東海・関東・関西など各地の技術イベントにも積極的に足を運び、エンジニアとしての視野と技術力をさらに広げていきたいと考えています。
              </p>
            </div>
          </Reveal>

          {/* 右: 部品表（BOM）としてのスキル一覧 */}
          <Reveal margin="-100px" delay={0.2} className="w-full lg:w-[320px] lg:shrink-0">
            <p className="font-mono text-[12px] tracking-[0.14em] text-silk-label mb-4">BOM — SKILLS &amp; TECHNOLOGIES</p>
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
          </Reveal>

          </div>
        </div>
      </section>

      {/* ＝＝＝ ニュース＆アクティビティ セクション ＝＝＝ */}
      <section id="news" className="w-full px-8 md:px-24 py-24 scroll-mt-[var(--header-h)]">
        <div className="max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          <SectionTitle part="U2" index="02" title="Activity & News" tag="TEST LOG" />

          {/* 「日付 | 本文」の2列グリッド（スマホは縦積み） */}
          <div id="news-list" className="max-w-3xl flex flex-col border-t-[1.5px] border-line-strong">
            {displayNews.map((item, index) => (
              <Reveal
                key={index}
                variant="sm"
                delay={(index % NEWS_STEP) * 0.05}
                className="group grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-4 items-baseline py-5 border-b border-dotted border-line-dashed cursor-default"
              >
                <span className="font-mono text-[14px] text-silk-muted group-hover:text-led-text transition-colors duration-[250ms]">
                  {item.date}
                </span>
                <span className="text-[17px] font-medium text-silk group-hover:translate-x-[6px] transition-transform duration-[250ms]">
                  {item.text}
                </span>
              </Reveal>
            ))}
          </div>

          {newsData.length > NEWS_STEP && (
            <Reveal variant="fade" margin="0px" className="mt-8">
              <button
                type="button"
                onClick={handleNewsButton}
                aria-expanded={allNewsShown}
                aria-controls="news-list"
                className="inline-flex items-center justify-center min-h-[44px] px-6 border-[1.5px] border-copper bg-transparent text-copper-light font-mono text-[13px] tracking-[0.1em] rounded-[4px] hover:bg-copper hover:text-board transition-colors duration-300"
              >
                {allNewsShown ? "↑ 閉じる" : "↓ もっと見る"}
              </button>
            </Reveal>
          )}
        </div>
      </section>

      {/* ＝＝＝ プロジェクトセクション ＝＝＝ */}
      <section id="projects" className="w-full px-8 md:px-24 py-32 scroll-mt-[var(--header-h)]">
        <div className="max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          <SectionTitle part="U3" index="03" title="Selected Works" />

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
      <footer id="contact" className="w-full px-8 md:px-24 pt-32 pb-12 border-t border-line scroll-mt-[var(--header-h)]">
        <div className="max-w-7xl mx-auto pl-[52px] md:pl-[112px]">
          <SectionTitle part="J1" index="04" title="Get in Touch" />

          <Reveal margin="0px" delay={0.1} className="max-w-md mb-12">
            <p className="text-silk-muted leading-relaxed">
              お仕事のご相談、イベントのお誘い、おすすめのラーメン情報など、お気軽にご連絡ください。
            </p>
          </Reveal>

          {/* コネクタ: 点線枠の中に各連絡先を「ピン」として並べる */}
          <Reveal margin="0px" delay={0.2} className="max-w-3xl border-[1.5px] border-dashed border-line-strong rounded-[6px] px-8 py-7 mb-24">
            <p className="font-mono text-[12px] tracking-[0.12em] text-silk-label mb-6">J1 — CONNECTOR</p>
            <div className="flex flex-wrap gap-7">
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="pin flex flex-col items-start gap-3"
                >
                  <span className="pin-pad" aria-hidden="true" />
                  <span className="pin-label flex items-center gap-2 font-mono text-[13px] text-silk transition-colors duration-200">
                    <ContactIcon kind={link.icon} />
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </Reveal>

          {/* フッター（従来の「BACK TO TOP ↑」リンクは残す） */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8 border-t border-line font-mono text-[12px] tracking-[0.12em] text-silk-label">
            <p>© RIKU UMEZAWA</p>
            <p>BOARD: PORTFOLIO · REV 2026.11 · MADE IN NAGOYA</p>
            <a href="#" className="hover:text-copper-hover transition-colors">
              BACK TO TOP ↑
            </a>
          </div>
        </div>
      </footer>
      </div>
      {/* ＝＝＝ /基板スパイン ＝＝＝ */}
    </div>
  );
}
