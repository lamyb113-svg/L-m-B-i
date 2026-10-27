// Dựng nền khung A4 Lamborghini Revuelto (đơn vị mm). Bố cục đo từ ảnh mẫu đã xoay thẳng.
// Dùng: node render.js "THANH LONG" "14/02/2026"
const { chromium } = require('playwright');
const fs = require('fs');
const NAME = (process.argv[2] ?? 'THANH LONG').toUpperCase();
const DATE = process.argv[3] ?? '14/02/2026';
const LOGO = 'data:image/png;base64,' + fs.readFileSync(__dirname + '/lamborghini-logo.png').toString('base64');
const BG = '#F3F3F3', INK = '#2B2B2B', GREY = '#8C8C8C';
// THEME=dark: nửa trái nền đen, tên trắng. Ngày: 2 số đầu + 2 số cuối vàng, giữa trắng (bản đen) / đen (bản trắng)
const DARK = process.env.THEME === 'dark', LEFT_BG = '#161616', GOLD = '#C9A75A';

// Cột ảnh bên phải: x từ L đến R, mỗi ô là đa giác (cạnh chéo theo mẫu)
const L = 123, R = 205, f = t => +(L + t * (R - L)).toFixed(2);
// Ảnh tự điền: đặt file vào canva-lambo/photos/ theo tên ở cột thứ 3 (jpg/png), ảnh được cắt cover theo ô
const SLOTS = [
  ['ẢNH XE 1', [[L, 10], [f(.684), 10], [f(.645), 46], [L, 46]], 'xe1'],
  ['ẢNH XE 2', [[f(.724), 10], [R, 10], [R, 46], [f(.684), 46]], 'xe2'],
  ['ẢNH KHÁCH 1', [[L, 49], [f(.91), 49], [f(.78), 107], [L, 107]], 'khach1'],
  ['XE 3', [[f(.95), 49], [R, 49], [R, 107], [f(.82), 107]], 'xe3'],
  ['ẢNH XE 4', [[L, 110], [R, 110], [R, 201], [L, 201]], 'xe4'],
  ['ẢNH KHÁCH 2', [[L, 204], [f(.63), 204], [f(.745), 248], [L, 248]], 'khach2'],
  ['ẢNH XE 5', [[f(.67), 204], [R, 204], [R, 248], [f(.785), 248]], 'xe5'],
];
const photo = n => {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const fp = `${__dirname}/photos/${n}.${ext}`;
    if (fs.existsSync(fp)) return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,` + fs.readFileSync(fp).toString('base64');
  }
};
const bbox = p => { const xs = p.map(q => q[0]), ys = p.map(q => q[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; };
const pts = p => p.map(q => q.join(',')).join(' ');
const centroid = p => p.reduce((a, q) => [a[0] + q[0] / p.length, a[1] + q[1] / p.length], [0, 0]);

function svg({ name, date, mode }) { // mode: 'preview' (ô xám có nhãn) | 'overlay' (ô trong suốt)
  const photos = SLOTS.map(([, p, n], i) => {
    const src = photo(n); if (!src) return '';
    const [x, y, w, h] = bbox(p);
    return `<clipPath id="s${i}"><polygon points="${pts(p)}"/></clipPath><image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#s${i})"/>`;
  }).join('');
  const holes = SLOTS.filter(([, , n]) => !photo(n)).map(([, p]) => `<polygon points="${pts(p)}" fill="#000"/>`).join('');
  const bg = mode === 'overlay'
    ? `<mask id="m"><rect width="210" height="297" fill="#fff"/>${holes}</mask><rect width="210" height="297" fill="${BG}" mask="url(#m)"/>`
    : `<rect width="210" height="297" fill="${BG}"/>` + SLOTS.map(([t, p, n]) => {
        if (photo(n)) return '';
        const [cx, cy] = centroid(p);
        return `<polygon points="${pts(p)}" fill="#CFCFCF"/><text x="${cx}" y="${cy + 1.2}" text-anchor="middle" font-family="Barlow Condensed" font-weight="600" font-size="3.6" fill="#888">${t}</text>`;
      }).join('');
  const borders = SLOTS.map(([, p]) => `<polygon points="${pts(p)}" fill="none" stroke="${INK}" stroke-width="0.45"/>`).join('');
  const spec = (x, y, k, v) => `<text x="${x}" y="${y}" font-family="Barlow Condensed" font-size="3.9" fill="${GREY}">${k}</text>
    <text x="${x}" y="${y + 4.8}" font-family="Barlow Condensed" font-weight="700" font-size="4.6" fill="${INK}">${v}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">
  <g data-layer="nen-va-o-anh">${bg}${photos}</g><g data-layer="vien-o-anh">${borders}</g>
  ${DARK ? `<rect data-layer="nen-den-trai" x="0" y="0" width="119" height="297" fill="${LEFT_BG}"/>` : ''}
  <rect data-layer="duong-ke-doc" x="118.5" y="0" width="1" height="297" fill="${INK}"/>
  <image data-layer="logo-lamborghini" href="${LOGO}" x="47" y="31" width="16" height="16" preserveAspectRatio="xMidYMid meet"/>
  <text data-layer="chu-revuelto" transform="translate(132,260) skewX(-14)" font-family="Michroma" font-size="10" textLength="73" lengthAdjust="spacingAndGlyphs" fill="${INK}" stroke="${INK}" stroke-width="0.35">REVUELTO</text>
  <g data-layer="thong-so">${spec(133, 265.5, 'ENGINE', 'V12 6.5L')}${spec(173, 265.5, 'POWER', '1001 HP')}
  ${spec(133, 279.5, 'TOP SPEED', '&gt;350 KM/H')}${spec(173, 279.5, '0-100 KM/H', '2.5 SECONDS')}</g>
  ${name ? `<text data-layer="ten-khach" x="105" y="282.8" text-anchor="end" font-family="Syncopate" font-weight="700" font-size="7" textLength="${Math.min(89, 8.9 * name.length)}" lengthAdjust="spacingAndGlyphs" fill="${DARK ? '#FFFFFF' : INK}">${name}</text>` : ''}
  ${date ? `<text data-layer="ngay" x="96" y="289.5" text-anchor="end" font-family="Syncopate" font-size="4.6" textLength="${4.2 * date.length}" lengthAdjust="spacingAndGlyphs" fill="${DARK ? '#FFFFFF' : INK}"><tspan fill="${GOLD}">${date.slice(0, 2)}</tspan>${date.slice(2, -2)}<tspan fill="${GOLD}">${date.slice(-2)}</tspan></text>` : ''}
</svg>`;
}
const html = s => `<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Michroma&family=Syncopate:wght@400;700&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet">
<style>*{margin:0}html,body{background:transparent}body{width:210mm;height:297mm;overflow:hidden}svg{display:block}</style></head><body>${s}</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 });
  if (process.env.LAYERS) { await require('../layers-lib.js')(p, html(svg({ name: NAME, date: DATE, mode: 'overlay' })), process.env.LAYERS); return b.close(); }
  const slug = NAME.replace(/\s+/g, '-') + (DARK ? '-dark' : '');
  const jobs = [
    [`preview-${slug}`, { name: NAME, date: DATE, mode: 'preview' }],
    [`overlay-${slug}`, { name: NAME, date: DATE, mode: 'overlay' }],
    [DARK ? 'overlay-khong-ten-dark' : 'overlay-khong-ten', { name: '', date: '', mode: 'overlay' }],
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
