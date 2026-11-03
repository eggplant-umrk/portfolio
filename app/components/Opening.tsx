"use client";

import { useState } from "react";

// ＝＝＝ オープニングアニメーション（初回訪問のみ）＝＝＝
// 常に描画しておき、CSS で html[data-intro="play"]（初回訪問）のときだけ表示する。
// Hero の起動演出はこれの終了を待たず同時に進む。スライドし終わったら DOM から消す
export default function Opening() {
  const [done, setDone] = useState(false);
  if (done) return null;
  return (
    <div
      className="opening fixed inset-0 z-[95] flex items-center justify-center bg-board-outer"
      onAnimationEnd={(e) => {
        if (e.animationName === "opening-slide") setDone(true); // スライドし終わったら完了フラグを立てる
      }}
    >
      <p className="opening-text text-silk text-lg md:text-2xl font-normal tracking-[0.2em] font-sans">
        Welcome to my portfolio.
      </p>
    </div>
  );
}
