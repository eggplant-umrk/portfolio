// 本文フォント Zen Kaku Gothic New を「サイトで使っている文字だけ」にサブセット化して app/fonts/ に出力する。
// predev / prebuild から自動で走る（Vercel のビルドでも同じ）。生成物はリポジトリにも含めておき、
// 万一ここが失敗しても表示が崩れないようにする。
//
// 文字の集め方:
//   - app/ 以下の .tsx / .ts / .css / .md / .mdx / .json に含まれる文字すべて（コメントも含む）
//   - ASCII の印字可能文字すべて
//   - よく使う全角記号と全角スペース
import { readFile, writeFile, readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";
import * as fontkit from "fontkit";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "scripts", "fonts-src");
const outDir = path.join(root, "app", "fonts");
const scanDir = path.join(root, "app");
const scanExt = new Set([".tsx", ".ts", ".css", ".md", ".mdx", ".json"]);

// ウェイトごとの元ファイル（Google Fonts 公式リポジトリ ofl/zenkakugothicnew から取得したもの）
const weights = [
  { weight: 400, file: "ZenKakuGothicNew-Regular.ttf" },
  { weight: 700, file: "ZenKakuGothicNew-Bold.ttf" },
];

const extraChars = "、。・「」『』（）【】〜ー！？：；×％＆＋－／＝…　";

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "fonts" || entry.name === "node_modules") continue;
      yield* walk(full);
    } else if (scanExt.has(path.extname(entry.name))) {
      yield full;
    }
  }
}

async function collectChars() {
  const chars = new Set();
  // ASCII 印字可能文字（0x20〜0x7E）
  for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCharCode(c));
  for (const ch of extraChars) chars.add(ch);
  let files = 0;
  for await (const file of walk(scanDir)) {
    const text = await readFile(file, "utf8");
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      if (cp < 0x20 || (cp >= 0x7f && cp < 0xa0)) continue; // 制御文字は除く
      chars.add(ch);
    }
    files++;
  }
  return { chars, files };
}

async function main() {
  const { chars, files } = await collectChars();
  const text = [...chars].sort().join("");
  console.log(`[subset-fonts] scanned ${files} files under app/, ${chars.size} unique characters requested`);

  await mkdir(outDir, { recursive: true });
  for (const { weight, file } of weights) {
    const srcPath = path.join(srcDir, file);
    const src = await readFile(srcPath);
    const woff2 = await subsetFont(src, text, { targetFormat: "woff2" });
    const outPath = path.join(outDir, `ZenKakuGothicNew-${weight}-subset.woff2`);
    await writeFile(outPath, woff2);

    // 収録文字数は出力ファイルの cmap から数える
    const font = fontkit.create(woff2);
    const covered = font.characterSet.length;
    const missing = [...chars].filter((ch) => !font.hasGlyphForCodePoint(ch.codePointAt(0)));
    const size = (await stat(outPath)).size;
    console.log(
      `[subset-fonts] weight ${weight}: ${path.relative(root, outPath)}  ${(size / 1024).toFixed(1)} KB  ${covered} chars` +
        (missing.length ? `  (not in source font: ${missing.length}: ${missing.join(" ")})` : "")
    );
  }
}

main().catch((err) => {
  console.error("[subset-fonts] failed:", err);
  process.exit(1);
});
