import type { MetadataRoute } from "next";
import { PAGE_DATES, pageUrl } from "./lib/seo";

// /sitemap.xml: トップと詳細ページ 4 つ（404 や OGP 画像は含めない）。
// lastModified はページごとの「内容を最後に変えた日」（app/lib/seo.ts の PAGE_DATES）。URL の形（トップだけ末尾 /）は canonical と同じ
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(PAGE_DATES).map(([path, date]) => ({
    url: pageUrl(path),
    lastModified: new Date(date),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
