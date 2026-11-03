import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ProbeCursor from "./components/ProbeCursor"; // 測定プローブ型カーソル（PC のみ）

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
    { path: "./fonts/ZenKakuGothicNew-500-subset.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ZenKakuGothicNew-700-subset.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: true,
  fallback: ["Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
  variable: "--font-zen-kaku",
});

export const metadata: Metadata = {
  title: "Riku Umezawa | Portfolio",
  description: "rikuのポートフォリオサイトです。パソコン推奨です",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${chakraPetch.variable} ${jetBrainsMono.variable} ${zenKakuGothicNew.variable} h-full antialiased scroll-smooth dark`}
      suppressHydrationWarning
    >
      <head>
        {/* 初回訪問の判定（オープニングを出すか）。描画前に走らせて <html data-intro="play"> を付け、
            2回目以降にオープニングが一瞬でも映らないようにする。sessionStorage が読めない環境では何もしない。
            訪問済みフラグの書き込みは app/page.tsx のマウント時（従来どおり） */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(!sessionStorage.getItem("portfolio_visited")&&!location.hash){document.documentElement.setAttribute("data-intro","play")}}catch(e){}',
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-500">
        <ProbeCursor /> {/* サイト全体にプローブ型カーソルを配置（PC のみ表示） */}
        {children}
      </body>
    </html>
  );
}
