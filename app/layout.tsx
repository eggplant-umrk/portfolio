import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/CustomCursor"; // カスタムカーソルを読み込み

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
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
      className={`${inter.variable} ${notoSansJP.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#1A1A1A] font-sans">
        <CustomCursor /> {/* サイト全体にカーソルを配置 */}
        {children}
      </body>
    </html>
  );
}