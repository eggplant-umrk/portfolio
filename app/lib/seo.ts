import type { Metadata } from "next";
import { GITHUB_URL, NAME_EN, NAME_JA, X_URL } from "./profile";

// ＝＝＝ 検索向けの共通設定 ＝＝＝
// サイトの URL（layout.tsx の metadataBase、sitemap.ts、robots.ts、JSON-LD で共通）
export const SITE_URL = "https://eggplant-portfolio-rho.vercel.app";
export const SITE_NAME = `${NAME_JA} (${NAME_EN}) | Front-End Developer Portfolio`;
export const SITE_DESCRIPTION =
  "愛知工業大学で電気電子工学を専攻する29卒のフロントエンドエンジニア、梅澤陸のポートフォリオ。React Native・Figmaを中心に、ハッカソンでの受賞作品（TSUNAGU、TrailDrop、muscloop、KOKUDO、Taleglot）を紹介しています。";

// ページの絶対 URL。トップだけ末尾に / を付け、詳細ページは付けない（canonical・og:url・sitemap で同じ形にそろえる）
export function pageUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

// ページごとの「内容を最後に変えた日」（sitemap の lastModified）。本文や画像を変えたら、そのページの日付を更新する
export const PAGE_DATES: Record<string, string> = {
  "/": "2026-11-04",
  "/tsunagu": "2026-11-04",
  "/muscloop": "2026-11-04",
  "/traildrop": "2026-11-04",
  "/kokudo": "2026-11-04",
};

// ページごとの title / description / canonical / og / twitter をまとめて作る。
// Next.js の metadata は openGraph などの入れ子を親子で深くは合成しないので、ページごとに全部そろえて返す
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = pageUrl(path);
  // トップ（path "/"）は Next.js の metadata が末尾の / を落として origin だけにするため、canonical と og:url は
  // app/page.tsx が <link rel="canonical"> と <meta property="og:url"> を直接描画する（React が <head> に移す）
  const isTop = path === "/";
  return {
    title,
    description,
    alternates: isTop ? undefined : { canonical: url },
    openGraph: {
      type,
      locale: "ja_JP",
      siteName: SITE_NAME,
      ...(isTop ? {} : { url }),
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

// 詳細ページの title は「作品名 | 梅澤 陸 (Riku Umezawa)」、og:type は article
export function workMetadata({ name, description, path }: { name: string; description: string; path: string }): Metadata {
  return pageMetadata({ title: `${name} | ${NAME_JA} (${NAME_EN})`, description, path, type: "article" });
}

// 本人（Person）の構造化データ。トップの JSON-LD と、詳細ページの CreativeWork の author で共通
export const personJsonLd = {
  "@type": "Person",
  name: NAME_JA,
  alternateName: NAME_EN,
  url: SITE_URL,
  jobTitle: "Front-End Developer",
  affiliation: { "@type": "CollegeOrUniversity", name: "愛知工業大学" },
  sameAs: [X_URL, GITHUB_URL],
};

// 詳細ページの構造化データ（CreativeWork: 作品名・説明・作者・URL）
export function workJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: pageUrl(path),
    author: personJsonLd,
  };
}
