"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

// ＝＝＝ 基板 CAD（KiCad）風のレイヤー表示切り替え（トップページ、1024px 以上のみ）＝＝＝
// 表示中のレイヤー名を <html data-layers="fcu silks edge"> に空白区切りで持ち、CSS（globals.css の
// html:not([data-layers~="…"]) .layer-… ）で表示・非表示を切り替える。選択は localStorage "portfolio_layers" に保存し、
// 描画前の適用は app/layout.tsx の <head> のインラインスクリプトが行う（既定は fcu / silks / edge が表示、bcu は非表示）。
// 部品の本体（IC・抵抗・コンデンサ・LED）と本文・ナビ・ボタンはどのレイヤーにも属さず、常に表示する。
export const LAYERS = [
  { id: "fcu", name: "F.Cu", color: "#C83434", label: "表の銅（配線・パッド・ビア）" },
  { id: "bcu", name: "B.Cu", color: "#4D7FC4", label: "裏の銅（ビアをつなぐ配線）" },
  { id: "silks", name: "F.SilkS", color: "#F2EDA1", label: "シルク（部品番号・ネット名・枠）" },
  { id: "edge", name: "Edge.Cuts", color: "#D0D2CD", label: "基板の外形" },
] as const;

type LayerId = (typeof LAYERS)[number]["id"];

const STORAGE_KEY = "portfolio_layers";
const DEFAULT_LAYERS = "fcu silks edge";
const EVENT = "layerschange";
const VALID = new Set<string>(LAYERS.map((l) => l.id));

// render 中には呼ばない（useSyncExternalStore の getSnapshot としてだけ使う）
function readLayers(): string {
  return document.documentElement.getAttribute("data-layers") ?? DEFAULT_LAYERS;
}

// SSR とハイドレーション時はつねに既定値（<html data-layers="fcu silks edge"> と一致させる）
function readServerLayers(): string {
  return DEFAULT_LAYERS;
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function setLayers(next: Set<string>) {
  // 順番を固定して保存する（fcu bcu silks edge の順）
  const value = LAYERS.map((l) => l.id).filter((id) => next.has(id)).join(" ");
  document.documentElement.setAttribute("data-layers", value);
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage が使えない環境では保存しない（表示の切り替えだけ行う）
  }
  window.dispatchEvent(new Event(EVENT));
}

export default function LayerPanel() {
  const layers = useSyncExternalStore(subscribe, readLayers, readServerLayers);
  const on = new Set(layers.split(" ").filter((t) => VALID.has(t)));
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Esc キーとパネルの外のクリックで閉じる
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

  const toggle = (id: LayerId, checked: boolean) => {
    const next = new Set(on);
    if (checked) next.add(id);
    else next.delete(id);
    setLayers(next);
  };

  return (
    // 左下に固定。左の余白（96px）に収まる幅にして、Hero 下部のラベルや本文と横に重ならないようにする
    <div ref={rootRef} className="layer-panel hidden lg:block fixed left-6 bottom-6 z-40">
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label="レイヤーの表示"
          className="absolute left-0 bottom-[calc(100%+8px)] w-[232px] p-3 rounded-[6px] border-[1.5px] border-copper bg-board shadow-md"
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-silk-label mb-2">LAYERS · VISIBILITY</p>
          {LAYERS.map((l) => (
            <label key={l.id} className="flex items-center gap-3 h-9 cursor-pointer font-mono text-[12px] text-silk">
              <input
                type="checkbox"
                checked={on.has(l.id)}
                onChange={(e) => toggle(l.id, e.target.checked)}
                aria-label={`${l.name}（${l.label}）`}
                className="w-4 h-4 accent-copper focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
              />
              <span className="block w-4 h-4 rounded-[3px] border border-line" style={{ backgroundColor: l.color }} aria-hidden="true" />
              <span>{l.name}</span>
            </label>
          ))}
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center h-11 px-2.5 rounded-[6px] border-[1.5px] border-copper bg-board/90 font-mono text-[11px] tracking-[0.1em] transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper ${
          open ? "text-silk" : "text-silk-muted hover:text-silk"
        }`}
      >
        LAYERS
      </button>
    </div>
  );
}
