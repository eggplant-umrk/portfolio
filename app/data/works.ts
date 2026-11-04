// ＝＝＝ Selected Works のデータ（並び順・文章・画像・リンク先。トップページの作品カードに渡す） ＝＝＝
export type Work = {
  ref: string;
  title: string;
  award: string;
  description: string;
  tech: string[];
  image: { src: string; alt: string };
  href: string | null;
};

export const worksData: Work[] = [
  {
    ref: "U101",
    title: "TSUNAGU",
    award: "THE HACK 2026 東海予選1位通過 → 本選 デジタルフォルン賞・副大賞 受賞",
    description:
      "「通信が途絶えても、現場の状況は途絶えない」——災害時の避難所状況を収集・可視化するOffline First型の報告プラットフォーム。通信断時はLoRaで最低限の状況を本部へ届けます。",
    tech: ["React 19", "Vite", "FastAPI", "PostgreSQL", "AWS", "Terraform", "LoRa (ESP32)"],
    image: { src: "/tsunagu-hero.png", alt: "TSUNAGU メインビジュアル" },
    href: "/tsunagu",
  },
  {
    ref: "U102",
    title: "KOKUDO",
    award: "100Program 優秀インタビュー賞・オーディエンス賞 受賞",
    description:
      "実際に走った距離を全国の国道に重ね、キャラクターとともに目標期日までの完走を目指す、ランニング・ウォーキング記録アプリです。",
    tech: ["Flutter (Dart)", "MapLibre GL", "geolocator", "SQLite (sqflite)", "Firebase Authentication", "Cloud Firestore", "GitHub Actions", "Remotion"],
    image: { src: "/KOKUDO_feature_a.png", alt: "KOKUDO メインビジュアル" },
    href: "/kokudo",
  },
  {
    ref: "U103",
    title: "TrailDrop",
    award: "HACK STAGE 3 最優秀賞受賞",
    description:
      "目的地へ向かう旅行者のルートと通過時間から、その途中で受け取れる地域の商品を見つけ、予約・受取までをつなげるサービス。旅行者は出発地・目的地・出発時間を入力すると、ルート上の地域商品を確認でき、予約後に発行されるQRコードを使って道の駅などの無人受取ロッカーで商品を受け取れる。「わざわざ寄る」のではなく「通り道だから寄れる」ことで、いつもの旅に地域との接点をつくることを目指す。",
    tech: ["React", "Vite", "Tailwind CSS", "Python", "FastAPI", "Supabase", "PostgreSQL", "Google Routes API", "Google Maps", "qrcode.react"],
    image: { src: "/traildrop-hero.png", alt: "TrailDrop メインビジュアル" },
    href: "/traildrop",
  },
  {
    ref: "U104",
    title: "muscloop",
    award: "SysHack 2026 CyberAgent賞",
    description:
      "10〜20代の若年層をターゲットにした、モチベーションを維持するための新感覚フィットネスサポートアプリ。今後はApple Developer Programに登録し、HealthKitと連携した本格的なヘルスケアデータ取得を実装予定です。",
    tech: ["React Native (Expo)", "FastAPI", "Firebase", "Docker", "AWS ECS", "HealthKit (実装予定)"],
    image: { src: "/muscloop.webp", alt: "muscloop Pamphlet" },
    href: "/muscloop",
  },
  {
    ref: "U105",
    title: "Taleglot",
    award: "100Program オーディエンス賞×2 受賞",
    description:
      "言語と文化を学べるインタラクティブ絵本。タイに実在する民話を、絵本のように読み進めながらタイ語にふれられる学習アプリです。",
    tech: ["React", "Vite", "JavaScript", "localStorage", "HTML / CSS"],
    image: { src: "/taleglot.png", alt: "Taleglot メインビジュアル" },
    href: null,
  },
];
