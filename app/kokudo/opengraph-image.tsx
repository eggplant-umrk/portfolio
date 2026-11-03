import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "../lib/og";

// OGP（og:image） 画像（ビルド時に静的生成）。描画は app/lib/og.tsx
export const alt = "KOKUDO | Riku Umezawa";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({ title: "KOKUDO" });
}
