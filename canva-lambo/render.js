// Dựng nền khung A4 Lamborghini Revuelto (đơn vị mm). Bố cục đo từ ảnh mẫu đã xoay thẳng.
// Dùng: node render.js "THANH LONG" "14/02/2026"
const { chromium } = require('playwright');
const fs = require('fs');
const NAME = (process.argv[2] ?? 'THANH LONG').toUpperCase();
const DATE = process.argv[3] ?? '14/02/2026';
const LOGO = 'data:image/png;base64,' + fs.readFileSync(__dirname + '/lamborghini-logo.png').toString('base64');
const BG = '#F3F3F3', INK = '#2B2B2B', GREY = '#8C8C8C';

// Cột ảnh bên phải: x từ L đến R, mỗi ô là đa giác (cạnh chéo theo mẫu)
const L = 123, R = 205, f = t => +(L + t * (R - L)).toFixed(2);
const SLOTS = [
  ['ẢNH XE 1', [[L, 10], [f(.684), 10], [f(.645), 46], [L, 46]]],
  ['ẢNH XE 2', [[f(.724), 10], [R, 10], [R, 46], [f(.684), 46]]],
  ['ẢNH KHÁCH 1', [[L, 49], [f(.91), 49], [f(.78), 107], [L, 107]]],
  ['XE 3', [[f(.95), 49], [R, 49], [R, 107], [f(.82), 107]]],
  ['ẢNH XE 4', [[L, 110], [R, 110], [R, 201], [L, 201]]],
  ['ẢNH KHÁCH 2', [[L, 204], [f(.63), 204], [f(.745), 248], [L, 248]]],
  ['ẢNH XE 5', [[f(.67), 204], [R, 204], [R, 248], [f(.785), 248]]],
];
const pts = p => p.map(q => q.join(',')).join(' ');
const centroid = p => p.reduce((a, q) => [a[0] + q[0] / p.length, a[1] + q[1] / p.length], [0, 0]);

function svg({ name, date, mode }) { // mode: 'preview' (ô xám có nhãn) | 'overlay' (ô trong suốt)
  const holes = SLOTS.map(([, p]) => `<polygon points="${pts(p)}" fill="#000"/>`).join('');
  const bg = mode === 'overlay'
    ? `<mask id="m"><rect width="210" height="297" fill="#fff"/>${holes}</mask><rect width="210" height="297" fill="${BG}" mask="url(#m)"/>`
    : `<rect width="210" height="297" fill="${BG}"/>` + SLOTS.map(([t, p]) => {
        const [cx, cy] = centroid(p);
        return `<polygon points="${pts(p)}" fill="#CFCFCF"/><text x="${cx}" y="${cy + 1.2}" text-anchor="middle" font-family="Barlow Condensed" font-weight="600" font-size="3.6" fill="#888">${t}</text>`;
      }).join('');
  const borders = SLOTS.map(([, p]) => `<polygon points="${pts(p)}" fill="none" stroke="${INK}" stroke-width="0.45"/>`).join('');
  const spec = (x, y, k, v) => `<text x="${x}" y="${y}" font-family="Barlow Condensed" font-size="3.9" fill="${GREY}">${k}</text>
    <text x="${x}" y="${y + 4.8}" font-family="Barlow Condensed" font-weight="700" font-size="4.6" fill="${INK}">${v}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">
  ${bg}${borders}
  <rect x="118.5" y="0" width="1" height="297" fill="${INK}"/>
  <image href="${LOGO}" x="47" y="31" width="16" height="16" preserveAspectRatio="xMidYMid meet"/>
  <text transform="translate(132,260) skewX(-14)" font-family="Michroma" font-size="10" textLength="73" lengthAdjust="spacingAndGlyphs" fill="${INK}" stroke="${INK}" stroke-width="0.35">REVUELTO</text>
  ${spec(133, 265.5, 'ENGINE', 'V12 6.5L')}${spec(173, 265.5, 'POWER', '1001 HP')}
  ${spec(133, 279.5, 'TOP SPEED', '&gt;350 KM/H')}${spec(173, 279.5, '0-100 KM/H', '2.5 SECONDS')}
  ${name ? `<text x="105" y="282.8" text-anchor="end" font-family="Syncopate" font-weight="700" font-size="7" textLength="${Math.min(89, 8.9 * name.length)}" lengthAdjust="spacingAndGlyphs" fill="${INK}">${name}</text>` : ''}
  ${date ? `<text x="96" y="289.5" text-anchor="end" font-family="Syncopate" font-size="4.6" textLength="${4.2 * date.length}" lengthAdjust="spacingAndGlyphs" fill="none" stroke="${GREY}" stroke-width="0.22">${date}</text>` : ''}
</svg>`;
}
const html = s => `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Michroma&family=Syncopate:wght@400;700&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet">
<style>*{margin:0}html,body{background:transparent}body{width:210mm;height:297mm;overflow:hidden}svg{display:block}</style></head><body>${s}</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 });
  const slug = NAME.replace(/\s+/g, '-');
  const jobs = [
    [`preview-${slug}`, { name: NAME, date: DATE, mode: 'preview' }],
    [`overlay-${slug}`, { name: NAME, date: DATE, mode: 'overlay' }],
    ['overlay-khong-ten', { name: '', date: '', mode: 'overlay' }],
  ];
  for (const [f, o] of jobs) {
    const s = svg(o);
    await p.setContent(html(s), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${__dirname}/${f}.png`, omitBackground: o.mode === 'overlay' });
    fs.writeFileSync(`${__dirname}/${f}.svg`, s);
  }
  await b.close();
})();
