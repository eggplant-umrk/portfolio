"use client";

import { useSyncExternalStore } from "react";

// ＝＝＝ 基板の色（テーマ）切り替え ＝＝＝
// <html data-board="white|green|blue"> を切り替え、選択を localStorage "portfolio_board" に保存する。
// 描画前の適用は app/layout.tsx の <head> のインラインスクリプトが行う（既定は white）。
export const BOARDS = [
  // 白の色見本は白い地でも見えるよう、枠をはっきりした灰色にする
  { id: "white", label: "白の基板", short: "WHT", swatch: "#F2F1EA", swatchBorder: "#8C8F86", themeColor: "#F2F1EA" },
  { id: "green", label: "緑の基板", short: "GRN", swatch: "#0D2E22", swatchBorder: "rgba(236, 238, 228, 0.45)", themeColor: "#0D2E22" },
  { id: "blue", label: "青の基板", short: "BLU", swatch: "#10325A", swatchBorder: "rgba(236, 238, 228, 0.45)", themeColor: "#10325A" },
] as const;

export type Board = (typeof BOARDS)[number]["id"];

export const STORAGE_KEY = "portfolio_board";
const EVENT = "boardchange";
const DEFAULT_BOARD: Board = "white";

// render 中には呼ばない（useSyncExternalStore の getSnapshot としてだけ使う）
function readBoard(): Board {
  const b = document.documentElement.dataset.board;
  return b === "green" || b === "blue" ? b : DEFAULT_BOARD;
}

// SSR とハイドレーション時はつねに white（<html data-board="white"> と一致させる）
function readServerBoard(): Board {
  return DEFAULT_BOARD;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

export function setBoard(board: Board) {
  const root = document.documentElement;
  // 背景色・文字色を 0.3 秒でなめらかに切り替える。prefers-reduced-motion のときは付けない（即時）
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 350);
  }
  root.dataset.board = board;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = BOARDS.find((b) => b.id === board)?.themeColor ?? "#F2F1EA";
  try {
    localStorage.setItem(STORAGE_KEY, board);
  } catch {
    // localStorage が使えない環境では保存しない（表示の切り替えだけ行う）
  }
  // 同じページ内の BoardSwitch（ヘッダー / メニュー）すべてに知らせる
  window.dispatchEvent(new Event(EVENT));
}

// variant: "inline" = ヘッダー内（lg 以上で表示） / "menu" = スマホメニュー内 / "floating" = 詳細ページの右下
// 見た目はどれも同じ: 「BOARD」ラベル + セグメント型（枠 1.5px 銅色・角丸 6px・高さ 40px）の 3 ボタン
export default function BoardSwitch({ variant = "inline" }: { variant?: "inline" | "menu" | "floating" }) {
  const board = useSyncExternalStore(subscribe, readBoard, readServerBoard);

  const wrapper =
    variant === "floating"
      ? "fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-board/90 border border-line md:backdrop-blur-md"
      : variant === "menu"
        ? "flex items-center gap-2 mt-6"
        : "hidden lg:flex items-center gap-2";

  return (
    <div className={wrapper} role="group" aria-label="基板の色">
      <span className="font-mono text-[11px] tracking-[0.14em] text-silk-label">BOARD</span>
      <div className="flex items-center h-10 rounded-[6px] border-[1.5px] border-copper px-[3px] gap-[3px]">
        {BOARDS.map((b) => {
          const selected = board === b.id;
          return (
            // ボタン自体は 44px の高さ（枠の上下 2px ずつ外へ）でタップ範囲を確保し、見える部分は中の span
            <button
              key={b.id}
              type="button"
              aria-label={b.label}
              aria-pressed={selected}
              onClick={() => setBoard(b.id)}
              className="flex items-center h-11 -my-[2px] shrink-0 rounded-[4px] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
            >
              <span
                className={`flex items-center gap-1.5 h-8 px-2 rounded-[4px] font-mono text-[12px] tracking-[0.08em] transition-colors ${
                  selected ? "bg-switch-on text-board" : "text-silk-muted hover:text-silk"
                }`}
              >
                <span
                  className="block w-5 h-5 rounded-[3px] border"
                  style={{
                    backgroundColor: b.swatch,
                    borderColor: selected ? "color-mix(in srgb, var(--board) 55%, transparent)" : b.swatchBorder,
                  }}
                />
                {b.short}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
