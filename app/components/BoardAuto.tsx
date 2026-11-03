"use client";

import { useEffect } from "react";
import { followSystemBoard } from "./BoardSwitch";

// ＝＝＝ 基板の色を OS のダークモード設定に追従させる（保存値がない人だけ）＝＝＝
// 初期値は app/layout.tsx の <head> のインラインスクリプトが描画前に決める（dark なら green、それ以外は white）。
// ここでは表示中に prefers-color-scheme が変わったときだけ追従する（覆い・トランジション・読み上げなし、保存もしない）。
// 全ページ共通（404 を含む）で動くよう layout.tsx に置く
export default function BoardAuto() {
  useEffect(() => followSystemBoard(), []);
  return null;
}
