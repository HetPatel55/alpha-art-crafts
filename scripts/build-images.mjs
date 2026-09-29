// Converts every photo in content/gallery/<category>/ into responsive WebP
// files under public/media/ and writes src/data/gallery.generated.json.
//
// To add new work: drop a .jpg/.jpeg/.png/.webp into the right category
// folder and run `npm run images` (it also runs automatically before dev/build).

import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "content", "gallery");
const OUT_DIR = path.join(ROOT, "public", "media");
const MANIFEST = path.join(ROOT, "src", "data", "gallery.generated.json");

// Keep in sync with src/lib/image-loader.ts
const WIDTHS = [384, 640, 960, 1280, 1920];
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function isFresh(outFile, srcMtime) {
  try {
    return (await stat(outFile)).mtimeMs >= srcMtime;
  } catch {
    return false;
  }
}

const categories = (await readdir(SRC_DIR, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const manifest = [];
let generated = 0;

for (const category of categories) {
  const files = (await readdir(path.join(SRC_DIR, category)))
    .filter((f) => EXT.has(path.extname(f).toLowerCase()))
    .sort();

  await mkdir(path.join(OUT_DIR, category), { recursive: true });

  for (const file of files) {
    const srcFile = path.join(SRC_DIR, category, file);
    const id = path.parse(file).name.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const { mtimeMs } = await stat(srcFile);

    const base = sharp(srcFile).rotate(); // respect EXIF orientation
    const meta = await base.metadata();
    const oriented = (meta.orientation ?? 1) >= 5;
    const width = oriented ? meta.height : meta.width;
    const height = oriented ? meta.width : meta.height;

    for (const w of WIDTHS) {
      const out = path.join(OUT_DIR, category, `${id}-${w}.webp`);
      if (await isFresh(out, mtimeMs)) continue;
      await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(out);
      generated++;
    }

    const blurBuf = await base.clone().resize(16).webp({ quality: 40 }).toBuffer();

    manifest.push({
      id,
      category,
      src: `/media/${category}/${id}`,
      width,
      height,
      blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    });
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `images: ${manifest.length} photos in ${categories.length} categories, ${generated} files generated`,
);
