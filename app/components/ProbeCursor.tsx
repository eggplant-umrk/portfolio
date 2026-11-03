"use client";

import { useEffect, useRef } from "react";

// ＝＝＝ 測定プローブ型カーソル（PC のみ）＝＝＝
// マウス位置に十字線と小円を重ね、右下にビューポート座標と演出用の電圧値を出す。
// 位置は transform で動かし、描画は requestAnimationFrame にまとめて負荷を抑える。
export default function ProbeCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const xyRef = useRef<HTMLSpanElement>(null);
  const voltRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // ホバーできない端末（スマホ・タブレット）では何もしない
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = rootRef.current;
    const xy = xyRef.current;
    const volt = voltRef.current;
    if (!root || !xy || !volt) return;

    let x = 0;
    let y = 0;
    let raf = 0;
    let visible = false;

    const render = () => {
      raf = 0;
      const ix = Math.round(x);
      const iy = Math.round(y);
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      xy.textContent = `X ${ix} · Y ${iy}`;
      volt.textContent = `CH1 ${(((ix * 7 + iy * 3) % 330) / 100).toFixed(2)} V`;
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        root.style.opacity = "1";
        visible = true;
      }
      if (!raf) raf = requestAnimationFrame(render);
    };

    // ページから出たら隠す
    const onLeave = () => {
      root.style.opacity = "0";
      visible = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="probe" aria-hidden="true">
      <span className="probe-h" />
      <span className="probe-v" />
      <span className="probe-dot" />
      <div className="probe-readout">
        <span ref={xyRef}>X 0 · Y 0</span>
        <span ref={voltRef}>CH1 0.00 V</span>
      </div>
    </div>
  );
}
