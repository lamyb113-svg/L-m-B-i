// Dựng nền khung Porsche Panamera (A4). Toạ độ đo từ ảnh gốc đã xoay thẳng, đơn vị = px ảnh đo.
// Dùng: node render.js "THAI VU"  -> xuất PNG 300dpi + PDF + SVG
const { chromium } = require('playwright');
const fs = require('fs');
const NAME = (process.argv[2] ?? 'THAI VU').toUpperCase();
const VB = process.argv[3] || '35 45 640 905'; // vùng in A4
const BG = '#DFA3AD', ROSE = '#B8325A';

function svg(name, { title = true, w = '210mm', h = '297mm' } = {}) {
  const porsche = [[96, .8], [149, .85], [207, .3]].map(([y, o]) =>
    `<text x="82" y="${y}" font-family="Michroma" font-size="38" textLength="485" lengthAdjust="spacingAndGlyphs" fill="#fff" fill-opacity="${o}">PORSCHE</text>`).join('');
  const pan = `<g fill="none" stroke="${ROSE}" stroke-width="3.2" stroke-linecap="round">
    <path d="M72,110 C100,80 190,58 265,60 C330,62 355,80 345,105 C335,135 305,165 275,178 C230,198 150,215 100,226 C85,229 88,236 105,232 C180,215 320,160 420,140"/>
    <path d="M227,110 C215,180 180,250 142,310"/></g>
    <text x="292" y="190" font-family="Allison" font-size="92" textLength="295" lengthAdjust="spacingAndGlyphs" fill="${ROSE}" stroke="${ROSE}" stroke-width="1.6">anamera</text>`;
  const nm = name ? `<text transform="translate(607,328) rotate(90)" font-family="Lexend Zetta" font-weight="300" font-size="36" textLength="${Math.round(448 * name.length / 7)}" lengthAdjust="spacingAndGlyphs" fill="#fff" fill-opacity=".92">${name}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${VB}" preserveAspectRatio="none">
  <defs><clipPath id="c"><rect x="35" y="45" width="640" height="905"/></clipPath></defs>
  <g clip-path="url(#c)">
  <rect x="0" y="0" width="700" height="1000" fill="${BG}"/>
  <circle cx="335" cy="15" r="300" fill="#fff" fill-opacity=".16"/>
  ${title ? porsche + pan : ''}${nm}</g></svg>`;
}
const html = s => `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Michroma&family=Allison&family=Lexend+Zetta:wght@300&display=swap" rel="stylesheet">
<style>*{margin:0}body{width:210mm;height:297mm;overflow:hidden}svg{display:block}</style></head><body>${s}</body></html>`;

(async () => {
  const out = __dirname, b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 });
  const jobs = process.env.OVERLAY ? [['_overlay', NAME, true]] :
    [['nen-full-' + NAME.replace(/\s+/g, '-'), NAME, true], ['nen-khong-ten', '', true], ['nen-trong', '', false]];
  for (const [f, n, t] of jobs) {
    const s = svg(n, { title: t });
    await p.setContent(html(s), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${out}/${f}.png` });
    if (!process.env.OVERLAY) await p.pdf({ path: `${out}/${f}.pdf`, width: '210mm', height: '297mm', printBackground: true });
  }
  await b.close();
})();
