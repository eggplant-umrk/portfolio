"use client";

import { useEffect } from "react";
import { observeReveals } from "../lib/reveal";

// ＝＝＝ トップページの「動く部分」をまとめた小さなクライアント処理（描画はしない）＝＝＝
// 1) 初回訪問フラグの書き込み  2) .reveal の表示域監視  3) 透かし文字のパララックス
// 4) 画面外・タブ非表示のときの常時アニメーションの停止
export default function PageEffects() {
  useEffect(() => {
    // 1) 初回訪問の判定は layout.tsx の <head> のインラインスクリプトが描画前に行い、初回なら <html data-intro="play"> が付く。
    //    ここでは訪問済みフラグの書き込みだけをマウント時に行う
    try {
      if (document.documentElement.dataset.intro === "play") {
        sessionStorage.setItem("portfolio_visited", "true");
      }
    } catch {
      // sessionStorage が使えない環境では何もしない
    }

    // 2) 表示域に入ったら現れる要素
    observeReveals(document);

    // 3) 透かし文字のパララックス（scroll を rAF でまとめて translateY だけ動かす）
    const watermark = document.querySelector<HTMLElement>("[data-watermark]");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (watermark) watermark.style.transform = `translateY(${Math.min(window.scrollY, 1000) * 0.25}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    // 4) 常時動くアニメーション（data-pause-offscreen を付けた箱の中）は、画面外とタブ非表示のとき止める
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-pause-offscreen]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle("is-paused", !e.isIntersecting);
    });
    targets.forEach((t) => io.observe(t));
    const onVisibility = () => document.documentElement.classList.toggle("is-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return null;
}
