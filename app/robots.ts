import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

// /robots.txt: すべてのクローラーに全ページを許可し、sitemap の場所を示す
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
