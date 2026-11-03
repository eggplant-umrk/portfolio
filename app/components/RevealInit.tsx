"use client";

import { useEffect } from "react";
import { observeReveals } from "../lib/reveal";

// 詳細ページ用: .reveal の表示域監視を始めるだけのクライアント処理（描画はしない）
export default function RevealInit() {
  useEffect(() => {
    observeReveals(document);
  }, []);
  return null;
}
