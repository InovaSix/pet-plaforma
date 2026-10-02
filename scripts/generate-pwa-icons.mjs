// Gera os ícones do PWA a partir de src/app/icon.svg.
// Rode com `node scripts/generate-pwa-icons.mjs` sempre que o ícone mudar.
import { mkdir, readFile } from "node:fs/promises";
import sharp from "sharp";

const BG = "#eef6f0";
const SOURCE = "src/app/icon.svg";
const OUT = "public/icons";

const svg = await readFile(SOURCE, "utf8");
const paw = svg.match(/<g[\s\S]*<\/g>/)?.[0];
if (!paw) throw new Error(`Não encontrei o desenho da pata em ${SOURCE}`);

// Fundo quadrado e opaco (o sistema aplica a própria máscara/arredondamento),
// com a pata reduzida para caber na área segura dos ícones "maskable".
function fullBleed(scale) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">` +
      `<rect width="48" height="48" fill="${BG}" />` +
      `<g transform="translate(24 24) scale(${scale}) translate(-24 -24)">${paw}</g>` +
      `</svg>`,
  );
}

async function render(input, size, out) {
  await sharp(input, { density: 512 })
    .resize(size, size)
    .flatten({ background: BG })
    .png()
    .toFile(out);
  console.log(`✓ ${out}`);
}

await mkdir(OUT, { recursive: true });
await render(Buffer.from(svg), 192, `${OUT}/icon-192.png`);
await render(Buffer.from(svg), 512, `${OUT}/icon-512.png`);
await render(fullBleed(0.72), 512, `${OUT}/icon-maskable-512.png`);
await render(fullBleed(0.88), 180, "src/app/apple-icon.png");
