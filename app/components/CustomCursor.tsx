"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // スマホではカスタムカーソルを出さない設定
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      setIsDesktop(true);
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // リンクやボタンの上に乗ったら isHovering を立てる（イベント委譲）
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("a, button"));
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isDesktop) return null;

  // 白いカーソル + mix-blend-difference で、白背景では黒く・黒背景では白く自動反転する
  return (
    <>
      {/* メインの小さなドット（遅延なしでピタッとついてくる） */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0 }}
      />
      {/* 追従する大きな輪郭（少し遅れてフワッとついてくる・ホバーで拡大） */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
      />
    </>
  );
}
