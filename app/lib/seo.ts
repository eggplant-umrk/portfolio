import type { Metadata } from "next";

// ＝＝＝ 検索向けの共通設定 ＝＝＝
// サイトの URL（layout.tsx の metadataBase、sitemap.ts、robots.ts、JSON-LD で共通）
export const SITE_URL = "https://eggplant-portfolio-rho.vercel.app";
export const SITE_NAME = "梅澤 陸 (Riku Umezawa) | Front-End Developer Portfolio";
export const SITE_DESCRIPTION =
  "愛知工業大学で電気電子工学を専攻する29卒のフロントエンドエンジニア、梅澤陸のポートフォリオ。React Native・Figmaを中心に、ハッカソンでの受賞作品（TSUNAGU、TrailDrop、muscloop、KOKUDO、Taleglot）を紹介しています。";

// ページごとの title / description / canonical / og / twitter をまとめて作る。
// Next.js の metadata は openGraph などの入れ子を親子で深くは合成しないので、ページごとに全部そろえて返す
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// 詳細ページの title は「作品名 | 梅澤 陸 (Riku Umezawa)」
export function workMetadata({ name, description, path }: { name: string; description: string; path: string }): Metadata {
  return pageMetadata({ title: `${name} | 梅澤 陸 (Riku Umezawa)`, description, path });
}
