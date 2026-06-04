"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // スマホではカスタムカーソルを出さない設定
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      setIsDesktop(true);
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      {/* メインの小さなドット（遅延なしでピタッとついてくる） */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#1A1A1A] rounded-full pointer-events-none z-[9999]"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: "tween", ease: "backOut", duration: 0 }}
      />
      {/* 追従する大きな輪郭（少し遅れてフワッとついてくる） */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-gray-400 rounded-full pointer-events-none z-[9998]"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
      />
    </>
  );
}