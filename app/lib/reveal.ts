// ＝＝＝ 表示域に入ったら .is-in を付ける（.reveal 要素の共通処理）＝＝＝
// 要素ごとに IntersectionObserver を作らず、rootMargin（data-reveal-margin）ごとに 1 つだけ作って共有する。
// 一度表示された要素は監視を外す。IntersectionObserver が無い環境では即座に表示する。
const observed = new WeakSet<Element>();
const observers = new Map<string, IntersectionObserver>();

function observerFor(margin: string) {
  let io = observers.get(margin);
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io!.unobserve(e.target);
          }
        }
      },
      { rootMargin: `${margin} 0px` },
    );
    observers.set(margin, io);
  }
  return io;
}

// root 以下の .reveal をすべて監視対象にする（追加された要素だけ新たに監視する）
export function observeReveals(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  els.forEach((el) => {
    if (observed.has(el)) return;
    observed.add(el);
    observerFor(el.dataset.revealMargin ?? "-50px").observe(el);
  });
}
