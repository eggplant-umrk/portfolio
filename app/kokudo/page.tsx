import Image from "next/image";
import BoardSwitch from "../components/BoardSwitch";
import type { CSSProperties } from "react";
import BackButton from "../components/BackButton";
import RevealInit from "../components/RevealInit";
import YouTubeEmbed from "../components/YouTubeEmbed";

// Google Play に掲載しているスクリーンショット（public/kokudo-screen-1〜4.webp）
const screens = [1, 2, 3, 4].map((n) => ({ src: `/kokudo-screen-${n}.webp`, alt: `KOKUDO アプリ画面 ${n}` }));

// 100Program 発表資料のスライド（public/kokudo-slide-*.webp）
const slides = [
  { src: "/kokudo-slide-01.webp", alt: "発表資料 表紙", caption: "表紙" },
  { src: "/kokudo-slide-04.webp", alt: "発表資料 課題", caption: "課題" },
  { src: "/kokudo-slide-07.webp", alt: "発表資料 解決策", caption: "解決策" },
  { src: "/kokudo-slide-10.webp", alt: "発表資料 成果と展望", caption: "成果と展望" },
];

const features = [
  "GPS でランニング・ウォーキングの距離を計測（画面を消しても計測を継続）",
  "目標期日から逆算して、1日あたりに必要な距離を示す完走ナビ",
  "全国 459 路線の国道から挑戦する路線を選択（切り替えても進捗は保持）",
  "走破状況を色分けで表示する国道の地図コレクション",
  "カレンダー形式の走行履歴と、トレッドミル用の手動入力",
  "完走時の演出と、完走記録のシェア画像",
  "位置情報は距離の計算にだけ使い、走行経路は保存・送信しない",
];

const techStack = [
  "Flutter (Dart)",
  "MapLibre GL",
  "geolocator",
  "SQLite (sqflite)",
  "Firebase Authentication",
  "Cloud Firestore",
  "GitHub Actions",
  "Remotion",
];

