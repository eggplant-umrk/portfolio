"use client";

import { useEffect, useState } from "react";

// マウスのある端末（hover: hover かつ pointer: fine）でだけ、最初の表示が終わってブラウザの手が空いたときに true になる。
// プローブや LAYERS など、マウス前提の UI をあとから読み込むための判定（スマホ・タブレットでは false のまま）
export function useIdlePointerFine() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const go = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(go, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(go, 1500);
    return () => window.clearTimeout(timer);
  }, []);
  return ready;
}
