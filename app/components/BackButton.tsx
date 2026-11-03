"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// 詳細ページの「← Back to Home」（ブラウザの履歴を 1 つ戻る）
export default function BackButton({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}
