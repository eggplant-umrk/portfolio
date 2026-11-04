"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useHideOnScroll } from "../lib/use-hide-on-scroll";

// ＝＝＝ 基板の色（テーマ）切り替え ＝＝＝
// <html data-board="white|green|blue"> を切り替え、選択を localStorage "portfolio_board" に保存する。
// 描画前の適用は app/layout.tsx の <head> のインラインスクリプトが行う（保存値がなければ、OS のダークモード設定なら green、
// それ以外は white。表示中の追従は BoardAuto.tsx の followSystemBoard）。SSR とハイドレーションの値はつねに white
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

// 覆いに使う切り替え先の色（globals.css の各テーマの --board / --grid-dot / --silk-label / --silk / --copper と同じ値）
const FLASH_COLORS: Record<Board, { board: string; dot: string; label: string; text: string; copper: string }> = {
  white: { board: "#F2F1EA", dot: "rgba(20, 30, 25, 0.09)", label: "#5B675F", text: "#141613", copper: "#B07A3E" },
  green: { board: "#0D2E22", dot: "rgba(236, 238, 228, 0.15)", label: "#7FA08F", text: "#ECEEE4", copper: "#D19A5B" },
  blue: { board: "#10325A", dot: "rgba(236, 240, 246, 0.15)", label: "#8FA6C1", text: "#ECEEE4", copper: "#D19A5B" },
};
// 覆いの時間（ms）: フェードイン → 一気に切り替え → 見せる → フェードアウト（合計 0.7s）
const FLASH_IN = 150;
const FLASH_HOLD = 350;
const FLASH_OUT = 200;

// <html data-board> と theme-color を切り替え、ページ内の BoardSwitch すべてに知らせる。
// save が true のとき（本人がボタンを押したとき）だけ localStorage に保存する
function applyBoard(board: Board, save = true) {
  document.documentElement.dataset.board = board;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = BOARDS.find((b) => b.id === board)?.themeColor ?? "#F2F1EA";
  if (save) {
    try {
      localStorage.setItem(STORAGE_KEY, board);
    } catch {
      // localStorage が使えない環境では保存しない（表示の切り替えだけ行う）
    }
  }
  window.dispatchEvent(new Event(EVENT));
}

// 保存値があるか（読めないときは「ない」扱い）
function hasSavedBoard() {
  try {
    const b = localStorage.getItem(STORAGE_KEY);
    return b === "white" || b === "green" || b === "blue";
  } catch {
    return false;
  }
}

