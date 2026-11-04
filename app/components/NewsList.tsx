"use client";

import { useEffect, useRef, useState } from "react";
import { observeReveals } from "../lib/reveal";

// ＝＝＝ Activity & News の一覧（クライアント側は表示件数の状態だけ）＝＝＝
// 初期 5 件、「もっと見る」で 5 件ずつ追加、全件表示後は「閉じる」で 5 件に戻す
const NEWS_STEP = 5;

export default function NewsList({ items }: { items: { date: string; text: string }[] }) {
  const [visibleNews, setVisibleNews] = useState(NEWS_STEP);
  const listRef = useRef<HTMLDivElement>(null);
  const allNewsShown = visibleNews >= items.length;

  // 追加された行も表示域に入ったら現れるよう、件数が変わるたびに監視対象へ加える（既存の行は二重登録されない）
  useEffect(() => {
    if (listRef.current) observeReveals(listRef.current);
  }, [visibleNews]);

  const handleNewsButton = () => {
    if (!allNewsShown) {
      setVisibleNews((n) => Math.min(n + NEWS_STEP, items.length));
      return;
    }
    setVisibleNews(NEWS_STEP);
    // 閉じたとき、News の見出しが画面外（ヘッダーの下に隠れている場合を含む）なら見出しまで戻す
    const section = document.getElementById("news");
    const heading = section?.querySelector("h2");
    if (section && heading) {
      const rect = heading.getBoundingClientRect();
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      if (rect.top < headerH || rect.bottom > window.innerHeight) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      {/* 「日付 | 本文」の2列グリッド（スマホは縦積み） */}
      <div id="news-list" ref={listRef} className="max-w-3xl flex flex-col border-t-[1.5px] border-line-strong">
        {items.slice(0, visibleNews).map((item, index) => {
          const delay = (index % NEWS_STEP) * 0.05;
          return (
            <div
              key={index}
              className="reveal reveal-sm group grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-1 sm:gap-4 items-baseline py-5 border-b border-dotted border-line-dashed cursor-default"
              data-reveal-margin="-50px"
              style={delay ? { transitionDelay: `${delay}s` } : undefined}
            >
              <span className="font-mono text-[14px] text-silk-muted group-hover:text-led-text transition-colors duration-[250ms]">
                {item.date}
              </span>
              <span className="text-[17px] font-normal text-silk group-hover:translate-x-[6px] transition-transform duration-[250ms]">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {items.length > NEWS_STEP && (
        <div className="reveal reveal-fade mt-8" data-reveal-margin="0px">
          <button
            type="button"
            onClick={handleNewsButton}
            aria-expanded={allNewsShown}
            aria-controls="news-list"
            className="inline-flex items-center justify-center min-h-[44px] px-6 border-[1.5px] border-copper bg-transparent text-copper-light font-mono text-[13px] tracking-[0.1em] rounded-[4px] hover:bg-copper hover:text-board active:bg-copper active:text-board transition-colors duration-300"
          >
            {allNewsShown ? "↑ 閉じる" : "↓ もっと見る"}
          </button>
        </div>
      )}
    </>
  );
}
