import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

// /sitemap.xml: トップと詳細ページ 4 つ（404 や OGP 画像は含めない）。lastModified はビルド時の日付
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/tsunagu`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/muscloop`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/traildrop`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/kokudo`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
