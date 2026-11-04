import type { Metadata, Viewport } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./lib/seo";
import LazyProbe from "./components/LazyProbe"; // 測定プローブ型カーソル（マウスのある端末で、手が空いてから読み込む）
import BoardAuto from "./components/BoardAuto"; // 基板の色を OS のダークモード設定に追従（保存値がない人だけ）

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
  metadataBase: new URL(SITE_URL),
  // 既定の title / description（トップと同じ。各ページは app/lib/seo.ts の pageMetadata / workMetadata で上書き）
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  // Google Search Console の所有権確認（<meta name="google-site-verification">）
  verification: {
    google: "peCh05ipr597sLrWFNxjsDp27gnzR_YbqVAFm0apUZc",
  },
};

// iPhone のノッチ・ホームバーまで描画領域を広げ、余白は CSS の env(safe-area-inset-*) で取る
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
               読み込み時に別の色が映らないようにする。旧キー "board" が残っていれば portfolio_board に移して削除する。
               保存値が無い人は OS のダークモード設定（prefers-color-scheme: dark）なら green、それ以外・読めないときは white。
               自動で決めた色は保存しない（保存するのは本人が切り替えボタンを押したときだけ）。
            2) 初回訪問: sessionStorage が無くハッシュも無ければ <html data-intro="play"> を付けてオープニングを出す。
            訪問済みフラグの書き込みは app/page.tsx のマウント時（従来どおり）
            3) レイヤー表示: localStorage "portfolio_layers"（空白区切り。fcu / bcu / silks / edge のみ有効）を
               <html data-layers> に反映し、リロード時にちらつかないようにする */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var b=localStorage.getItem("portfolio_board");if(!b){var o=localStorage.getItem("board");if(o){localStorage.setItem("portfolio_board",o);localStorage.removeItem("board");b=o}}' +
              'if(b!=="green"&&b!=="blue"&&b!=="white"){b=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"green":"white"}' +
              'if(b==="green"||b==="blue"){document.documentElement.setAttribute("data-board",b);var m=document.querySelector("meta[name=theme-color]");if(m){m.setAttribute("content",b==="green"?"#0D2E22":"#10325A")}}}catch(e){}' +
              'try{if(!sessionStorage.getItem("portfolio_visited")&&!location.hash){document.documentElement.setAttribute("data-intro","play")}}catch(e){}' +
              'try{var l=localStorage.getItem("portfolio_layers");if(typeof l==="string"){var v=l.split(" ").filter(function(t){return t==="fcu"||t==="bcu"||t==="silks"||t==="edge"});document.documentElement.setAttribute("data-layers",v.join(" "))}}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-board-outer text-silk font-sans">
        <BoardAuto /> {/* OS のダークモード設定が変わったときの追従（保存値がない人だけ） */}
        <LazyProbe /> {/* サイト全体にプローブ型カーソルを配置（PC のみ。最初の表示が終わってから読み込む） */}
        {children}
      </body>
    </html>
  );
}
