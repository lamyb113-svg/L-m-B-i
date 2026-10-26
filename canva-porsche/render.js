const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2];
const page_html = (name, showText) => `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Michroma&family=Allison&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0}
body{width:210mm;height:297mm;overflow:hidden}
.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 25% 15%,#F3CDD4 0%,#E9B3BD 55%,#E3A9B4 100%)}
.circle{position:absolute;width:130mm;height:130mm;border-radius:50%;left:15mm;top:5mm;background:rgba(255,255,255,.18)}
.por{position:absolute;left:-6mm;font-family:Michroma;font-size:19mm;line-height:1;letter-spacing:0.5mm;color:transparent;-webkit-text-stroke:0.45mm #fff;white-space:nowrap}
.pan{position:absolute;left:18mm;top:42mm;font-family:Allison;font-size:46mm;color:#C8336A;transform:rotate(-17deg);transform-origin:left center;white-space:nowrap}
.name{position:absolute;left:182mm;top:70mm;font-family:Michroma;font-size:11mm;letter-spacing:5mm;color:transparent;-webkit-text-stroke:0.35mm #fff;writing-mode:vertical-rl;white-space:nowrap;opacity:.95}
</style></head><body>
<div class="bg"></div><div class="circle"></div>
${showText?`<div class="por" style="top:28mm;opacity:.9">PORSCHE</div>
<div class="por" style="top:45mm;opacity:.6">PORSCHE</div>
<div class="por" style="top:62mm;opacity:.3">PORSCHE</div>
<div class="pan">Panamera</div>`:''}
${name?`<div class="name">${name}</div>`:''}
</body></html>`;
(async()=>{
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:794,height:1123},deviceScaleFactor:3.125});
  const jobs=[['nen-full-THAI-VU','THAI VU',1],['nen-khong-ten','',1],['nen-trong','',0]];
  for (const [f,n,t] of jobs){
    await p.setContent(page_html(n,t),{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready);
    await p.screenshot({path:`${out}/${f}.png`});
    await p.pdf({path:`${out}/${f}.pdf`,width:'210mm',height:'297mm',printBackground:true});
  }
  await b.close();
})();
