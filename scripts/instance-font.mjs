// 可変フォント JetBrainsMono[wght].ttf（google/fonts 由来）から、OGP 画像用の静的 TTF を作る。
// ImageResponse（satori）は可変フォントを読めないので、wght=400 に固定し、ラベルに使う ASCII と少数の記号だけを残す。
// 出力: scripts/fonts-src/JetBrainsMono-Regular.ttf（リポジトリに含める。再生成: node scripts/instance-font.mjs）
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "scripts", "fonts-src");

let text = "";
for (let c = 0x20; c <= 0x7e; c++) text += String.fromCharCode(c);
text += "·—–‐→←×…‘’“”";

const src = await readFile(path.join(srcDir, "JetBrainsMono[wght].ttf"));
const out = await subsetFont(src, text, { targetFormat: "truetype", variationAxes: { wght: 400 } });
await writeFile(path.join(srcDir, "JetBrainsMono-Regular.ttf"), out);
console.log(`JetBrainsMono-Regular.ttf: ${out.length} bytes`);
