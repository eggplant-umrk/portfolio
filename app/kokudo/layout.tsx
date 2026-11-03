import type { Metadata } from "next";

// page.tsx はクライアントコンポーネントのため、metadata はここで設定する
export const metadata: Metadata = {
  title: "KOKUDO | Riku Umezawa",
  description:
    "走った道が、日本地図になっていく。実際に走った距離を全国の国道の区間に換算し、国道を一本ずつ走破していくランニング・ウォーキング記録アプリ KOKUDO の制作事例。",
};

export default function KokudoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
