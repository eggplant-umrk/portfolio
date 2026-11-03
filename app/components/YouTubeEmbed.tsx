"use client";

import { useState } from "react";

// ＝＝＝ YouTube の埋め込み（軽量版）＝＝＝
// 最初はサムネイル（i.ytimg.com。CSP の img-src で許可済み）と再生ボタンだけを出し、押されたら
// youtube-nocookie の iframe に切り替えて自動再生する。親の枠（aspect-video）を absolute で埋めるので、切り替えで大きさは変わらない
export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  // 高解像度のサムネイルが無い動画は 120×90 の代替画像が返るので、そのときは標準解像度に切り替える
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      aria-label="動画を再生"
      onClick={() => setPlaying(true)}
      className="yt-facade group absolute inset-0 w-full h-full focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-copper"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- 外部ドメインのサムネイルをそのまま出す（最適化は不要） */}
      <img
        src={thumb}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth <= 120) setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        }}
      />
      <span className="yt-play" aria-hidden="true">
        <svg viewBox="0 0 68 48" width="68" height="48">
          <path d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.4.3 34 .3 34 .3S12.6.3 7.4 1.7c-2.9.8-5.1 3.1-5.9 6C.1 13 .1 24 .1 24s0 11 1.4 16.3c.8 2.9 3 5.2 5.9 6 5.2 1.4 26.6 1.4 26.6 1.4s21.4 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="currentColor" />
          <path d="M27 34.5 44.5 24 27 13.5z" fill="#fff" />
        </svg>
      </span>
    </button>
  );
}
