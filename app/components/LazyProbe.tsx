"use client";

import dynamic from "next/dynamic";
import { useIdlePointerFine } from "../lib/use-idle-pointer-fine";

// 測定プローブ型カーソルを、マウスのある端末でだけ・手が空いてから読み込む（スマホでは読み込まない）
const ProbeCursor = dynamic(() => import("./ProbeCursor"), { ssr: false });

export default function LazyProbe() {
  const ready = useIdlePointerFine();
  return ready ? <ProbeCursor /> : null;
}
