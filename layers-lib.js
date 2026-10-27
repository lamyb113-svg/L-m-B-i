// Tách lớp: chụp riêng từng phần tử [data-layer] (nền trong suốt), cắt sát viền, ghi manifest toạ độ theo trang Canva A4 (794×1123 px).
const fs = require('fs');
const { execFileSync } = require('child_process');
module.exports = async (page, html, outDir) => {
  fs.mkdirSync(outDir, { recursive: true });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const names = await page.$$eval('[data-layer]', els => els.map(e => e.dataset.layer));
  const manifest = [];
  for (const [i, n] of names.entries()) {
    await page.evaluate(k => document.querySelectorAll('[data-layer]').forEach(e => { e.style.visibility = e.dataset.layer === k ? 'visible' : 'hidden'; }), n);
    const file = `${outDir}/${String(i + 1).padStart(2, '0')}-${n}.png`;
    await page.screenshot({ path: file, omitBackground: true });
    const box = JSON.parse(execFileSync('python3', ['-I', '-c', `
import sys, json
from PIL import Image
im = Image.open(sys.argv[1]); bb = im.getbbox() or (0, 0, 1, 1)
pad = 4; bb = (max(bb[0]-pad,0), max(bb[1]-pad,0), min(bb[2]+pad,im.width), min(bb[3]+pad,im.height))
im.crop(bb).save(sys.argv[1]); print(json.dumps(bb))`, file]).toString());
    const s = 794 / 2481; // px ảnh 300dpi -> px trang Canva
    manifest.push({ order: i + 1, layer: n, file: file.split('/').pop(), left: +(box[0] * s).toFixed(1), top: +(box[1] * s).toFixed(1), width: +((box[2] - box[0]) * s).toFixed(1), height: +((box[3] - box[1]) * s).toFixed(1) });
  }
  fs.writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 1));
};
