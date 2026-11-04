"use client";

import { useEffect, useRef } from "react";

// ＝＝＝ 測定プローブ型カーソル（PC のみ）＝＝＝
// マウス位置に十字線と小円を重ね、右下にビューポート座標と「いま乗っている配線（ネット）」の測定値を出す。
// ネットの判定は、回路の装飾に重ねた当たり判定用の要素（data-net / data-label）を e.target から辿って行う。
// 位置は transform で動かし、描画は requestAnimationFrame にまとめて負荷を抑える。

// ネットごとの表示値（Hero の回路と左のスパインの接続に合わせる）
//   +3V3: 電源 / GND / RST・INT: R1・R2 のプルアップで High（U10 の 4 番・9 番） / LED1・LED2: 電流制限抵抗と LED の間（LED の順方向電圧）
//   OUT1・OUT2: IC の 12 番・10 番ピンと抵抗の間（出力 High）/ NC: 未接続ピン
const NET_VALUE: Record<string, string> = {
  "+3V3": "3.30 V",
  GND: "0.00 V",
  RST: "3.30 V",
  INT: "3.30 V",
  LED1: "2.00 V",
  LED2: "2.00 V",
  OUT1: "3.30 V",
  OUT2: "3.30 V",
  NC: "-- V",
};

// I2C の波形（幅 120px を 1 周期として 2 周期分を描き、左へ流す）。High = y 4、Low = y 20
//   0〜20: 待機（両方 High）→ 20: SDA が下がる（スタートコンディション、SCL は High のまま）
//   28〜106: クロック 7 発。SDA は SCL が Low の間だけ変わる（1,0,1,1,0,0,0）
//   106: SCL が High に戻り、110: SDA が上がる（ストップコンディション）→ 待機
const sclPeriod = (o: number) =>
  `M${o} 4 H${o + 28} V20 H${o + 34} V4 H${o + 40} V20 H${o + 46} V4 H${o + 52} V20 H${o + 58} V4 H${o + 64} V20 ` +
  `H${o + 70} V4 H${o + 76} V20 H${o + 82} V4 H${o + 88} V20 H${o + 94} V4 H${o + 100} V20 H${o + 106} V4 H${o + 120}`;
const sdaPeriod = (o: number) =>
  `M${o} 4 H${o + 20} V20 H${o + 30} V4 H${o + 42} V20 H${o + 54} V4 H${o + 78} V20 H${o + 110} V4 H${o + 120}`;
const WAVE: Record<string, string> = {
  SCL: `${sclPeriod(0)} ${sclPeriod(120)}`,
  SDA: `${sdaPeriod(0)} ${sdaPeriod(120)}`,
};

export default function ProbeCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const xyRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const waveRef = useRef<HTMLSpanElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // ホバーできない端末（スマホ・タブレット）では何もしない
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = rootRef.current;
    const xy = xyRef.current;
    const name = nameRef.current;
    const value = valueRef.current;
    const wave = waveRef.current;
    const wavePath = wavePathRef.current;
    if (!root || !xy || !name || !value || !wave || !wavePath) return;

    // プローブが動いている間だけ純正のカーソルを消す（globals.css の html.probe-on）。
    // 動きを減らす設定の人には消さない。ここに来る前に読み込みが失敗したときは、このクラスが付かないので消えない
    const hideCursor = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hideCursor) document.documentElement.classList.add("probe-on");

    let x = 0;
    let y = 0;
    let net = "";
    let label = "";
    let shownNet: string | null = null;
    let shownLabel: string | null = null;
    let raf = 0;
    let visible = false;

    const render = () => {
      raf = 0;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      xy.textContent = `X ${Math.round(x)} · Y ${Math.round(y)}`;
      // ネットやラベルが変わったときだけ表示枠の文字を書き換える
      if (net !== shownNet || label !== shownLabel) {
        shownNet = net;
        shownLabel = label;
        name.textContent = label || net || "CH1";
        const d = WAVE[net];
        if (d) {
          // SDA / SCL: 電圧の代わりに波形
          wavePath.setAttribute("d", d);
          wave.hidden = false;
          value.hidden = true;
        } else {
          wave.hidden = true;
          value.hidden = false;
          value.textContent = net ? (NET_VALUE[net] ?? "-- V") : "-- V";
        }
      }
    };

    // カーソルの下にある要素から、乗っているネットを読む
    const readNet = (target: Element | null) => {
      const hit = target && typeof target.closest === "function" ? target.closest<Element>("[data-net]") : null;
      net = hit?.getAttribute("data-net") ?? "";
      label = hit?.getAttribute("data-label") ?? "";
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      readNet(e.target as Element | null);
      if (!visible) {
        root.style.opacity = "1";
        visible = true;
      }
      if (!raf) raf = requestAnimationFrame(render);
    };

    // マウスを動かさずにスクロールしたときも、同じ画面位置の下に来たネットで表示を更新する（rAF で 1 フレームに 1 回）
    let scrollRaf = 0;
    const onScroll = () => {
      if (!visible || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        readNet(document.elementFromPoint(x, y));
        if (!raf) raf = requestAnimationFrame(render);
      });
    };

    // ページから出たら隠す
    const onLeave = () => {
      root.style.opacity = "0";
      visible = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      document.documentElement.classList.remove("probe-on");
    };
  }, []);

  return (
    <div ref={rootRef} className="probe" aria-hidden="true">
      <span className="probe-h" />
      <span className="probe-v" />
      <span className="probe-dot" />
      <div className="probe-readout">
        <span ref={xyRef}>X 0 · Y 0</span>
        <span ref={nameRef} className="probe-name">CH1</span>
        <span ref={valueRef}>-- V</span>
        {/* I2C の波形（SDA / SCL に乗ったときだけ表示） */}
        <span ref={waveRef} className="probe-wave" hidden>
          <svg width="120" height="24" viewBox="0 0 120 24">
            <path ref={wavePathRef} d="" />
          </svg>
        </span>
      </div>
    </div>
  );
}
