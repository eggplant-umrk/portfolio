import Image from "next/image";
import BoardSwitch from "../components/BoardSwitch";
import { workMetadata } from "../lib/seo";
import type { CSSProperties } from "react";
import BackButton from "../components/BackButton";
import RevealInit from "../components/RevealInit";
import YouTubeEmbed from "../components/YouTubeEmbed";

// 検索向け: title「作品名 | 梅澤 陸 (Riku Umezawa)」、description は Overview の最初の 1 文、canonical / og / twitter
export const metadata = workMetadata({
  name: "TrailDrop",
  description: "TrailDropは、目的地へ向かう旅行者のルートと通過時間から、その途中で受け取れる地域の商品を見つけ、予約・受取までをつなげるサービスです。",
  path: "/traildrop",
});

export default function TraildropDetail() {
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
            HACK STAGE 3 最優秀賞受賞
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-silk">
            TrailDrop
          </h1>
          <p className="text-xl text-silk-soft max-w-2xl leading-relaxed mb-12">
            「わざわざ寄る」のではなく「通り道だから寄れる」——旅のルート上で地域の商品を見つけ、予約・受取までをつなげるサービス。
          </p>
        </div>

        <div className="reveal reveal-detail-in w-full rounded-3xl overflow-hidden shadow-sm border border-line bg-board-outer flex justify-center items-center aspect-video relative p-8" data-reveal-margin="0px" style={{ transitionDelay: "0.2s", "--y": "30px" } as CSSProperties}>
          <Image
            src="/traildrop-hero.png"
            alt="TrailDrop メインビジュアル"
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
            <YouTubeEmbed id="GyfnruzfmHI" title="TrailDrop Demo" />
          </div>
        </section>

        {/* 1. プロジェクト概要 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Overview
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              TrailDropは、目的地へ向かう旅行者のルートと通過時間から、その途中で受け取れる地域の商品を見つけ、予約・受取までをつなげるサービスです。岐阜県七宗町を舞台に、地域の特産品や体験プランといった地域資源を、旅の途中で予約できるアプリとして開発しました。
            </p>
            <p>
              旅行者は出発地・目的地・出発時間を入力すると、ルート上で受け取れる地域商品を確認できます。予約後に発行されるQRコードを使って、道の駅などの無人受取ロッカーで商品を受け取れます。「わざわざ寄る」のではなく「通り道だから寄れる」ことで、いつもの旅に地域との接点をつくることを目指しています。
            </p>
            <p>
              HACK STAGE 3にて最優秀賞を受賞しました。
            </p>
          </div>
        </section>

        {/* 2. チーム開発と役割 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Team & Roles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Frontend / UI・UX</h3>
              <p className="text-silk-soft">画面設計・フロントエンド実装</p>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Backend</h3>
              <p className="text-silk-soft">APIの設計・実装</p>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Infra / DB / Review</h3>
              <p className="text-silk-soft">インフラ・データベース構築とコードレビュー</p>
            </div>
          </div>
          <p className="text-silk-soft font-noto leading-relaxed">
            Frontend/UI・UX担当、Backend担当、Infra/DB/Review担当の3人体制で開発しました。私はFrontend/UI・UX・要件定義の担当として、サービスの要件定義から画面設計・フロントエンド実装までを担当しました。
          </p>
        </section>

        {/* 3. システム構成 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Architecture & Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Front-end</h3>
              <ul className="list-disc list-inside text-silk-soft space-y-2">
                <li>React</li>
                <li>Vite</li>
                <li>Tailwind CSS</li>
                <li>qrcode.react</li>
              </ul>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Back-end & DB</h3>
              <ul className="list-disc list-inside text-silk-soft space-y-2">
                <li>Python / FastAPI</li>
                <li>Supabase</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Maps & Routing</h3>
              <ul className="list-disc list-inside text-silk-soft space-y-2">
                <li>Google Routes API</li>
                <li>Google Maps</li>
              </ul>
            </div>
          </div>
          <p className="text-silk-soft font-noto leading-relaxed">
            フロントエンドはReactとVite、Tailwind CSSで構築し、予約後の受取用QRコードはqrcode.reactで生成しています。バックエンドはPython(FastAPI)で実装し、データはSupabase(PostgreSQL)で管理しています。Google Routes APIで出発地から目的地までのルートと通過時刻を求め、受取地点へはGoogle Mapsで案内します。
          </p>
        </section>

        {/* 4. 実際の画面（TrailDrop独自セクション：画面キャプチャを補足画像として挿入） */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            User Flow
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              ルートと通過時刻の確認、商品の予約、QRコードの発行とGoogle Mapsでの案内、受取完了までを、実際に動く形で実装しました。受取地点ごとに到着目安と受取時間帯を表示し、旅程のなかで無理なく立ち寄れるようにしています。
            </p>
          </div>

          <div className="reveal reveal-detail mt-10 w-full rounded-3xl overflow-hidden shadow-sm border border-line bg-board-outer flex justify-center items-center relative p-6" data-reveal-margin="-100px" style={{ transitionDelay: "0.1s", transitionDuration: "0.6s" }}>
            <Image
              src="/traildrop-screens.png"
              alt="TrailDrop 実際の画面"
              width={1410}
              height={796}
              sizes="(min-width: 1024px) 896px, 100vw"
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
          <p className="text-sm text-silk-label mt-4 text-center">
            TrailDrop の実際の画面
          </p>
        </section>

        {/* 5. 今後の展望 */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Next Steps
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              HACK STAGE 3後も開発を継続する予定です。まずは七宗町との連携を深め、事業者と提携して実際の商品・在庫・受取運用を含めたデモ実証を行い、サービスとしての成立可否と収益性を検証します。その上で、七宗町内での規模拡大、さらには他地域への展開を目指しています。
            </p>
            <p>
              技術面では、実際の商品・在庫との連携、QR決済などの実決済への対応、多言語対応を進めていきます。また、今回はAIをプロダクトの機能として十分に活かしきれなかったため、AIによる旅行者への地域提案の高度化にも今後挑戦したいと考えています。
            </p>
          </div>
        </section>

        {/* 6. 振り返り */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Reflections - HACK STAGE 3を終えて
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              最も難しかったのは、単に機能を作ることではなく、「出発地・目的地 → ルート分析 → 通過時間 → 受け取れる商品 → 予約 → QRコード → 受取」という旅行者の一連の行動が矛盾なくつながるようにすることでした。時間・在庫・予約状態が連動するため、実際のユーザー操作を想定して何度も確認し、「この画面では使えるけれど、次の画面ではおかしい」という部分を一つひとつ潰していきました。また、AI開発ツールを積極的に活用し、実装・確認・修正のサイクルを高速に回せたことも工夫の一つです。
            </p>
            <p>
              チーム開発では、「一人で抱え込まないこと」の重要性を学びました。一人で作業するときは集中して切りのいいところまで進めてから共有し、問題にぶつかったときは長時間一人で悩まず、早めに他のメンバーへ相談・共有するようにしました。3人がそれぞれ担当を持ちながら詰まった部分を助け合うことで、チーム全体の開発を止めずに進めることができました。
            </p>
          </div>
        </section>

        {/* 7. GitHubへのスーパーリンク */}
        <section className="reveal reveal-detail" data-reveal-margin="-100px">
          <div className="bg-board-outer border border-line rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-4 text-silk tracking-tight">
              Explore the Code
            </h2>
            <p className="text-silk-soft font-noto leading-relaxed mb-8 max-w-2xl">
              ソースコードは現在公開準備中です。
            </p>
            {/* TODO: リポジトリURLが決まったら href を設定してコメントアウトを外す
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-silk text-board px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-md"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              View on GitHub
            </a>
            */}
          </div>
        </section>

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
