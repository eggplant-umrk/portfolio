"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MuscloopDetail() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col">
      {/* ＝＝＝ ヘッダー（上部の戻るボタン） ＝＝＝ */}
      <nav className="w-full px-8 md:px-24 py-8 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors bg-transparent border-none p-0"
        >
          ← Back to Home
        </button>
      </nav>

      {/* ＝＝＝ タイトル＆メインビジュアル ＝＝＝ */}
      <header className="w-full px-8 md:px-24 max-w-7xl mx-auto mt-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-sm font-bold text-blue-600 tracking-wider mb-4 block">
            SysHack2026 CyberAgent Award / 技育博 出展
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
            muscloop
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-12">
            10〜20代の若年層をターゲットにした、モチベーションを維持するための新感覚フィットネスサポートアプリ。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-white flex justify-center items-center aspect-video relative p-8"
        >
          <Image
            src="/muscloop.png"
            alt="muscloop Pamphlet"
            fill
            className="object-contain p-4"
          />
        </motion.div>
      </header>

      {/* ＝＝＝ プロジェクト詳細 ＝＝＝ */}
      <article className="w-full px-8 md:px-24 max-w-4xl mx-auto space-y-24 flex-grow">
        
        {/* 1. チーム開発と役割 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-[#1A1A1A] pb-4 mb-8">
            Team "CPY" & My Role
          </h2>
          <div className="prose prose-lg text-gray-600 font-noto leading-relaxed space-y-6">
            <p>
              5人のエンジニアチーム「CPY」にフロントエンドエンジニアとして参加し、ハッカソンという限られた期間の中でアジャイルに開発を進行しました。私はモバイルアプリ（Expo/React Native）側のUI/UXデザインから実装までを一貫して主導しました。
            </p>
            <p>
              開発における大きなこだわりは「AIとの向き合い方」です。生成AIにUIをすべて丸投げするのではない、まずは自分自身でFigmaを使い、10〜20代のターゲット層に響くレイアウトや余白、タイポグラフィ、コンポーネント構造を徹底的に画面設計しました。
            </p>
            <p>
              その上で、完成したFigmaの設計図を正確かつ迅速にReact Nativeのコードへと落とし込む（翻訳する）プロセスにおいてのみ、生成AIを強力なアクセラレーターとして駆使しました。これにより、ハッカソン特有の短い開発期間の中でも、妥協のない高いデザインクオリティと圧倒的な実装スピードを両立させることができました。
            </p>
            <p>
              また、技術的な実装にとどまらず、GitHubを用いた厳格なブランチ管理や徹底したコードレビュー、バックエンド（FastAPI）側メンバーとの緻密なAPI連携など、横断的なコミュニケーションを主導し、強固な開発体制を支えました。
            </p>
          </div>
        </motion.section>

        {/* 2. システム構成 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-[#1A1A1A] pb-4 mb-8">
            Architecture & Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Front-end</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>React Native (Expo)</li>
                <li>TypeScript</li>
                <li>Firebase (Authentication)</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Back-end & Infra</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>FastAPI (Python)</li>
                <li>Docker</li>
                <li>AWS ECS</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-600 font-noto leading-relaxed">
            フロントエンドはExpoで構築し、Firebaseで認証基盤を整備。バックエンドはFastAPIを採用し、Dockerコンテナ化してAWS ECS上にデプロイするという、実務を意識した構成に挑戦しました。
          </p>
        </motion.section>

        {/* 3. 今後の展望 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-[#1A1A1A] pb-4 mb-8">
            Next Steps
          </h2>
          <p className="text-gray-600 font-noto leading-relaxed">
            技育博で企業の皆様からいただいたフィードバックをもとに、現在のプロトタイプの改善を進めています。今後はApple Developer Programへの登録を経てHealthKitとの連携を実現し、歩数や活動量などのヘルスケアデータを取得・可視化できる機能を実装予定です。これにより、ユーザーの日々の行動データをアプリ体験へ自然に組み込み、健康習慣の定着を促進するプラットフォームへと発展させていきます。
          </p>
        </motion.section>

        {/* 4. 振り返り */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-[#1A1A1A] pb-4 mb-8">
            Reflections - SysHack & 技育博を終えて
          </h2>
          <p className="text-gray-600 font-noto leading-relaxed">
            初めてのプロダクト開発だったこともあり、企画や設計の段階での判断が後の開発に大きく影響することを実感しました。構想段階での課題や改善点も多く見つかり、プロダクト開発の難しさと奥深さを学ぶ貴重な経験となりました。また、会場ではレベルの高い参加者の方々や魅力的なプロダクトに数多く触れることができ、大きな刺激とモチベーションを得ることができました。現在はAIを活用しながら開発を進めていますが、技術的な理解をより深められるよう継続的に学習を重ね、自身の力で実装できる領域を広げていきたいと考えています。今後はインターンシップなどにも積極的に参加し、実践的な経験を積みながらエンジニアとして成長していきたいです。
          </p>
        </motion.section>

        {/* ＝＝＝ 下部の戻るリンク（上部と同じスタイルに修正） ＝＝＝ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="pt-16 pb-8 border-t border-gray-200 flex justify-center"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#1A1A1A] transition-colors bg-transparent border-none p-0"
          >
            ← Back to Home
          </button>
        </motion.div>

      </article>

      {/* ＝＝＝ フッター（コンタクト情報） ＝＝＝ */}
      <footer className="w-full pt-24 pb-12 bg-white border-t border-gray-100 flex flex-col items-center mt-16">
        <div className="flex flex-col gap-6 mb-16 items-start">
          
          <a href="https://x.com/eggplant__umrk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#1A1A1A] hover:text-gray-500 transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant__umrk</span>
          </a>

          <a href="https://github.com/eggplant-umrk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#1A1A1A] hover:text-gray-500 transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant-umrk</span>
          </a>

          <a href="mailto:eggplant2006@au.com" className="flex items-center gap-4 text-[#1A1A1A] hover:text-gray-500 transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant2006@au.com</span>
          </a>
          
        </div>
        
        <p className="text-gray-400 text-sm tracking-wider">© 2026 Riku Umezawa. All rights reserved.</p>
      </footer>
    </main>
  );
}