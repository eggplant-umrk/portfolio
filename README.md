# 梅澤 陸 (Riku Umezawa) — Portfolio

愛知工業大学で電気電子工学を専攻する 29 卒のフロントエンドエンジニア、梅澤 陸の個人ポートフォリオです。

- 本番: https://eggplant-portfolio-rho.vercel.app/
- 内容: 自己紹介（About Me）、活動記録（Activity & News）、作品（Selected Works: TSUNAGU / KOKUDO / TrailDrop / muscloop / Taleglot）、連絡先（Get in Touch）。詳細ページは TSUNAGU・KOKUDO・TrailDrop・muscloop の 4 つ

## デザインのコンセプト

サイト全体を 1 枚の「電子回路の基板（PCB）」に見立てています。

- 白・緑・青の 3 色の基板（ソルダーマスクの色）をヘッダーの BOARD スイッチで切り替えられます。選択は localStorage に保存し、保存がなければ OS のダークモード設定なら緑、それ以外は白で表示します
- Hero の右には IC「UMZW-29」（U10）を中心にした回路（配線・ビア・LED・プルアップ抵抗）があり、ページ表示と同時に配線が描かれて LED が点きます
- About 以降の左には電源ライン「+3V3」のスパインが縦に通り、電流が流れ続けます。途中に抵抗 R1・コンデンサ C1・抵抗 R2 が枝分かれしています
- 各セクションは部品番号付き（U1 About / U2 News / U3 Works / J1 Contact）。スキルは部品表（BOM）、作品カードは IC チップ、連絡先はコネクタのピンとして表しています
- 取り付け穴 H1〜H4、位置合わせマーク、基板の外形線、シルク印刷の注記（BOARD INFO など）を配置しています

## 主な機能

- 測定プローブ型のカーソル（マウスのある PC のみ）: 回路の配線やスパインに乗せると、ネット名と電圧（SDA / SCL は I2C の波形）を表示します
- LAYERS パネル（PC のみ）: 基板 CAD のように F.Cu / B.Cu / F.SilkS / Edge.Cuts の表示を切り替えられます
- 初回訪問だけのオープニング、表示域に入ったときに現れる要素、画面外・タブ非表示でのアニメーション停止
- Activity & News の「もっと見る」（5 件ずつ）
- 作品の詳細ページ（概要・役割・構成・画面・今後の展望・振り返り・リンク）。TrailDrop と KOKUDO にはデモ動画（YouTube、クリックするまで読み込まない軽量埋め込み）
- 404 ページ「OPEN CIRCUIT」
- スマホ対応: safe-area、タップ範囲 44px、下スクロール中はヘッダーを隠す、フルスクリーンのメニュー（最初のリンクにフォーカス、Esc で閉じる）
- 動きを減らす設定（prefers-reduced-motion）では演出を止めます
- SEO: ページごとの title / description / canonical / OGP 画像（自動生成）、sitemap.xml、robots.txt、構造化データ（Person / WebSite / CreativeWork）
- セキュリティヘッダー（CSP など）は next.config.ts で設定しています

## 技術の構成

- Next.js 16（App Router）/ React 19 / TypeScript
- Tailwind CSS v4（色はすべて CSS 変数。テーマは `<html data-board>` で切り替え）
- フォント: Chakra Petch（見出し）、JetBrains Mono（ラベル）は next/font/google。本文の Zen Kaku Gothic New はサイトで使っている文字だけにサブセット化した woff2 を自己ホスト
- OGP 画像は next/og（satori）で生成
- ホスティング: Vercel

## 開発の始め方

```bash
npm install
npm run dev
```

- `npm run dev` の前に `predev` で `scripts/subset-fonts.mjs` が走り、`app/` 以下で使っている文字を集めて `app/fonts/*.woff2` を作り直します（`npm run build` の前も同じ）。生成物はリポジトリにも含めています
- スマホの実機から確認するときは `npm run dev -- -H 0.0.0.0` で起動し、`.env.local` にスマホから開くときのパソコンの IP アドレス（またはホスト名）を書きます。`http://` やポート番号は付けません

```
DEV_LAN_ORIGINS=192.168.0.10
```

複数あるときは `DEV_LAN_ORIGINS=192.168.0.10,my-pc.local` のようにカンマで区切ります

そのほかのコマンド:

```bash
npm run build         # 本番ビルド
npm run start         # ビルドしたものを起動
npm run lint          # ESLint
npm run subset-fonts  # フォントのサブセットだけを作り直す
```

## ディレクトリの構成

```
app/
  page.tsx              トップページ（Hero・About・News・Works・Contact）
  layout.tsx            共通レイアウト（フォント・metadata・描画前のテーマ判定）
  globals.css           テーマの色、基板の装飾、アニメーション
  not-found.tsx         404（OPEN CIRCUIT）
  sitemap.ts / robots.ts
  opengraph-image.tsx / twitter-image.tsx   OGP 画像
  tsunagu/ kokudo/ traildrop/ muscloop/     作品の詳細ページ
  components/           ヘッダー、基板の色切り替え、プローブ、LAYERS パネル、連絡先など
  data/                 作品（works.ts）と News（news.ts）のデータ
  lib/                  SEO の共通設定、プロフィール、OGP 画像の描画、表示域の監視など
  fonts/                サブセット化した本文フォント（生成物）
public/                 作品の画像
scripts/
  subset-fonts.mjs      本文フォントのサブセット化（predev / prebuild）
  instance-font.mjs     OGP 画像用に JetBrains Mono の可変フォントを固定ウェイトにする
  fonts-src/            フォントの元ファイル（TTF）
next.config.ts          セキュリティヘッダー（CSP など）、開発時の許可 origin
```

## フォントのライセンス

本文フォント Zen Kaku Gothic New、見出しの Chakra Petch、ラベルの JetBrains Mono は、いずれも SIL Open Font License 1.1（OFL）のもとで配布されているフォントです。`scripts/fonts-src/` の元ファイルと `app/fonts/` のサブセットも同じライセンスに従います。ライセンスの全文は `scripts/fonts-src/OFL.txt`（Zen Kaku Gothic New）、`OFL-ChakraPetch.txt`、`OFL-JetBrainsMono.txt` にあります。
