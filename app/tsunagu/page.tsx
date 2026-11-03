"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BoardSwitch from "../components/BoardSwitch";

export default function TsunaguDetail() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-board text-silk flex flex-col">

      {/* ＝＝＝ ヘッダー（上部の戻るリンク） ＝＝＝ */}
      <nav className="w-full px-8 md:px-24 py-8 max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-bold text-silk-muted hover:text-silk transition-colors bg-transparent border-none cursor-pointer"
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
          <span className="text-sm font-bold text-accent tracking-wider mb-4 block">
            THE HACK 2026 東海予選1位通過 → 本選 デジタルフォルン賞・副大賞 受賞
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-silk">
            TSUNAGU
          </h1>
          <p className="text-xl text-silk-soft max-w-2xl leading-relaxed mb-12">
            「通信が途絶えても、現場の状況は途絶えない」——災害時の避難所状況を収集・可視化するOffline First型の報告プラットフォーム。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full rounded-3xl overflow-hidden shadow-sm border border-line bg-board-outer flex justify-center items-center aspect-video relative p-8"
        >
          <Image
            src="/tsunagu-hero.png"
            alt="TSUNAGU メインビジュアル"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-contain p-4"
          />
        </motion.div>
      </header>

      {/* ＝＝＝ プロジェクト詳細 ＝＝＝ */}
      <article className="w-full px-8 md:px-24 max-w-4xl mx-auto space-y-24 flex-grow">

        {/* 1. プロジェクト概要 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Overview
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              TSUNAGUは、災害時に避難所の状況を収集・可視化するOffline First型の報告プラットフォームです。「通信が途絶えても、現場の状況は途絶えない」をコンセプトに、通常時はスマートフォンやPCから詳細な現場報告を送信し、通信が途絶えた場合は端末内に報告を保存して復旧後に自動で再送します。それでも通信が長時間回復しない場合は、LoRaという長距離無線を使って、最低限の状況だけを本部へ届けます。
            </p>
            <p>
              THE HACK 2026(東海予選)で1位を通過し、本選では「デジタルフォルン賞」「副大賞」をダブル受賞しました。受賞特典として、2026年11月24日にTOKYO FMホールで開催されるVORN Challenge 2026本戦へのシード出場権も獲得しています。
            </p>
          </div>
        </motion.section>

        {/* 2. チーム開発と役割 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Team &quot;CPY&quot; &amp; My Role
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              CPYチーム(3人体制)で開発しました。私はアプリ全体の設計とフロントエンド担当として、現場報告フォーム・本部ダッシュボード・インシデント管理画面などのUI設計・実装を担当しました。単なる画面づくりに留まらず、通信断・LoRa・複数拠点運用といった要件を踏まえて、どういう画面構成・データの流れにすべきかという設計そのものに時間をかけ、通信状態(オンライン/オフライン/LoRa)を自動検知して表示を切り替える仕組みを構築しました。
            </p>
            <p>
              技術選定にもこだわりました。LoRaの容量制約を踏まえたパケット設計、認証方式(Cognito)やインフラ構成(AWS ECS Express Mode)の選定など、要件に対して本当に適切な技術かを一つひとつ検討しながら決めていきました。
            </p>
            <p>
              バックエンド・インフラ・LoRaハードウェアはチームメンバーと連携し、Webアプリからハードウェアまで一気通貫で動作する状態に仕上げました。
            </p>
          </div>
        </motion.section>

        {/* 3. システム構成 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Architecture & Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Front-end</h3>
              <ul className="list-disc list-inside text-silk-soft space-y-2">
                <li>React 19</li>
                <li>Vite</li>
                <li>Amazon Cognito(Google連携)</li>
              </ul>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Back-end & Infra</h3>
              <ul className="list-disc list-inside text-silk-soft space-y-2">
                <li>FastAPI / PostgreSQL</li>
                <li>AWS(ECS Express Mode, RDS, ECR, SSM, CloudWatch Logs)</li>
                <li>Terraform / GitHub Actions</li>
              </ul>
            </div>
            <div className="bg-board-outer p-8 rounded-2xl border border-line shadow-sm">
              <h3 className="text-lg font-bold text-silk mb-4">Emergency Route</h3>
              <ul className="list-disc list-inside text-silk-soft space-y-2">
                <li>LILYGO T-Beam(ESP32 + SX1276)</li>
                <li>RadioLib</li>
                <li>920MHz帯 LoRa通信</li>
              </ul>
            </div>
          </div>
          <p className="text-silk-soft font-noto leading-relaxed">
            フロントエンドはReact 19とViteで構築し、バックエンドはFastAPIとPostgreSQLで報告データ・避難所情報・インシデント状態を管理しています。認証にはAmazon Cognito(Google連携)を採用し、インフラはAWS(ECS Express Mode、RDS、ECR、SSM Parameter Store、CloudWatch Logs)上でTerraformにより構築、GitHub Actionsで自動デプロイしています。通信が完全に途絶えた場合の非常用経路として、LILYGO T-Beam(ESP32+SX1276、RadioLibライブラリ)を使い、920MHz帯のLoRa通信で本部へ最低限の情報を届けます。
          </p>
        </motion.section>

        {/* 4. 技術的なこだわり（TSUNAGU独自セクション：実際の画面を補足画像として挿入） */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Offline First Design
          </h2>
          <div className="prose prose-lg text-silk-soft font-noto leading-relaxed space-y-6">
            <p>
              通信状態を自動検知し、人の判断を待たずに送信手段を切り替えるOffline First設計にこだわりました。LoRaで送れる情報量はごくわずかなため、避難所コード・時刻・人数・水在庫・緊急度・要請コードの6項目に絞り、実測37〜44バイトまでパケットを軽量化しています。
            </p>
            <p>
              また、緊急度の高い報告から優先的に電波に乗せる設計や、複数の本部PCが同時に運用されてもインシデントの対応状況が正しく同期される仕組みも実装しました。
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10 w-full rounded-3xl overflow-hidden shadow-sm border border-line bg-board-outer flex justify-center items-center relative p-6"
          >
            <Image
              src="/tsunagu-screens.png"
              alt="TSUNAGU 実際の画面（現場報告フォーム・本部ダッシュボード）"
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 896px, 100vw"
              className="w-full h-auto object-contain rounded-xl"
            />
          </motion.div>
          <p className="text-sm text-silk-label mt-4 text-center">
            通信状態(オンライン/オフライン/LoRa)に応じて表示を切り替える現場報告フォームと本部ダッシュボード
          </p>
        </motion.section>

        {/* 5. 今後の展望 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Next Steps
          </h2>
          <p className="text-silk-soft font-noto leading-relaxed">
            まずは大学構内での実証実験を予定しており、避難所やT-Beamの台数を増やすことで、対応規模をそのまま拡張できる設計にしています。実証実験で見えた課題をもとに、将来的には自治体等での試験導入も検討していきたいと考えています。
          </p>
        </motion.section>

        {/* 6. 振り返り */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl font-bold border-b-2 border-silk pb-4 mb-8 text-silk">
            Reflections - THE HACK 2026を終えて
          </h2>
          <p className="text-silk-soft font-noto leading-relaxed">
            開発中には、「同じ内容の報告が短時間に重なると、データが消えてしまう」という不具合に実際に遭遇しました。原因を調査し、重複防止の仕組みが正当な報告まで誤って弾いていたことを突き止め、修正しました。アイデアを形にするだけでなく、実際に動かしてみて初めて見つかる問題と向き合い、確実に届く設計まで磨き上げられたことが、今回の一番の学びです。
          </p>
        </motion.section>

        {/* 7. GitHubへのスーパーリンク */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-board-outer border border-line rounded-3xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-4 text-silk tracking-tight">
              Explore the Code
            </h2>
            <p className="text-silk-soft font-noto leading-relaxed mb-8 max-w-2xl">
              アプリの詳細な機能や実際の画面UI、お手元のローカル環境で手軽に動かしていただくための手順などは、GitHubのREADMEにすべてまとめています。ぜひソースコードとあわせてご覧ください！
            </p>
            <a
              href="https://github.com/NxTEND-THE-HACK/2026-Team-11"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-silk text-board px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-md"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </motion.section>

        {/* ＝＝＝ 下部の戻るリンク ＝＝＝ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="pt-16 pb-8 flex justify-center"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-bold text-silk-muted hover:text-silk transition-colors bg-transparent border-none cursor-pointer"
          >
            ← Back to Home
          </button>
        </motion.div>

      </article>

      {/* ＝＝＝ フッター（コンタクト情報） ＝＝＝ */}
      {/* 下余白は右下の固定表示（基板の色の切り替え: 高さ 49px + 余白 24px）に文字が隠れない量にする */}
      <footer className="w-full pt-24 pb-24 bg-board-outer border-t border-line flex flex-col items-center mt-16">
        <div className="flex flex-col gap-6 mb-16 items-start">

          <a href="https://x.com/rikuumezawa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-silk hover:text-silk-muted transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">rikuumezawa</span>
          </a>

          <a href="https://github.com/eggplant-umrk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-silk hover:text-silk-muted transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant-umrk</span>
          </a>

          <a href="mailto:eggplant2006@au.com" className="flex items-center gap-4 text-silk hover:text-silk-muted transition-colors group">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-xl font-medium tracking-wide">eggplant2006@au.com</span>
          </a>

        </div>

        <p className="text-silk-label text-sm tracking-wider">© 2026 Riku Umezawa. All rights reserved.</p>
      </footer>
      {/* 基板の色の切り替え（右下に固定表示。Tab 順が本文の後になるよう DOM では末尾） */}
      <BoardSwitch variant="floating" />
    </main>
  );
}
