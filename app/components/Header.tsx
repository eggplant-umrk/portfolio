"use client";

import { useState, type CSSProperties } from "react";
import BoardSwitch from "./BoardSwitch";
import { useHideOnScroll } from "../lib/use-hide-on-scroll";

// ＝＝＝ 固定ナビゲーションヘッダー ＝＝＝
const navLinks = [
  { part: "U1", label: "ABOUT", href: "#about" },
  { part: "U2", label: "NEWS", href: "#news" },
  { part: "U3", label: "WORKS", href: "#projects" },
  { part: "J1", label: "CONTACT", href: "#contact" },
];

export default function Header({ delayBase }: { delayBase: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 1023px 以下: 下にスクロールしている間は上へ隠す（.is-hidden、globals.css）。メニューが開いている間は隠さない
  const hidden = useHideOnScroll({ hold: isMenuOpen });

  return (
    <header
      className={`${hidden ? "is-hidden " : ""}header-in site-header fixed top-0 left-0 w-full z-40 h-[var(--header-h)] flex items-center justify-between md:backdrop-blur-md bg-board/90 md:bg-board/70 border-b border-line`}
      style={{ "--d": `${delayBase}s` } as CSSProperties}
    >
      {/* ロゴ風「RU」（銅色の枠）+ リビジョン表記 */}
      <a href="#" className="flex items-center gap-3 whitespace-nowrap group max-lg:min-h-11" aria-label="RIKU UMEZAWA">
        <span className="flex items-center justify-center w-9 h-9 rounded-[4px] border-2 border-copper font-display font-bold text-sm tracking-tight text-copper-light group-hover:text-copper-hover group-active:text-copper-hover transition-colors">
          RU
        </span>
        <span className="font-mono text-[12px] tracking-[0.12em] text-silk-label">REV 2026.11</span>
      </a>

      {/* デスクトップ用ナビ + 基板の色切り替え（lg 以上のみ表示。768〜1023px ではヘッダーに入りきらないためメニュー側） */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
      <nav className="flex items-center gap-6 xl:gap-10">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="group font-mono text-[13px] tracking-[0.12em] flex items-center gap-2 transition-colors"
          >
            <span className="text-silk-label">{link.part}</span>
            <span className="text-nav group-hover:text-copper-hover transition-colors">{link.label}</span>
          </a>
        ))}
      </nav>
      <BoardSwitch />
      </div>

      {/* ハンバーガーボタン（lg未満のみ表示） */}
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-expanded={isMenuOpen}
        className="lg:hidden relative z-50 flex flex-col justify-center items-center gap-[5px] w-11 h-11 -mr-1.5 shrink-0 text-silk"
      >
        <span
          className={`block w-6 h-[2px] bg-current transition-[translate,rotate] duration-300 ease-in-out ${isMenuOpen ? "translate-y-[6px] rotate-45" : ""}`}
        />
        <span
          className={`block w-6 h-[2px] bg-current transition-opacity duration-200 ease-in-out ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
        />
        <span
          className={`block w-6 h-[2px] bg-current transition-[translate,rotate] duration-300 ease-in-out ${isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
        />
      </button>

      {/* モバイル用フルスクリーンメニュー（常時マウントし、opacity / visibility で開閉）。
          基板の色切り替えは <nav> の外、同じ固定レイヤーの中に置く */}
      <div
        aria-hidden={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-board transition-[opacity,visibility] duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            tabIndex={isMenuOpen ? 0 : -1}
            className={`group font-mono text-2xl font-bold tracking-[0.12em] flex items-baseline gap-3 py-1.5 transition-[opacity,translate] duration-[400ms] ease-out ${
              isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: isMenuOpen ? `${0.1 + i * 0.06}s` : "0s" }}
          >
            <span className="text-base text-silk-label">{link.part}</span>
            <span className="text-nav group-hover:text-copper-hover group-active:text-copper-hover transition-colors">{link.label}</span>
          </a>
        ))}
        </nav>
        <BoardSwitch variant="menu" />
      </div>
    </header>
  );
}
