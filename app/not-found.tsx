import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 | Riku Umezawa",
};

// ＝＝＝ 404: OPEN CIRCUIT（断線した配線） ＝＝＝
// 基板の地（3 テーマは <html data-board> と CSS 変数で切り替わる）の中央に、途中で切れた配線を置く。
// 断線の隙間の火花は CSS アニメーション（.open-circuit-spark）。prefers-reduced-motion のときは光らせない
export default function NotFound() {
  return (
    <main className="pcb-board min-h-screen-dvh w-full flex flex-col items-center justify-center px-8 py-24 text-center text-silk">
      <svg className="open-circuit" viewBox="0 0 320 80" width="320" height="80" aria-hidden="true">
        {/* 左右の配線。断線した端は少し広げて、むき出しの銅に見せる */}
        <path className="open-circuit-trace" d="M0 40 H60 L84 16 H132" />
        <path className="open-circuit-trace" d="M188 64 H236 L260 40 H320" />
        <circle className="open-circuit-end" cx="132" cy="16" r="5" />
        <circle className="open-circuit-end" cx="188" cy="64" r="5" />
        <circle className="open-circuit-via" cx="60" cy="40" r="6" />
        <circle className="open-circuit-via" cx="260" cy="40" r="6" />
        {/* 断線の隙間で時々光る火花 */}
        <g className="open-circuit-spark">
          <path d="M150 34 l6 -8 l-2 10 l8 -3 l-7 7 l9 2 l-10 2 l5 8 l-8 -5 l-1 9 l-3 -9 l-7 6 l4 -9 l-9 0 l8 -4 l-6 -7 z" />
        </g>
        <g className="open-circuit-spark open-circuit-spark--2">
          <path d="M170 48 l4 -6 l-1 7 l6 -2 l-5 5 l6 2 l-7 1 l3 6 l-6 -4 l-1 6 l-2 -6 l-5 4 l3 -6 l-6 0 l5 -3 l-4 -5 z" />
        </g>
      </svg>
      <h1 className="font-display font-bold text-[96px] md:text-[140px] leading-none tracking-tight mt-6">404</h1>
      <p className="font-mono text-[14px] md:text-[16px] tracking-[0.3em] text-accent mt-3">OPEN CIRCUIT</p>
      <p className="text-silk-soft leading-relaxed mt-10">お探しのページは見つかりませんでした。</p>
      <Link
        href="/"
        className="mt-10 inline-flex items-center h-11 px-6 rounded-[6px] border-[1.5px] border-copper font-mono text-[13px] tracking-[0.08em] text-silk-muted hover:text-silk active:text-silk transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
      >
        ← Back to Home
      </Link>
    </main>
  );
}