// OS のダークモード設定の変化に追従する（保存値がない人だけ。dark → green、light → white）。
// 覆い・トランジション・読み上げなしで即座に切り替え、保存もしない。ボタンを押して保存された後は追従しない。
// 戻り値は後始末の関数
export function followSystemBoard() {
  if (!window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = (e: MediaQueryListEvent) => {
    if (hasSavedBoard()) return;
    applyBoard(e.matches ? "green" : "white", false);
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// 読み上げ専用の領域（画面には出さない）に「緑の基板に切り替えました」と入れる
let liveEl: HTMLDivElement | null = null;
function announce(board: Board) {
  if (!liveEl) {
    liveEl = document.createElement("div");
    liveEl.className = "sr-only-live";
    liveEl.setAttribute("aria-live", "polite");
    liveEl.setAttribute("aria-atomic", "true");
    document.body.appendChild(liveEl);
  }
  const label = BOARDS.find((b) => b.id === board)?.label ?? "基板";
  liveEl.textContent = `${label}に切り替えました`;
}

// 画面全体を覆う表示（body に 1 つだけ作って使い回す）。装飾なので aria-hidden
let flashEl: HTMLDivElement | null = null;
let flashName: HTMLElement | null = null;
function ensureFlash() {
  if (!flashEl) {
    flashEl = document.createElement("div");
    flashEl.className = "board-flash";
    flashEl.setAttribute("aria-hidden", "true");
    const label = document.createElement("p");
    label.className = "board-flash-label";
    label.textContent = "FLASHING BOARD…";
    flashName = document.createElement("p");
    flashName.className = "board-flash-name";
    const bar = document.createElement("div");
    bar.className = "board-flash-bar";
    bar.appendChild(document.createElement("span"));
    flashEl.append(label, flashName, bar);
    document.body.appendChild(flashEl);
  }
  return flashEl;
}
// 覆いの色と名前を切り替え先に合わせる（連打で切り替え先が変わったときにも呼ぶ）
function paintFlash(board: Board) {
  const el = ensureFlash();
  const c = FLASH_COLORS[board];
  el.style.setProperty("--flash-board", c.board);
  el.style.setProperty("--flash-dot", c.dot);
  el.style.setProperty("--flash-label", c.label);
  el.style.setProperty("--flash-text", c.text);
  el.style.setProperty("--flash-copper", c.copper);
  if (flashName) flashName.textContent = BOARDS.find((b) => b.id === board)?.short ?? "";
}

// 連打の扱い: 覆いが出ている間に押されたら切り替え先だけ差し替え、切り替えは 1 回にする。
// 切り替え後（見せている間・フェードアウト中）に押されたら、終わってから最後の色でもう 1 回だけ行う
let pending: Board | null = null;
let running = false;
function runFlash() {
  const el = ensureFlash();
  paintFlash(pending as Board);
  el.classList.remove("is-out");
  void el.offsetWidth; // 一度レイアウトを確定させてから is-on を付け、opacity のトランジションを始める
  el.classList.add("is-on");
  window.setTimeout(() => {
    // 覆いが出きったら、最後に押された色へ一気に切り替える（トランジションなし）
    const target = pending as Board;
    applyBoard(target);
    announce(target);
    window.setTimeout(() => {
      el.classList.add("is-out");
      el.classList.remove("is-on");
      window.setTimeout(() => {
        if (pending !== target) {
          runFlash();
        } else {
          running = false;
          pending = null;
        }
      }, FLASH_OUT);
    }, FLASH_HOLD);
  }, FLASH_IN);
}

export function setBoard(board: Board) {
  // 動きを減らす設定のときは覆いを出さず、即座に切り替える
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyBoard(board);
    announce(board);
    return;
  }
  pending = board;
  if (running) {
    paintFlash(board);
    return;
  }
  running = true;
  runFlash();
}

// 3 色のセグメント型スイッチ（枠 1.5px 銅色・角丸 6px・高さ 40px）。どの variant でも見た目は同じ
function Segments({ board, onPick }: { board: Board; onPick?: () => void }) {
  return (
    <div className="flex items-center h-10 rounded-[6px] border-[1.5px] border-copper px-[3px] gap-[3px]">
      {BOARDS.map((b) => {
        const selected = board === b.id;
        return (
          // ボタン自体は 44px の高さ（枠の上下 2px ずつ外へ）でタップ範囲を確保し、見える部分は中の span
          <button
            key={b.id}
            type="button"
            aria-label={`${b.short} ${b.label}`} /* 読み上げ名は見えている文字（WHT など）で始める */
            aria-pressed={selected}
            onClick={() => {
              setBoard(b.id);
              onPick?.();
            }}
            className="flex items-center h-11 -my-[2px] shrink-0 rounded-[4px] focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
          >
            <span
              className={`flex items-center gap-1.5 h-8 px-2 rounded-[4px] font-mono text-[12px] tracking-[0.08em] transition-colors ${
                selected ? "bg-switch-on text-board" : "text-silk-muted hover:text-silk active:text-silk"
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
  );
}

// 詳細ページの右下（固定表示）。1024px 以上は今までどおりの横並び、スマホ・タブレットでは
// 「BOARD + 今の色の色見本」の小さなボタン（44px）にたたみ、押すと 3 色が上に開く。Esc と外側のタップで閉じる
function FloatingSwitch({ board }: { board: Board }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const current = BOARDS.find((b) => b.id === board) ?? BOARDS[0];
  // 1023px 以下: 下にスクロールしている間は下へ隠す（.is-hidden、globals.css）。選択肢が開いている間は隠さず、ページの一番下では出す
  const hidden = useHideOnScroll({ hold: open, showAtBottom: true });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    // 下・右の余白は iPhone のホームバーやノッチ（safe-area）のぶんだけ広げる
    // 条件付きのクラスは先頭に置く（末尾に `${}` を続けると、直前のクラスが Tailwind に拾われない）
    <div ref={rootRef} className={`${hidden ? "is-hidden " : ""}floating-switch fixed z-50 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))]`}>
      {/* 1024px 以上: 横並び */}
      <div className="hidden lg:flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-board/90 border border-line md:backdrop-blur-md" role="group" aria-label="基板の色">
        <span className="font-mono text-[11px] tracking-[0.14em] text-silk-label">BOARD</span>
        <Segments board={board} />
      </div>
      {/* 1023px 以下: たたんだボタン + 開いたときの 3 色 */}
      <div className="lg:hidden">
        {open && (
          <div
            id={panelId}
            role="group"
            aria-label="基板の色"
            className="absolute right-0 bottom-[calc(100%+8px)] flex items-center pl-3 pr-2 py-1 rounded-full bg-board/90 border border-line md:backdrop-blur-md"
          >
            <Segments board={board} onPick={() => setOpen(false)} />
          </div>
        )}
        <button
          ref={buttonRef}
          type="button"
          aria-label="BOARD 基板の色を選ぶ"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 h-11 pl-3 pr-2 rounded-full bg-board/90 border border-line md:backdrop-blur-md font-mono text-[12px] tracking-[0.14em] text-silk-label active:text-silk focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
        >
          BOARD
          <span
            className="block w-7 h-7 rounded-[4px] border"
            style={{ backgroundColor: current.swatch, borderColor: current.swatchBorder }}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

// variant: "inline" = ヘッダー内（lg 以上で表示） / "menu" = スマホメニュー内 / "floating" = 詳細ページの右下
export default function BoardSwitch({ variant = "inline" }: { variant?: "inline" | "menu" | "floating" }) {
  const board = useSyncExternalStore(subscribe, readBoard, readServerBoard);
  if (variant === "floating") return <FloatingSwitch board={board} />;
  return (
    <div className={variant === "menu" ? "flex items-center gap-2 mt-6" : "hidden lg:flex items-center gap-2"} role="group" aria-label="基板の色">
      <span className="font-mono text-[11px] max-lg:text-[12px] tracking-[0.14em] text-silk-label">BOARD</span>
      <Segments board={board} />
    </div>
  );
}
