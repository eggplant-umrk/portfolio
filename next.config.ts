import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// スマホ実機確認用に許可する開発サーバーの origin（.env.local の DEV_LAN_ORIGINS、未設定なら空）
const devLanOrigins = (process.env.DEV_LAN_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

// Content-Security-Policy。本番は 'self' 中心。開発時だけ HMR 用に script-src 'unsafe-eval' と connect-src ws: を足す。
// nonce 方式は静的生成ができなくなるため使わず、Next.js が出すインラインスクリプト/スタイルのために 'unsafe-inline' を許可する。
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://i.ytimg.com", // data: は Next.js の画像のプレースホルダ用。i.ytimg.com は YouTube のサムネイル
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "frame-src https://www.youtube-nocookie.com", // YouTube の埋め込みは youtube-nocookie だけを使う（YouTubeEmbed.tsx）
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // 本番だけ: 開発時はスマホから http://<Wi-Fi の IP>:3000 で開くので、https への自動昇格があると JS・CSS・フォントが全部読めなくなる
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // X-Powered-By: Next.js を出さない
  poweredByHeader: false,
  // 開発時だけ: スマホ（同じ Wi-Fi）から http://<Wi-Fi の IP>:3000 で開いたときに HMR（/_next/hmr）を拒否しないようにする。
  // IP は .env.local の DEV_LAN_ORIGINS（カンマ区切り）に書く。Wi-Fi が変わって IP が変わったら .env.local の値を変える。本番には影響しない
  allowedDevOrigins: devLanOrigins,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
