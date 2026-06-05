"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ＝＝＝ 自然で滑らかなクロスフェードアニメーションのトグルボタン ＝＝＝
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/50 shadow-sm dark:bg-[#1A1A1A]/60 dark:border-gray-800/50 text-[#1A1A1A] dark:text-gray-200 transition-colors overflow-hidden"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative flex items-center justify-center w-full h-full"
      >
        <motion.div
          initial={{ opacity: 1, scale: 1, rotate: 0 }}
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.5 : 1, rotate: isDark ? -90 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
          animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.5, rotate: isDark ? 0 : 90 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

const newsData = [
  { date: "2026/05/30", text: "技育博2026 vol1 に出展・参加" },
  { date: "2026/05/15", text: "Matsuriba vol.14 参加" },
  { date: "2026/04/26", text: "技育祭東海 参加" },
  { date: "2026/04/17", text: "エンジニアとしての個人名刺を作成！" },
  { date: "2026/03/31", text: "SysHack 2026 参加 / CyberAgent賞を受賞" },
  { date: "2026/03/08", text: "Matsurib MAX 2026 参加" },
  { date: "2026/02/11", text: "ニックトレイン 参加" },
];

export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [showAllNews, setShowAllNews] = useState(false);
  // 👇 アニメーションが完全に終わったかを判定するステートを追加
  const [isOpeningDone, setIsOpeningDone] = useState(false);

  useEffect(() => {
    const hasHash = window.location.hash !== "";
    const hasVisited = sessionStorage.getItem("portfolio_visited");

    if (hasVisited || hasHash) {
      setIsFirstVisit(false);
      setIsOpeningDone(true); // スキップ時は「終わった」ことにする
    } else {
      sessionStorage.setItem("portfolio_visited", "true");
      setIsFirstVisit(true);
    }
  }, []);

  if (isFirstVisit === null) return null;

  const delayBase = isFirstVisit ? 2.4 : 0.2;
  const displayNews = showAllNews ? newsData : newsData.slice(0, 5);

  return (
    <div className="flex flex-col items-center w-full overflow-hidden relative transition-colors duration-500 bg-white dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#FAFAFA]">
      
      {/* ＝＝＝ ダークモードトグルボタン ＝＝＝ */}
      <ThemeToggle />

      {/* ＝＝＝ オープニングアニメーション ＝＝＝ */}
      {/* 👇 !isOpeningDone の時だけ画面に存在させる（終わったらDOMから消す） */}
      {isFirstVisit && !isOpeningDone && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: "-100vh" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 2.2 }}
          onAnimationComplete={() => setIsOpeningDone(true)} // 👇 スライドし終わったら完了フラグを立てる
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <p className="text-white text-lg md:text-2xl font-medium tracking-[0.2em] font-sans">
                Welcome to my portfolio.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* ＝＝＝ ヒーローセクション ＝＝＝ */}
      <main className="relative min-h-screen flex flex-col w-full overflow-hidden pt-12 pb-8">
        
        {/* 演出1：背景の光のぼかし */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gray-200/60 dark:bg-white/5 blur-[120px] transition-colors duration-500" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-gray-200/60 dark:bg-white/5 blur-[120px] transition-colors duration-500" />
        </div>

        {/* 演出2：背景の巨大透かし文字 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: delayBase }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0"
        >
          <h1 className="text-[15vw] md:text-[12vw] font-black text-gray-100/55 dark:text-white/5 select-none tracking-tighter transition-colors duration-500">
            PORTFOLIO
          </h1>
        </motion.div>

        {/* メインテキスト群 */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-24 flex-grow flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: delayBase }}
          >
            <p className="text-sm md:text-base font-semibold tracking-wider text-gray-400 dark:text-gray-500 mb-2 transition-colors duration-500">
              PORTFOLIO 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: delayBase + 0.2 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 text-[#1A1A1A] dark:text-white transition-colors duration-500">
              Riku Umezawa
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: delayBase + 0.4 }}
          >
            <h2 className="text-xl md:text-2xl font-medium text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-500">
              Front-End Developer
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: delayBase + 0.6 }}
          >
            <p className="text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed transition-colors duration-500">
              <span className="font-bold text-[#1A1A1A] dark:text-white block mb-2 transition-colors duration-500">ラーメンと旅行大好きエンジニア</span>
              電気電子工学の知見を活かしつつ、Webフロントエンドとモバイルアプリ開発を探求しています。
              SysHack2026にてCyberAgent賞を受賞した『muscloop』など、ユーザーの心を動かす滑らかで美しいUI/UXの実現を目指しています。
            </p>
          </motion.div>
        </div>

        {/* 演出3：スクロールインジケーター */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delayBase + 1.2 }}
          className="flex flex-col items-center pointer-events-none z-10 w-full mt-12 shrink-0"
        >
          <span
            className="text-[10px] font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-500"
            style={{ writingMode: "vertical-rl" }}
          >
            SCROLL
          </span>
          <div className="w-[1px] h-12 md:h-16 bg-gray-200 dark:bg-gray-800 overflow-hidden relative transition-colors duration-500">
            <motion.div
              className="w-full h-1/2 bg-[#1A1A1A] dark:bg-white absolute top-0 transition-colors duration-500"
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </main>

      {/* ＝＝＝ ニュース＆アクティビティ セクション ＝＝＝ */}
      <section id="news" className="w-full px-8 md:px-24 py-24 bg-[#FAFAFA] dark:bg-[#111111] border-t border-gray-100 dark:border-gray-900 transition-colors duration-500">
        <div className="max-w-3xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl md:text-4xl font-black mb-12 tracking-tight text-[#1A1A1A] dark:text-white transition-colors duration-500"
          >
            Activity & News
          </motion.h3>

          <div className="flex flex-col border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
            {displayNews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center py-6 border-b border-gray-200 dark:border-gray-800 group hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors duration-300 px-4 -mx-4 rounded-lg"
              >
                <span className="text-gray-400 dark:text-gray-500 font-medium text-sm sm:w-32 mb-2 sm:mb-0 shrink-0 tracking-wider transition-colors duration-500">
                  {item.date}
                </span>
                <span className="text-[#1A1A1A] dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {newsData.length > 5 && (
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={() => setShowAllNews(!showAllNews)}
              className="mt-8 text-sm font-bold text-gray-500 hover:text-[#1A1A1A] dark:hover:text-white transition-colors flex items-center gap-2"
            >
              {showAllNews ? "↑ 閉じる" : "↓ もっと見る"}
            </motion.button>
          )}
        </div>
      </section>

      {/* ＝＝＝ プロジェクトセクション ＝＝＝ */}
      <section id="projects" className="w-full px-8 md:px-24 py-32 bg-white dark:bg-[#1A1A1A] scroll-mt-24 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-black mb-16 tracking-tight text-[#1A1A1A] dark:text-white transition-colors duration-500"
          >
            Selected Works
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 bg-[#FAFAFA] dark:bg-[#111111] flex justify-center items-center p-8 aspect-video relative transition-colors duration-500">
              <Image
                src="/muscloop.png"
                alt="muscloop Pamphlet"
                fill
                className="object-contain p-4"
              />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider mb-2 transition-colors duration-500">
                SysHack2026 CyberAgent Award
              </span>
              <h4 className="text-4xl font-black mb-4 text-[#1A1A1A] dark:text-white transition-colors duration-500">muscloop</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 transition-colors duration-500">
                モダンな技術スタックを用いた滑らかなユーザー体験にこだわっています。
                今後はApple Developer Programに登録し、HealthKitと連携した本格的なヘルスケアデータ取得を実装予定です。
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {["React Native (Expo)", "FastAPI", "Firebase", "Docker", "AWS ECS", "HealthKit (実装予定)"].map((tech) => (
                  <span key={tech} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm px-4 py-1.5 rounded-full font-medium transition-colors duration-500">
                    {tech}
                  </span>
                ))}
              </div>

              <Link 
                href="/muscloop" 
                className="text-[#1A1A1A] dark:text-white font-bold border-b-2 border-[#1A1A1A] dark:border-white pb-1 hover:text-gray-500 dark:hover:text-gray-400 hover:border-gray-500 dark:hover:border-gray-400 transition-colors"
              >
                Read Case Study →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ＝＝＝ About（自己紹介）セクション ＝＝＝ */}
      <section id="about" className="w-full px-8 md:px-24 py-32 bg-[#FAFAFA] dark:bg-[#111111] transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2"
          >
            <h3 className="text-3xl md:text-5xl font-black mb-8 tracking-tight text-[#1A1A1A] dark:text-white transition-colors duration-500">
              About Me
            </h3>
            <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed font-noto transition-colors duration-500">
              <p>
                愛知工業大学で電気電子工学を専攻している29卒です。大学ではC言語や物理法則などハードウェア寄りの領域を学んでいますが、高校は情報デザイン学科を卒業しておりユーザーの目に直接触れ、体験を根本から変えることができるWebフロントエンドやUI/UXデザインの世界に強く惹かれました。
              </p>
              <p>
                現在はReact NativeやNext.jsを中心に、Figmaを用いたデザインの基礎設計から、Framer Motionを使った心地よいアニメーションの実装まで、技術とデザインの境界線を埋める開発を探求しています。
              </p>
              <p>
                チーム「CPY」としてSysHack2026や技育博に出場し、プロダクトを形にする楽しさを知りました。今後は東海・関西・九州など各地の技術イベントにも積極的に足を運び、エンジニアとしての視野と技術力をさらに広げていきたいと考えています。
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col gap-8"
          >
            <div>
              <h4 className="text-lg font-bold text-[#1A1A1A] dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2 transition-colors duration-500">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-3">
                {["Figma", "React Native (Expo)", "Next.js", "TypeScript", "React", "Firebase", "GitHub", "C", "Python"].map((skill) => (
                  <span key={skill} className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm px-4 py-2 rounded-lg font-medium shadow-sm transition-colors duration-500">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* ＝＝＝ フッター（コンタクト情報） ＝＝＝ */}
      <footer className="w-full pt-24 pb-12 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-gray-900 flex flex-col items-center transition-colors duration-500">
        <div className="flex flex-col gap-6 mb-16 items-start">
          
          <a href="https://x.com/eggplant_umrk?s=11&t=NqyCGbLtTWXP3ARiNEz16A" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#1A1A1A] dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant__umrk</span>
          </a>

          <a href="https://github.com/eggplant-umrk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#1A1A1A] dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant-umrk</span>
          </a>

          <a href="mailto:eggplant2006@au.com" className="flex items-center gap-4 text-[#1A1A1A] dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant2006@au.com</span>
          </a>
          
        </div>
        
        <p className="text-gray-400 dark:text-gray-600 text-sm tracking-wider transition-colors duration-500">© 2026 Riku Umezawa. All rights reserved.</p>
      </footer>
    </div>
  );
}