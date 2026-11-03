import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import LazyProbe from "./components/LazyProbe"; // 測定プローブ型カーソル（マウスのある端末で、手が空いてから読み込む）

// 見出し・名前（使っているのは 700 のみ）
const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  variable: "--font-chakra",
});

// ラベル・日付・ナビ・部品番号（400: 本文、500: BOM 見出し行、700: モバイルメニュー）
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});

// 本文（日本語）。Google Fonts 版は 120 以上のスライスに分かれていて preload すると 240 本以上の
// preload が出るため、サイトで使っている文字だけにサブセット化した woff2（scripts/subset-fonts.mjs が
// predev / prebuild で app/fonts/ に生成）を自己ホストして preload する
const zenKakuGothicNew = localFont({
  src: [
    { path: "./fonts/ZenKakuGothicNew-400-subset.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ZenKakuGothicNew-700-subset.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: true,
  fallback: ["Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
  variable: "--font-zen-kaku",
});

export const metadata: Metadata = {
  // og:image / twitter:image（app/opengraph-image.tsx ほか）の URL をこのオリジンで解決する
  metadataBase: new URL("https://eggplant-portfolio-rho.vercel.app"),
  title: "Riku Umezawa | Portfolio",
  description: "rikuのポートフォリオサイトです。パソコン推奨です",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Riku Umezawa | Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${chakraPetch.variable} ${jetBrainsMono.variable} ${zenKakuGothicNew.variable} h-full antialiased scroll-smooth`}
      data-board="white"
      data-layers="fcu silks edge"
      suppressHydrationWarning
    >
      <head>
        {/* ブラウザ UI の色（アドレスバーなど）。基板の色に合わせて下のスクリプトと BoardSwitch が書き換える */}
        <meta name="theme-color" content="#F2F1EA" />
        {/* 描画前に走らせる判定。
            1) 基板の色: localStorage "portfolio_board"（green / blue）を <html data-board> と theme-color に反映し、
               読み込み時に別の色が映らないようにする。無い・読めない・不正値なら既定の white のまま。
               旧キー "board" が残っていれば portfolio_board に移して削除する。OS のライト/ダーク設定には連動させない。
            2) 初回訪問: sessionStorage が無くハッシュも無ければ <html data-intro="play"> を付けてオープニングを出す。
            訪問済みフラグの書き込みは app/page.tsx のマウント時（従来どおり）
            3) レイヤー表示: localStorage "portfolio_layers"（空白区切り。fcu / bcu / silks / edge のみ有効）を
               <html data-layers> に反映し、リロード時にちらつかないようにする */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var b=localStorage.getItem("portfolio_board");if(!b){var o=localStorage.getItem("board");if(o){localStorage.setItem("portfolio_board",o);localStorage.removeItem("board");b=o}}' +
              'if(b==="green"||b==="blue"){document.documentElement.setAttribute("data-board",b);var m=document.querySelector("meta[name=theme-color]");if(m){m.setAttribute("content",b==="green"?"#0D2E22":"#10325A")}}}catch(e){}' +
              'try{if(!sessionStorage.getItem("portfolio_visited")&&!location.hash){document.documentElement.setAttribute("data-intro","play")}}catch(e){}' +
              'try{var l=localStorage.getItem("portfolio_layers");if(typeof l==="string"){var v=l.split(" ").filter(function(t){return t==="fcu"||t==="bcu"||t==="silks"||t==="edge"});document.documentElement.setAttribute("data-layers",v.join(" "))}}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-board-outer text-silk font-sans">
        <LazyProbe /> {/* サイト全体にプローブ型カーソルを配置（PC のみ。最初の表示が終わってから読み込む） */}
        {children}
      </body>
    </html>
  );
}