export default function KokudoDetail() {
  return (
    <main className="min-h-screen bg-board text-silk flex flex-col">
      {/* 表示域に入ったら現れる要素の監視（描画はしない） */}
      <RevealInit />

      {/* ＝＝＝ ヘッダー（上部の戻るリンク） ＝＝＝ */}
      <nav className="w-full px-8 md:px-24 py-8 max-w-7xl mx-auto">
        <BackButton className="inline-flex items-center text-sm font-bold text-silk-muted hover:text-silk transition-colors bg-transparent border-none cursor-pointer">
          ← Back to Home
        </BackButton>
      </nav>

      {/* ＝＝＝ タイトル＆メインビジュアル ＝＝＝ */}
      <header className="w-full px-8 md:px-24 max-w-7xl mx-auto mt-8 mb-16">
        <div className="reveal reveal-detail-in" data-reveal-margin="0px">
          <span className="text-sm font-bold text-accent tracking-wider mb-4 block">
            100program 優秀インタビュー賞・オーディエンス賞 受賞
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-silk">
            KOKUDO
          </h1>
          <p className="text-xl text-silk-soft max-w-2xl leading-relaxed mb-4">
            走った道が、日本地図になっていく。
          </p>
          <p className="font-mono text-[12px] tracking-[0.1em] text-silk-label mb-12">
            100Program 第10期（2026夏期）／開発期間 2026年8月〜10月／3人チーム
          </p>
        </div>

        <div className="reveal reveal-detail-in w-full rounded-3xl overflow-hidden shadow-sm border border-line bg-board-outer flex justify-center items-center aspect-video relative p-8" data-reveal-margin="0px" style={{ transitionDelay: "0.2s", "--y": "30px" } as CSSProperties}>
          <Image
            src="/KOKUDO_feature_a.png"
            alt="KOKUDO メインビジュアル"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-contain p-4"
          />
        </div>
      </header>

      {/* ＝＝＝ プロジェクト詳細 ＝＝＝ */}
      <article className="w-full px-8 md:px-24 max-w-4xl mx-auto space-y-24 flex-grow">

        {/* デモ動画 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Demo
          </h2>
          <p className="text-silk-soft font-noto leading-relaxed mb-8">
            実際の操作画面は、こちらのデモ動画でご覧いただけます。
          </p>
          <div className="w-full rounded-3xl overflow-hidden shadow-sm border border-line bg-board-outer aspect-video relative">
            <YouTubeEmbed id="9TRUro-0go0" title="KOKUDO Demo" />
          </div>
        </section>

        {/* 1. プロジェクト概要 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Overview
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              実際に走った距離を全国の国道の区間に換算し、国道を一本ずつ走破していくランニング・ウォーキング記録アプリです。ランニングが三日坊主になりやすいという課題に対し、走った距離が日本地図の上で進んでいく体験と、目標期日から逆算して必要な距離を示すナビで、続けるきっかけをつくります。広告やアプリ内課金はなく、Google アカウントでクラウド同期できます。
            </p>
          </div>
          <h3 className="text-lg font-bold text-silk mt-10 mb-4">主な機能</h3>
          <ul className="list-disc list-inside text-silk-soft font-noto leading-relaxed space-y-2">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>

        {/* 2. チーム開発と役割 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Team & Roles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">梅澤 陸</h3>
              <p className="text-silk-soft">
                PM・インフラ担当。GitHub の運用ルールと CI を整え、チームの PR を確認してマージ。Firebase の設定とセキュリティルール、デモ動画・発表資料、Android の署名から Google Play への公開までを担当
              </p>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">伊藤 有美歩</h3>
              <p className="text-silk-soft">フロント実装</p>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">新野 琉壱</h3>
              <p className="text-silk-soft">データ整理・Firebase 認証</p>
            </div>
          </div>
        </section>

        {/* 3. システム構成 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Architecture & Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {techStack.map((tech) => (
              <span key={tech} className="font-mono text-[12px] text-silk-muted border border-line rounded-[3px] px-2 py-1">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-silk-soft font-noto leading-relaxed">
            アプリは端末内の SQLite に走行記録と進捗を保存し、国道の形は GeoJSON としてアプリに同梱しています。Google ログイン後は進捗と走行ログを Cloud Firestore に同期し、複数の端末で同じ記録を使えます。地図の描画には MapLibre GL と国土地理院ベクトルタイルを使用。GitHub Actions で静的解析とテストを自動化し、デモ動画は Remotion で制作しました。
          </p>
        </section>

        {/* 4. アプリ画面（Google Play のスクリーンショット） */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            App Screens
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {screens.map((s) => (
              <div key={s.src} className="rounded-2xl overflow-hidden border border-line bg-board-outer shadow-sm">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={1080}
                  height={1920}
                  sizes="(min-width: 768px) 160px, 45vw"
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-silk-label mt-4 text-center">
            Google Play に掲載しているアプリ画面
          </p>
        </section>

        {/* 5. 発表資料 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Pitch - 100Program 発表資料より
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {slides.map((s) => (
              <figure key={s.src} className="m-0">
                <div className="rounded-2xl overflow-hidden border border-line bg-board-outer shadow-sm">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={1600}
                    height={900}
                    sizes="(min-width: 640px) 340px, 100vw"
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="font-mono text-[11px] tracking-[0.12em] text-silk-label mt-2 text-center">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 6. 今後の展望 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Next Steps
          </h2>
          <p className="text-silk-soft font-noto leading-relaxed">
            iOS 版のリリースを控えています。
          </p>
        </section>

        {/* 7. 振り返り */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Reflections - 初めての PM を終えて
          </h2>
          <p className="text-silk-soft font-noto leading-relaxed">
            これまでは毎回サークルの同じメンバーで開発していましたが、KOKUDO は初めて一緒に開発するメンバーとのチームで、自分にとっても初めての PM でした。慣れない PM としてチームの PR を確認していく中で、特にコードレビューに苦労しました。
          </p>
        </section>

        {/* 8. リンク */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <div className="bg-board-outer border border-line rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-silk tracking-tight">
              Explore the Code
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/eggplant-umrk/KOKUDO"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-silk text-board px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.zerotomedapp.KOKUDO"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border-2 border-silk text-silk px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300"
              >
                Google Play で見る
              </a>
            </div>
          </div>
        </section>

        {/* クレジット */}
        <p className="font-mono text-[11px] tracking-[0.1em] text-silk-label text-center">
          地図：国土地理院ベクトルタイル ／ 路線：© OpenStreetMap contributors
        </p>

        {/* ＝＝＝ 下部の戻るリンク ＝＝＝ */}
        <div className="reveal reveal-detail pt-16 pb-8 flex justify-center" data-reveal-margin="-50px">
          <BackButton className="inline-flex items-center text-sm font-bold text-silk-muted hover:text-silk transition-colors bg-transparent border-none cursor-pointer">
            ← Back to Home
          </BackButton>
        </div>

      </article>

      {/* ＝＝＝ フッター（コンタクト情報） ＝＝＝ */}
      {/* 下余白は右下の固定表示（基板の色の切り替え: 高さ 49px + 余白 24px）に文字が隠れない量にする */}
      <footer className="w-full pt-24 pb-24 bg-board-outer border-t border-line flex flex-col items-center mt-16">
        <div className="flex flex-col gap-6 mb-16 items-start">

          <a href="https://x.com/rikuumezawa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-silk hover:text-silk-muted transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xl font-normal tracking-wide">rikuumezawa</span>
          </a>

          <a href="https://github.com/eggplant-umrk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-silk hover:text-silk-muted transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="text-xl font-normal tracking-wide">eggplant-umrk</span>
          </a>

          <a href="mailto:eggplant2006@au.com" className="flex items-center gap-4 text-silk hover:text-silk-muted transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-xl font-normal tracking-wide">eggplant2006@au.com</span>
          </a>

        </div>

        <p className="text-silk-label text-sm tracking-wider">© 2026 Riku Umezawa. All rights reserved.</p>
      </footer>
      {/* 基板の色の切り替え（右下に固定表示。Tab 順が本文の後になるよう DOM では末尾） */}
      <BoardSwitch variant="floating" />
    </main>
  );
}
