import { useEffect, useRef, useState } from "react";

// ＝＝＝ 1023px 以下で、下にスクロールしている間だけ固定要素（ヘッダー・右下のボタン）を隠すためのフック ＝＝＝
// 返り値が true のあいだ隠す。
//  - 下にスクロール → true、上にスクロール → すぐ false
//  - ページの一番上（スクロール位置がヘッダーの高さ未満）では常に false
//  - showAtBottom のときは、ページの一番下まで来たら false
//  - 8px 未満の動きでは向きを変えない
//  - hold（メニューや選択肢が開いている）の間は false。hold が解けた直後も、次のスクロールまでは false
//  - 1024px 以上では常に false
// scroll は passive で受け、処理は requestAnimationFrame で 1 フレームに 1 回にまとめる。レイアウトは読むだけで変えない
const MOBILE_QUERY = "(max-width: 1023px)";
const MIN_DELTA = 8;

export function useHideOnScroll({ hold = false, showAtBottom = false }: { hold?: boolean; showAtBottom?: boolean } = {}) {
  const [hidden, setHidden] = useState(false);
  const dirRef = useRef<0 | 1 | -1>(0); // 1 = 下向き、-1 = 上向き、0 = まだ向きが決まっていない

  // メニューや選択肢を閉じた直後は、次のスクロールまで出したままにする（prop の変化に合わせて描画中に state を直す形）
  const [prevHold, setPrevHold] = useState(hold);
  if (prevHold !== hold) {
    setPrevHold(hold);
    if (!hold) setHidden(false);
  }

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    let lastY = window.scrollY;
    let headerH = 0;
    let raf = 0;
    const measure = () => {
      headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
    };
    const update = () => {
      raf = 0;
      if (!mq.matches) {
        dirRef.current = 0;
        setHidden(false);
        return;
      }
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) >= MIN_DELTA) {
        dirRef.current = delta > 0 ? 1 : -1;
        lastY = y;
      }
      const atTop = y < headerH;
      const atBottom = showAtBottom && y + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setHidden(!atTop && !atBottom && dirRef.current === 1);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      schedule();
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    mq.addEventListener("change", onResize);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [showAtBottom]);

  // 閉じた直後は向きも忘れ、8px 未満の小さな動きで再び隠れないようにする
  useEffect(() => {
    if (!hold) dirRef.current = 0;
  }, [hold]);

  return hidden && !hold;
}
