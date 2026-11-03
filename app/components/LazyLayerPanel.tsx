"use client";

import dynamic from "next/dynamic";
import { useIdlePointerFine } from "../lib/use-idle-pointer-fine";

// レイヤー表示の切り替えを、マウスのある端末でだけ・手が空いてから読み込む（スマホでは読み込まない）
const LayerPanel = dynamic(() => import("./LayerPanel"), { ssr: false });

export default function LazyLayerPanel() {
  const ready = useIdlePointerFine();
  return ready ? <LayerPanel /> : null;
}
