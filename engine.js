// ============================================================
//  LILLA STADEN — motor
//  Sex platser, en gubbe, inga förluster. Scenerna ligger i scener.js
// ============================================================

const W = 1000, H = 700;
const VIEW = { s: 1, ox: 0, oy: 0 };
const sx = x => VIEW.ox + x * VIEW.s;
const sy = y => VIEW.oy + y * VIEW.s;

const PAL = {
  cream: '#fdf3e7', wall: '#f8e7d6',
  ink: '#4a3f39', dim: '#a08e80',
  mint: '#8fd8c6', mintDark: '#63bda8',
  blush: '#f2a0b4', coral: '#ef8064', amber: '#f7c948',
  sky: '#7fa8c9', lilac: '#b79ce0',
  panel: '#fffaf3', panelShade: '#f1e0cf',
};

const G = {
  scene: 'dentist', stars: 0, mood: 'idle', moodT: 0,
  soundOn: true, parts: [], hearts: [], toast: '', toastT: 0,
  blinkAt: 1500, menu: false, menuRects: [], help: false, helpRects: [],
  helpPanel: null, swipeStart: null, lastAct: 0, lastTouch: null,
  demo: null, demoPending: false, demoDone: {}, intro: false,
  dayDone: null, fade: 0, seen: {}, album: false, albumPanel: null,
  albumClose: null, albumGrid: [], newSticker: null, lastUp: 0,
  flash: 0, albumTab: 'stickers', photoBig: null, photos: [], photoRects: [], albumTabs: [],
  pose: 0, poseT: 0, mascotHit: null, photoBtns: [], frameOn: {}, holding: false,
};

const SCENES = {};
const SCENE_META = [];
const LADDER = [];
const DEMOS = {};
const HINTS = {};

// ------------------------------------------------------------
//  små hjälpare
// ------------------------------------------------------------
function fillA(hex, a) { const c = color(hex); c.setAlpha(a); fill(c); }
function strokeA(hex, a) { const c = color(hex); c.setAlpha(a); stroke(c); }
function inRect(p, r) { return p.x > r.x && p.x < r.x + r.w && p.y > r.y && p.y < r.y + r.h; }
function clampv(v, a, b) { return v < a ? a : v > b ? b : v; }
function easeOut(p) { return 1 - (1 - p) * (1 - p); }

function starShape(x, y, r1, r2, n) {
  n = n || 5;
  push(); translate(x, y); beginShape();
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? r2 : r1, a = -PI / 2 + i * PI / n;
    vertex(cos(a) * r, sin(a) * r);
  }
  endShape(CLOSE); pop();
}

function heartShape(x, y, s) {
  push(); translate(x, y); noStroke(); beginShape();
  vertex(0, s * 0.42);
  bezierVertex(-s * 1.05, -s * 0.34, -s * 0.42, -s * 1.02, 0, -s * 0.32);
  bezierVertex(s * 0.42, -s * 1.02, s * 1.05, -s * 0.34, 0, s * 0.42);
  endShape(CLOSE); pop();
}

function setMood(m, ms) { G.mood = m; G.moodT = ms || 1600; }
function toast(msg, ms) { G.toast = msg; G.toastT = ms || 1600; }

// ------------------------------------------------------------
//  ljud — allt syntas, inga filer
// ------------------------------------------------------------
let actx = null, noiseBuf = null;
function unlockAudio() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.4, actx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { actx = null; }
  } else if (actx.state === 'suspended') actx.resume();
}
function tone(freq, dur, type, vol, delay, slide) {
  if (!actx) return;
  try {
    const t0 = actx.currentTime + (delay || 0);
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.05, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(actx.destination);
    o.start(t0); o.stop(t0 + dur + 0.03);
  } catch (e) {}
}
function noiseHit(dur, freq, vol, delay, q) {
  if (!actx || !noiseBuf) return;
  try {
    const t0 = actx.currentTime + (delay || 0);
    const src = actx.createBufferSource();
    src.buffer = noiseBuf;
    const bp = actx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = freq || 1500; bp.Q.value = q || 1.1;
    const g = actx.createGain();
    g.gain.setValueAtTime(vol || 0.05, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp).connect(g).connect(actx.destination);
    src.start(t0); src.stop(t0 + dur + 0.03);
  } catch (e) {}
}

const sfx = {
  pling() { tone(1180, 0.45, 'sine', 0.06); tone(1760, 0.35, 'sine', 0.03, 0.02); },
  pickup() { tone(560, 0.08, 'sine', 0.04, 0, 760); },
  drop() { tone(220, 0.12, 'sine', 0.05, 0, 140); noiseHit(0.05, 500, 0.03); },
  good() { tone(660, 0.1, 'triangle', 0.05); tone(880, 0.12, 'triangle', 0.05, 0.09); tone(1180, 0.16, 'triangle', 0.045, 0.19); },
  bad() { tone(280, 0.18, 'sawtooth', 0.035, 0, 190); },
  drill() { noiseHit(0.12, 2200, 0.035, 0, 2.2); tone(150, 0.12, 'sawtooth', 0.02, 0, 220); },
  snip() { noiseHit(0.05, 3400, 0.05, 0, 2.4); tone(900, 0.05, 'triangle', asNum(0.02), 0.02, 700); },
  splash() { noiseHit(0.18, 900, 0.05, 0, 0.8); },
  pop() { tone(700, 0.07, 'sine', 0.05, 0, 1100); },
  whoosh() { noiseHit(0.25, 700, 0.04, 0, 0.6); },
  heartbeat() { tone(58, 0.14, 'sine', 0.12); tone(48, 0.16, 'sine', 0.1, 0.18); },
  giggle() { tone(880, 0.08, 'triangle', 0.04); tone(1180, 0.08, 'triangle', 0.04, 0.09); tone(980, 0.1, 'triangle', 0.035, 0.18); },
  sparkle() { tone(1400, 0.12, 'sine', 0.03); tone(1900, 0.1, 'sine', 0.025, 0.06); },
  bark() { tone(320, 0.1, 'square', 0.035, 0, 180); tone(280, 0.1, 'square', 0.03, 0.12, 160); },
  chalk() { noiseHit(0.09, 2600, 0.04, 0, 1.6); },
};
function asNum(v) { return v; }// ------------------------------------------------------------
//  FOTON — kameran sparar bilder i spelarens webbläsare
// ------------------------------------------------------------
const photoImgs = {};
const PHOTO_MAX = 8;
let PHOTOS = (function () {
  try {
    const raw = localStorage.getItem('lilla-staden-bilder');
    const a = raw ? JSON.parse(raw) : [];
    return Array.isArray(a) ? a.slice(0, PHOTO_MAX) : [];
  } catch (e) { return []; }
})();
function photoImg(url) {
  if (!photoImgs[url]) {
    const im = new Image();
    im.src = url;
    photoImgs[url] = im;
  }
  return photoImgs[url];
}
function takePhoto() {
  try {
    const c = drawingContext.canvas;
    const w = 360, h = Math.max(1, Math.round(w * c.height / c.width));
    const tc = document.createElement('canvas');
    tc.width = w; tc.height = h;
    const g2 = tc.getContext('2d');
    g2.drawImage(c, 0, 0, w, h);
    const portrait = G.pose > 0;
    if (portrait) {
      // vit ram med hjärtan och namn
      g2.fillStyle = 'rgba(255,255,255,0.94)';
      g2.fillRect(0, 0, w, h);
      g2.drawImage(c, 8, 8, w - 16, h - 16);
      g2.fillStyle = '#f2a0b4';
      for (let i = 0; i < 5; i++) {
        const hx = 16 + i * 12, hy = h - 20;
        g2.beginPath();
        g2.arc(hx,    hy, 4, 0, Math.PI * 1.05);
        g2.arc(hx + 8, hy, 4, Math.PI * 1.95, Math.PI * 2.05);
        g2.lineTo(hx + 4, hy + 9);
        g2.closePath(); g2.fill();
      }
      g2.fillStyle   =  	'#4a3f39';
      g2.font = 'bold 15px sans-serif';
      g2.fillText('ENZO', w - 62, h - 12);
    }
    const url = tc.toDataURL('image/jpeg', 0.62);
    PHOTOS.unshift(url);
    while (PHOTOS.length > PHOTO_MAX) PHOTOS.pop();
    try { localStorage.setItem('lilla-staden-bilder', JSON.stringify(PHOTOS)); } catch (e) {}
    G.flash = 1;
    sfx.snip(); setTimeout(function () { sfx.good(); }, 90);
    toast(portrait ? 'PORTRÄTT SPARAT' : 'BILD SPARAD', 1300);
    burst(W - 300, 60, ['#ffffff', '#f7c948'], 10, 0.9);
    if (portrait) { setMood('happy', 2200); addHearts(W / 2, 300, 3); }
  } catch (e) {}
}

function shareImage(url, name) {
  try {
    const a = document.createElement('a');
    a.href = url; a.download = name + '.jpg';
    document.body.appendChild(a); a.click(); a.remove();
    toast('BILDEN SPARAD', 1400);
    return;
  } catch (e) {}
}
function albumShare(i) {
  const url = PHOTOS[i];
  if (!url) return;
  fetch(url).then(function (r) { return r.blob(); }).then(function (blob) {
    const file = new File([blob], 'lilla-staden.jpg', { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      return navigator.share({ files: [file], title: 'Lilla Staden' });
    }
    shareImage(url, 'lilla-staden');
  }).catch(function () { shareImage(url, 'lilla-staden'); });
}

// ------------------------------------------------------------
//  vykort — ett foto med ram, hälsning och frimärke
// ------------------------------------------------------------
function makePostcard(i) {
  const src = PHOTOS[i];
  if (!src) return;
  const im = photoImg(src);
  const go = function () {
    const pw = 760, ph = 520;
    const c = document.createElement('canvas');
    c.width = pw; c.height = ph;
    const x = c.getContext('2d');
    x.fillStyle = '#f6ead8'; x.fillRect(0, 0, pw, ph);
    // foto
    x.fillStyle = '#ffffff';
    x.fillRect(36, 36, 420, 340);
    if (im.naturalWidth) x.drawImage(im, 44, 44, 404, 324);
    // text
    const meta = SCENE_META.filter(function (m) { return m.id === G.scene; })[0];
    x.fillStyle = '#4a3f39';
    x.font = 'bold 30px Georgia, serif';
    x.fillText('Hälsningar från', 46, 412);
    x.font = 'bold 34px Georgia, serif';
    x.fillStyle = '#1f6b58';
    x.fillText(meta ? meta.label : 'Lilla Staden', 46, 452);
    x.fillStyle = '#6d6259'; x.font = '20px Georgia, serif';
    x.fillText('Lilla Staden · ' + (meta ? meta.desc : ''), 46, 484);
    // frimärke
    x.fillStyle = '#ffffff'; x.fillRect(486, 36, 224, 250);
    x.strokeStyle = '#d8c7ad'; x.lineWidth = 2; x.setLineDash([6, 5]);
    x.strokeRect(492, 42, 212, 238); x.setLineDash([]);
    x.fillStyle = '#8fd8c6'; x.fillRect(506, 56, 184, 120);
    x.fillStyle = '#f7c948'; x.beginPath(); x.arc(598, 116, 40, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#4a3f39'; x.font = 'bold 13px sans-serif';
    x.fillText('SVERIGE', 566, 200);
    x.font = '11px sans-serif'; x.fillText('LILLA STADEN', 556, 220);
    // linjer för adress
    x.strokeStyle = '#cbbca8'; x.lineWidth = 2;
    for (let k = 0; k < 4; k++) {
      x.beginPath(); x.moveTo(500, 320 + k * 46); x.lineTo(704, 320 + k * 46); x.stroke();
    }
    // hjärtan
    x.fillStyle = '#f2a0b4';
    for (let k = 0; k < 3; k++) {
      const hx = 500 + k * 26, hy = 470;
      x.beginPath();
      x.arc(hx, hy, 9, 0, Math.PI * 1.05);
      x.arc(hx + 18, hy, 9, Math.PI * 1.95, Math.PI * 2.05);
      x.lineTo(hx + 9, hy + 20);
      x.closePath(); x.fill();
    }
    const url = c.toDataURL('image/jpeg', 0.72);
    PHOTOS.unshift(url);
    while (PHOTOS.length > PHOTO_MAX) PHOTOS.pop();
    try { localStorage.setItem('lilla-staden-bilder', JSON.stringify(PHOTOS)); } catch (e) {}
    G.photoBig = 0; G.frameOn[0] = true;
    sfx.good(); toast('VYKORT KLART!', 1500);
    burst(W / 2, 200, ['#f2a0b4', '#ffffff', '#8fd8c6'], 16, 1.1);
  };
  if (im.complete && im.naturalWidth) go();
  else { im.onload = go; }
}

// ------------------------------------------------------------
//  rösten — inlästa filer, talsyntes som reserv
// ------------------------------------------------------------
const SAY_FILES = {
  'Välj borr och borra bort sockerfläckarna.': 'roster/say-dentist.mp3',
  'Släck elden, res katten och sätt på hjälmen.': 'roster/say-brand.mp3',
  'Mjölka kon, borsta hästen och samla äggen.': 'roster/say-farm.mp3',
  'Håva fisk, lägg den i hinken och mata måsen.': 'roster/say-fiske.mp3',
  'Klipp håret och välj en färg.': 'roster/say-hairdresser.mp3',
  'Lyssna på hjärtat och sätt på ett plåster.': 'roster/say-doctor.mp3',
  'Lägg formerna på rätt plats.': 'roster/say-school.mp3',
  'Bygg ett torn av klossarna.': 'roster/say-fritids.mp3',
  'Tvätta hunden och sätt på ett plåster.': 'roster/say-vet.mp3',
  'Kavla degen, välj fyllning och grädda bullen.': 'roster/say-bageri.mp3',
  'Öppna dörren och kör till nästa hållplats.': 'roster/say-buss.mp3',
  'Sätt böckerna på rätt hylla och läs en bok.': 'roster/say-bibliotek.mp3',
  'Kavla botten, sleva på sås och grädda pizzan.': 'roster/say-pizzeria.mp3',
  'Sätt ankorna i dammen, bygg ett slott och gunga.': 'roster/say-park.mp3',
  'Rent och fint!': 'roster/say-rent.mp3',
  'Så fint det blev!': 'roster/say-fint.mp3',
  'Allt ser bra ut!': 'roster/say-friskt.mp3',
  'Vad duktig du är!': 'roster/say-duktig.mp3',
  'Vilket högt torn!': 'roster/say-torn.mp3',
  'Vilken glad hund!': 'roster/say-hund.mp3',
  'Nygräddad bulle!': 'roster/say-bulle.mp3',
  'Vilken bra busschaufför du är!': 'roster/say-bussforare.mp3',
  'Vilken god pizza!': 'roster/say-pizza.mp3',
  'Vilken bra bok!': 'roster/say-bok.mp3',
  'Vilken brandman du är!': 'roster/say-brandman.mp3',
  'Vilken duktig bonde du är!': 'roster/say-bonde.mp3',
  'Vilken fiskelycka!': 'roster/say-fiskelycka.mp3',
  'Katten är räddad!': 'roster/say-katt.mp3',
};
const sayAudio = {};
function speak(text) {
  if (!G.soundOn || !text) return;
  const file = SAY_FILES[text];
  if (file) {
    try {
      let a = sayAudio[file];
      if (!a) { a = new Audio(file); a.preload = 'auto'; a.volume = 0.95; sayAudio[file] = a; }
      a.pause(); a.currentTime = 0;
      const pr = a.play();
      if (pr && pr.catch) pr.catch(function () { speakSynth(text); });
      return;
    } catch (e) {}
  }
  speakSynth(text);
}
function speakSynth(text) {
  if (!G.soundOn || !text) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'sv-SE'; u.rate = 0.92; u.pitch = 1.08;
    const vs = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const sv = vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf('sv') === 0; })[0];
    if (sv) u.voice = sv;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
function loadSound() {
  try { return localStorage.getItem('lilla-staden-ljud') !== '0'; } catch (e) { return true; }
}
function saveSound() {
  try { localStorage.setItem('lilla-staden-ljud', G.soundOn ? '1' : '0'); } catch (e) {}
}

// ------------------------------------------------------------
//  KLISTERMÄRKEN — ett per två stjärnor
// ------------------------------------------------------------
const STICKERS = [
  { kind: 'tooth', col: '#ffffff' },
  { kind: 'scissors', col: '#8fd8c6' },
  { kind: 'heart', col: '#f2a0b4' },
  { kind: 'pencil', col: '#f7c948' },
  { kind: 'block', col: '#ef8064' },
  { kind: 'paw', col: '#b79ce0' },
  { kind: 'star', col: '#f7c948' },
  { kind: 'flower', col: '#f2a0b4' },
  { kind: 'car', col: '#7fa8c9' },
  { kind: 'cat', col: '#c3b4a4' },
  { kind: 'cake', col: '#f2b06a' },
  { kind: 'crown', col: '#f7c948' },
];
const STICKER_EVERY = 2;

let STICK = (function () {
  try {
    const v = parseInt(localStorage.getItem('lilla-staden-stjarnor') || '0', 10);
    if (!isNaN(v) && v >= 0) return { total: v };
  } catch (e) {}
  return { total: 0 };
})();
function saveStickerStars() {
  try { localStorage.setItem('lilla-staden-stjarnor', String(STICK.total)); } catch (e) {}
}
function stickerCount() { return min(STICKERS.length, floor(STICK.total / STICKER_EVERY)); }
// stjärnorna räknas vidare efter omladdning
G.stars = STICK.total;

// ------------------------------------------------------------
//  BESÖKEN — sex platser i ordning
// ------------------------------------------------------------
function loadVisit() {
  try {
    const raw = localStorage.getItem('lilla-staden-besok');
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.step === 'number') return p;
    }
  } catch (e) {}
  return { step: 0, count: 0, finished: false, started: false };
}
function saveVisit() {
  try { localStorage.setItem('lilla-staden-besok', JSON.stringify(VISIT)); } catch (e) {}
}
let VISIT = loadVisit();
function visitLevel() { return LADDER[min(VISIT.step, LADDER.length - 1)]; }

function gainStar(n) {
  n = n || 1;
  G.stars += n;
  const before = stickerCount();
  STICK.total += n;
  saveStickerStars();
  if (stickerCount() > before) {
    G.newSticker = { i: stickerCount() - 1, t: 2600 };
    sfx.sparkle();
    setTimeout(function () { sfx.pling(); }, 200);
    toast('Nytt klistermärke!', 1600);
  }
  if (VISIT.started && !VISIT.finished && !G.dayDone) {
    const lv = visitLevel();
    if (lv && G.scene === lv.id) {
      VISIT.count += n;
      saveVisit();
      if (VISIT.count >= lv.need) openDayDone();
    }
  }
}

function openDayDone() {
  VISIT.count = visitLevel().need;
  saveVisit();
  G.dayDone = { last: VISIT.step >= LADDER.length - 1 };
  G.help = false; G.menu = false; G.album = false;
  sfx.good();
  setTimeout(function () { sfx.pling(); }, 260);
  setMood('happy', 2400);
  addHearts(W / 2, 250, 5);
  burst(W / 2, 240, ['#f7c948', '#8fd8c6', '#f2a0b4', '#ffffff'], 24, 1.3);
}

function startVisit() {
  const lv = visitLevel();
  if (!lv) return;
  G.intro = false; G.dayDone = null;
  VISIT.started = true;
  saveVisit();
  switchScene(lv.id);
  resetScene(lv.id);
  G.help = true;
}

function nextVisit() {
  if (G.dayDone && G.dayDone.last) {
    VISIT.finished = true; VISIT.count = 0;
    saveVisit();
    G.dayDone = null; G.menu = true;
    return;
  }
  VISIT.step = min(VISIT.step + 1, LADDER.length - 1);
  VISIT.count = 0;
  saveVisit();
  G.dayDone = null;
  switchScene(visitLevel().id);
  resetScene(visitLevel().id);
  G.help = true;
}// ------------------------------------------------------------
//  partiklar och hjärtan
// ------------------------------------------------------------
function burst(x, y, cols, n, spd) {
  for (let i = 0; i < (n || 14); i++) {
    const a = random(TAU), v = random(1.2, 3.4) * (spd || 1);
    G.parts.push({
      x: x, y: y, vx: cos(a) * v, vy: sin(a) * v - 1.2,
      r: random(4, 9), life: 1, col: cols[i % cols.length], spin: random(-0.2, 0.2),
    });
  }
}
function updateParts() {
  for (let i = G.parts.length - 1; i >= 0; i--) {
    const p = G.parts[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.vx *= 0.99;
    p.life -= 0.016;
    if (p.life <= 0) { G.parts.splice(i, 1); continue; }
    push(); translate(p.x, p.y); rotate(p.spin * (1 - p.life));
    noStroke(); fillA(p.col, 235 * p.life);
    if (p.square) rect(-p.r / 2, -p.r / 2, p.r, p.r, 2);
    else ellipse(0, 0, p.r, p.r);
    pop();
  }
}
function addHearts(x, y, n) {
  for (let i = 0; i < (n || 2); i++) {
    G.hearts.push({
      x: x + random(-28, 28), y: y + random(-12, 12),
      s: random(9, 15), life: 1, seed: random(10),
      col: random(['#f2a0b4', '#ef8064', '#f7c948']),
    });
  }
}
function updateHearts(t) {
  for (let i = G.hearts.length - 1; i >= 0; i--) {
    const h = G.hearts[i];
    h.y -= 0.8; h.x += sin(t * 3 + h.seed) * 0.8;
    h.life -= 0.009;
    if (h.life <= 0) { G.hearts.splice(i, 1); continue; }
    fillA(h.col, h.life * 235);
    heartShape(h.x, h.y, h.s);
  }
}

// ------------------------------------------------------------
//  ENZO — samma gubbe i alla scener
// ------------------------------------------------------------
function drawMascot(x, y, sc, t, opts) {
  opts = opts || {};
  const bob = sin(t * 1.6) * 2.2;
  push();
  translate(x, y + bob);
  scale(sc);
  const mood = G.mood;
  noStroke();
  fillA('#000000', 24);
  ellipse(0, 84, 130, 26);
  fill('#7bcbb6'); ellipse(3, 4, 168, 176);
  fill(PAL.mint); ellipse(0, 0, 168, 176);
  const outfit = opts.outfit || '';
  const apronCols = {
    baker: '#fffaf4', vet: '#cdeee0', doctor: '#ffffff', teacher: '#e6eefb',
    hairdresser: '#fde3ec', driver: '#dfeafb', librarian: '#efe6fb', dentist: '#e6f7f3',
  };
  fill(apronCols[outfit] || '#fff6ec');
  beginShape();
  vertex(-44, 26); vertex(44, 26); vertex(54, 86); vertex(-54, 86);
  endShape(CLOSE);
  if (outfit === 'baker') {
    fill('#f2e6d8');
    for (let i = 0; i < 3; i++) ellipse(-30 + i * 30, 72, 9, 9);
  }
  fill('#f3e1cf'); rect(-15, 30, 30, 8, 4);
  fill('#ffffff'); rect(-32, 44, 64, 18, 5);
  fill(PAL.ink); textAlign(CENTER, CENTER); textSize(9.5);
  text('ENZO', 0, 53);
  if (opts.pose) {
    push(); translate(-70, -6); rotate(-0.55); fill('#7bcbb6'); ellipse(0, 0, 48, 30); pop();
    push(); translate(70, -6); rotate(0.55); fill('#7bcbb6'); ellipse(0, 0, 48, 30); pop();
  } else {
    fill('#7bcbb6'); ellipse(-76, 34, 48, 30); ellipse(76, 34, 48, 30);
  }
  if (opts.hat === 'baker') {
    fill('#fffaf4'); rect(-46, -98, 92, 22, 10);
    ellipse(-30, -112, 46, 40); ellipse(0, -120, 50, 46); ellipse(30, -112, 46, 40);
    fill('#efe3d6'); rect(-46, -84, 92, 5, 2);
  } else if (opts.hat === 'driver') {
    fill('#5b8fa8'); arc(0, -84, 106, 58, PI, TAU); rect(-52, -86, 104, 12, 6);
    fill('#3f6f86'); rect(-52, -78, 104, 4, 2);
    fill('#f7c948'); ellipse(0, -98, 12, 8);
  } else if (opts.hat === 'chef') {
    fill('#fffaf4'); rect(-46, -92, 92, 20, 9);
    ellipse(-26, -104, 50, 44); ellipse(26, -104, 50, 44); ellipse(0, -114, 56, 46);
    fill('#efe3d6'); rect(-46, -80, 92, 4, 2);
  } else if (opts.hat === 'cap') {
    fill('#ef8064'); arc(0, -84, 108, 60, PI, TAU); rect(-54, -86, 108, 12, 6);
    fill('#d96b50'); rect(-54, -78, 108, 4, 2);
  } else {
    fill('#f0a24c'); arc(0, -84, 108, 60, PI, TAU); rect(-54, -86, 108, 12, 6);
    fill('#d9843a'); rect(-54, -78, 108, 4, 2);
    fill('#ffffff'); ellipse(0, -104, 12, 8);
  }
  fillA(PAL.blush, 150); ellipse(-44, 12, 26, 16); ellipse(44, 12, 26, 16);
  if (outfit === 'librarian' || outfit === 'teacher') {
    noFill(); stroke('#4a3f39'); strokeWeight(3.2);
    ellipse(-30, -14, 34, 28); ellipse(30, -14, 34, 28);
    line(-13, -14, 13, -14); line(-47, -16, -58, -22); line(47, -16, 58, -22);
    noStroke();
  }
  const blink = millis() > G.blinkAt;
  if (blink && millis() > G.blinkAt + 130) G.blinkAt = millis() + random(1800, 4200);
  for (const sgn of [-1, 1]) {
    const ex = sgn * 30, ey = -14;
    if (blink || mood === 'yuck') {
      stroke(PAL.ink); strokeWeight(4); noFill(); arc(ex, ey, 26, 20, PI * 1.1, PI * 1.9); noStroke();
    } else {
      fill('#ffffff'); ellipse(ex, ey, 30, 32);
      fill(PAL.ink); ellipse(ex, ey, 14, 16);
      fillA('#ffffff', 210); ellipse(ex - 3, ey - 4, 5, 5);
    }
  }
  stroke(PAL.ink); strokeWeight(2.6); noFill();
  if (mood === 'happy') {
    arc(-30, -32, 24, 12, PI * 1.15, PI * 1.85);
    arc(30, -32, 24, 12, PI * 1.15, PI * 1.85);
  } else {
    line(-40, -31, -20, -31); line(40, -31, 20, -31);
  }
  noStroke();
  if (mood === 'happy') {
    fill('#5b3a32'); arc(0, 22, 42, 34, 0, PI);
    fill('#e0707a'); arc(0, 26, 24, 15, 0, PI);
  } else {
    stroke(PAL.ink); strokeWeight(3.4); noFill();
    arc(0, 22, 34, 20, PI * 0.1, PI * 0.9); noStroke();
  }
  if (outfit === 'dentist') {
    fill('#ffffff'); strokeA('#cfe4dd', 255); strokeWeight(2);
    beginShape();
    vertex(-40, 4); vertex(40, 4); vertex(34, 40); vertex(-34, 40);
    endShape(CLOSE);
    fillA('#dff0f5', 120); rect(-30, 12, 20, 8, 4);
    noStroke();
  }
  pop();
}

// ------------------------------------------------------------
//  setup / layout
// ------------------------------------------------------------
let __safeEl = null;
function safeInsets() {
  try {
    if (!__safeEl) {
      __safeEl = document.createElement('div');
      __safeEl.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;' +
        'pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) ' +
        'env(safe-area-inset-bottom) env(safe-area-inset-left);';
      document.body.appendChild(__safeEl);
    }
    const cs = getComputedStyle(__safeEl);
    return {
      t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0,
      b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0,
    };
  } catch (e) { return { t: 0, r: 0, b: 0, l: 0 }; }
}
function layout() {
  const ins = safeInsets();
  const aw = max(1, width - ins.l - ins.r), ah = max(1, height - ins.t - ins.b);
  VIEW.s = min(aw / W, ah / H);
  VIEW.ox = ins.l + (aw - W * VIEW.s) / 2;
  VIEW.oy = ins.t + (ah - H * VIEW.s) / 2;
}
function setup() {
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));
  createCanvas(windowWidth, windowHeight);
  layout();
  textFont('Verdana, Geneva, sans-serif');
  G.soundOn = loadSound();
  if (!VISIT.started) { G.intro = true; G.help = false; }
  else if (!VISIT.finished) { G.scene = visitLevel().id; G.seen[G.scene] = true; }
  G.blinkAt = millis() + 2200;
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); layout(); }

function resetScene(id) {
  const s = SCENES[id];
  if (s && s.reset) { s.reset(); s.__inited = true; }
}
function switchScene(id) {
  G.menu = false; G.fade = 1;
  if (G.scene === id) return;
  // har platsen redan klarat sin dag? då börjar den om
  const lv = LADDER.filter(function (l) { return l.id === id; })[0];
  if (lv && VISIT.started && !VISIT.finished && VISIT.count >= lv.need) {
    VISIT.count = 0; saveVisit(); resetScene(id);
  }
  G.scene = id; G.demo = null; G.album = false;
  sfx.sparkle();
  setMood('happy', 700);
  if (!G.seen[id]) {
    G.seen[id] = true; G.help = true; G.demoPending = true;
    const mm = SCENE_META.filter(function (x) { return x.id === id; })[0];
    if (mm && mm.say) speak(mm.say);
  }
}// ------------------------------------------------------------
//  rita allt
// ------------------------------------------------------------
function draw() {
  const t = millis() / 1000;
  if (G.moodT > 0) { G.moodT -= deltaTime; if (G.moodT <= 0) G.mood = 'idle'; }
  if (G.toastT > 0) G.toastT -= deltaTime;

  const sc = SCENES[G.scene] || SCENES[SCENE_META[0].id];
  if (!sc) return;

  const bandX = width - W * VIEW.s, bandY = height - H * VIEW.s;
  noStroke();
  if (bandX > 60 || bandY > 60) {
    push();
    fill('#efe2d2'); rect(0, 0, width, height);
    fill('#fdf3e7');
    rect(VIEW.ox - 14, VIEW.oy - 14, W * VIEW.s + 28, H * VIEW.s + 28, 22);
    pop();
  }

  push();
  translate(VIEW.ox, VIEW.oy);
  scale(VIEW.s);
  try {
    if (!sc.__inited) { sc.__inited = true; if (sc.reset) sc.reset(); }
    sc.draw(t);
    if (sc.update) sc.update(t);
    updateParts();
    updateHearts(t);
    drawHint();
    drawDemo(t);
    const m = sc.mascot ? sc.mascot() : { x: 900, y: 600, s: 0.8, hat: 'cap' };
    if (G.pose > 0) G.pose = max(0, G.pose - deltaTime / 1000);
    G.mascotHit = m ? { x: m.x, y: m.y - 52 * m.s, r: 62 * m.s } : null;
    if (m) {
    const OUT = {
      dentist: 'dentist', hairdresser: 'hairdresser', doctor: 'doctor', school: 'teacher',
      fritids: '', vet: 'vet', bakery: 'baker', bus: 'driver', library: 'librarian',
    };
    fillA('#000000', 34); ellipse(m.x, m.y + 4, 78 * m.s, 18 * m.s);
    drawMascot(m.x, m.y, m.s, t, { hat: m.hat, outfit: m.outfit || OUT[G.scene] || '', pose: G.pose > 0 });
    if (G.pose > 0) {
      for (let i = 0; i < 3; i++) {
        const a = t * 3 + i * 2.1;
        fillA('#f2a0b4', 200); heartShape(m.x + cos(a) * 70 * m.s, m.y - 130 * m.s + sin(a) * 14, 7);
      }
    }
    }
    drawHUD(t);
  } catch (e) {
    if (!window.__sceneErr) window.__sceneErr = e.message + ' :: ' + String(e.stack || '').split('\n').slice(0, 4).join(' ~ ');
  } finally {
    pop();
  }

  drawRotateGuard();
}

function drawRotateGuard() {
  if (width > 620 || width >= height) return;
  push();
  noStroke(); fill('#fdf3e7'); rect(0, 0, width, height);
  translate(width / 2, height / 2 - 40); rotate(-PI / 2);
  fill('#8fd8c6'); rect(-52, -70, 104, 140, 18);
  fill('#ffffff'); rect(-41, -59, 82, 118, 12);
  fill('#f7c948'); starShape(0, -4, 20, 8);
  fill('#4a3f39'); ellipse(0, 48, 8, 8);
  pop();
  noStroke(); fill('#4a3f39');
  textAlign(CENTER, CENTER); textSize(19);
  text('Vänd på iPaden', width / 2, height / 2 + 78);
  fillA('#a08e80', 255); textSize(12);
  text('spelet är gjort för iPad', width / 2, height / 2 + 104);
}

// ------------------------------------------------------------
//  pekhjälp + demonstration
// ------------------------------------------------------------
function drawHint() {
  if (G.dragAny || G.menu || G.help || G.intro || G.dayDone || G.album) return;
  if (millis() - (G.lastAct || 0) < 2800) return;
  const f = HINTS[G.scene];
  if (!f) return;
  let h = null;
  try { h = f(); } catch (e) { return; }
  if (!h) return;
  const pulse = 0.5 + 0.5 * sin(millis() / 260);
  noFill();
  strokeA('#ffffff', 120 + pulse * 90);
  strokeWeight(10 + pulse * 6);
  ellipse(h.x, h.y, h.r * 2 + pulse * 14, h.r * 2 + pulse * 14);
  strokeA('#f2a24c', 210); strokeWeight(5);
  ellipse(h.x, h.y, h.r * 2 + pulse * 14, h.r * 2 + pulse * 14);
  // pekande hand
  const bob = sin(millis() / 300) * 6;
  drawPointerHand(h.x + h.r * 0.62, h.y + h.r * 0.78 + bob, 1);
}

function drawPointerHand(x, y, sc) {
  push(); translate(x, y); scale(sc || 1); rotate(-0.12);
  noStroke();
  fillA('#000000', 34); ellipse(2, 22, 40, 12);
  // ärm
  fill('#8fd8c6'); rect(-16, 4, 32, 26, 9);
  fillA('#ffffff', 120); rect(-16, 4, 32, 6, 3);
  // hand
  fillA('#ffffff', 250); strokeA('#e8ded1', 255); strokeWeight(2);
  ellipse(0, 0, 32, 30);
  // pekfinger
  rect(-5, -34, 12, 26, 6);
  noStroke();
  fillA('#f3e6d8', 255); ellipse(1, 6, 16, 12);
  pop();
}

function drawDemo(t) {
  if (G.help || G.intro || G.dayDone || G.album) { G.demo = null; return; }
  if (G.demoPending) {
    G.demoPending = false;
    const f = DEMOS[G.scene];
    if (f && !G.demoDone[G.scene]) {
      let d = null;
      try { d = f(); } catch (e) { d = null; }
      if (d) { d.t0 = millis(); G.demo = d; G.demoDone[G.scene] = true; }
    }
  }
  const d = G.demo;
  if (!d) return;
  const age = millis() - d.t0;
  if (age > 2600) { G.demo = null; return; }
  const k = constrain(age / 1500, 0, 1);
  const p = k < 0.15 ? 0 : easeOut((k - 0.15) / 0.85);
  const x = lerp(d.from.x, d.to.x, p), y = lerp(d.from.y, d.to.y, p);
  const a = age < 300 ? age / 300 : (age > 2200 ? (2600 - age) / 400 : 1);
  push();
  noFill();
  strokeA('#ffffff', 230 * a);
  strokeWeight(6);
  drawingContext.setLineDash([9, 11]);
  line(d.from.x, d.from.y, d.to.x, d.to.y);
  drawingContext.setLineDash([]);
  noStroke();
  fillA('#8fd8c6', 70 * a);
  ellipse(d.to.x, d.to.y, d.r * 2.2, d.r * 2.2);
  noFill();
  strokeA('#63bda8', 240 * a);
  strokeWeight(4);
  ellipse(d.to.x, d.to.y, d.r * 2.0, d.r * 2.0);
  noStroke();
  // little hand
  push();
  translate(x + 12, y + 14); rotate(-0.18);
  fillA('#000000', 40 * a); ellipse(0, 16, 40, 14);
  fillA('#f7b06a', 255 * a);
  strokeA('#ffffff', 255 * a); strokeWeight(4);
  ellipse(0, 0, 32, 30); ellipse(-15, -2, 14, 16); rect(-6, -26, 13, 24, 6);
  noStroke();
  pop();
  // the thing being moved
  if (d.icon) {
    push();
    translate(x, y - 26);
    if (d.icon) d.icon();
    pop();
  }
  pop();
}

// ------------------------------------------------------------
//  HUD
// ------------------------------------------------------------
function drawHUD(t) {
  noStroke();
  if (G.intro) { drawIntro(t); return; }
  const scOwn = SCENES[G.scene];
  if (scOwn && scOwn.ownHud && !G.menu && !G.album && !G.dayDone) {
    if (scOwn.hud) { try { scOwn.hud(t); } catch (e) { window.__sceneErr = 'hud: ' + e.message; } }
    return;
  }
  // stjärnor + klistermärken
  fillA('#000000', 14); rect(26, 24, 142, 46, 23);
  fillA('#ffffff', 240); rect(24, 22, 142, 46, 23);
  fill('#f7c948'); starShape(52, 45, 14, 6);
  fill(PAL.ink); textAlign(LEFT, CENTER); textSize(20);
  text('× ' + G.stars, 76, 46);
  fillA('#8fd8c6', 235); ellipse(148, 34, 26, 26);
  fill('#1f6b58'); textAlign(CENTER, CENTER); textSize(11);
  text(stickerCount(), 148, 34);

  // dagen
  if (VISIT.started && !VISIT.finished) {
    const lv = visitLevel();
    fillA('#ffffff', 228); rect(24, 76, 196, 46, 23);
    fill(PAL.ink); textAlign(LEFT, CENTER); textSize(10.5);
    text(lv.day, 40, 88);
    fill(PAL.dim); textSize(9);
    text('BESÖK', 40, 106);
    for (let i = 0; i < lv.need; i++) {
      fill(i < VISIT.count ? '#63bda8' : '#e8ded1');
      ellipse(112 + i * 19, 100, 12, 12);
    }
  }

  // platsens namn
  const meta = SCENE_META.filter(function (m) { return m.id === G.scene; })[0] || { label: '' };
  textSize(12);
  const tw = textWidth(meta.label);
  fillA('#ffffff', 210); rect(W / 2 - tw / 2 - 16, 24, tw + 32, 30, 15);
  fill(PAL.dim); textAlign(CENTER, CENTER);
  text(meta.label, W / 2, 39);

  // kamera
  fillA('#000000', 14); rect(694, 24, 62, 64, 16);
  fillA('#ffffff', 240); rect(692, 20, 62, 64, 16);
  fill(PAL.ink); rect(706, 36, 34, 26, 6);
  fill('#ffffff'); ellipse(723, 49, 14, 14);
  fill('#8fd8c6'); ellipse(723, 49, 9, 9);
  fill(PAL.ink); rect(710, 31, 12, 6, 3);
  if (PHOTOS.length) {
    fill('#f2a0b4'); ellipse(747, 30, 20, 20);
    fill('#ffffff'); textAlign(CENTER, CENTER); textSize(10);
    text(PHOTOS.length, 747, 30);
  }
  // ljud
  fillA('#000000', 14); rect(772, 26, 56, 60, 16);
  fillA('#ffffff', 240); rect(770, 22, 56, 60, 16);
  drawSpeaker(798, 46, G.soundOn);
  // hjälp
  fillA('#000000', 14); rect(838, 26, 54, 60, 16);
  fillA('#ffffff', 240); rect(836, 22, 54, 60, 16);
  fill(PAL.ink); textAlign(CENTER, CENTER); textSize(30);
  text('?', 863, 50);
  // meny
  fillA('#000000', 16); rect(904, 26, 66, 60, 18);
  fillA('#ffffff', 240); rect(904, 22, 66, 60, 18);
  fill(PAL.ink);
  for (let gy = 0; gy < 2; gy++) for (let gx = 0; gx < 2; gx++) ellipse(928 + gx * 18, 44 + gy * 18, 10, 10);

  // börja om
  fillA('#000000', 12); ellipse(54, 664, 48, 48);
  fillA('#ffffff', 215); ellipse(52, 660, 46, 46);
  strokeA(PAL.ink, 200); strokeWeight(3); noFill();
  arc(52, 660, 21, 21, PI * 0.35, PI * 1.85);
  noStroke(); fill(PAL.ink);
  push(); translate(61, 651); rotate(0.7); triangle(0, -5, 7, 0, 0, 5); pop();

  // toast
  if (G.toastT > 0) {
    const a = constrain(G.toastT / 300, 0, 1);
    textSize(15);
    const tw2 = min(textWidth(G.toast) + 44, W - 120);
    fillA('#4a3f39', 235 * a); rect(W / 2 - tw2 / 2, 552, tw2, 42, 21);
    fillA('#ffffff', 245 * a); textAlign(CENTER, CENTER);
    text(G.toast, W / 2, 573);
  }

  if (G.album) drawAlbum(t);
  if (G.menu) drawSceneMenu(t);
  if (G.help && !G.menu && !G.intro && !G.dayDone && !G.album) drawHelp(t);
  if (G.intro) drawIntro(t);
  if (G.dayDone) drawDayDone(t);

  if (G.newSticker) {
    G.newSticker.t -= deltaTime;
    const k = G.newSticker, a = constrain(k.t / 400, 0, 1);
    if (k.t > 0) {
      const px2 = W - 268, py2 = 96;
      fillA('#fffaf3', 250 * a); rect(px2, py2, 240, 92, 22);
      push(); translate(px2 + 120, py2 + 38); scale(1.15); drawSticker(STICKERS[k.i].kind, 0, 0, STICKERS[k.i].col); pop();
      fillA(PAL.dim, 230 * a); textAlign(CENTER, CENTER); textSize(11);
      text('NYTT!', px2 + 120, py2 + 74);
    } else G.newSticker = null;
  }

  if (G.flash > 0) {
    fillA('#ffffff', 235 * G.flash); rect(0, 0, W, H);
    G.flash = max(0, G.flash - deltaTime / 260);
  }

  if (G.fade > 0) {
    fillA('#fdf3e7', 255 * G.fade); rect(0, 0, W, H);
    G.fade = max(0, G.fade - deltaTime / 240);
  }
}

function drawSpeaker(x, y, on) {
  push(); translate(x, y);
  noStroke(); fill(PAL.ink);
  rect(-14, -6, 8, 12, 2);
  triangle(-6, -12, 10, -20, 10, 20);
  triangle(-6, 12, 10, 20, 10, -20);
  if (on) {
    noFill(); strokeA(PAL.ink, 230); strokeWeight(2.4);
    arc(12, 0, 18, 26, -PI / 3, PI / 3);
    arc(12, 0, 30, 44, -PI / 3, PI / 3);
    noStroke();
  } else {
    strokeA('#a08e80', 220); strokeWeight(3);
    line(14, -10, 26, 10); line(26, -10, 14, 10); noStroke();
  }
  pop();
}
// ------------------------------------------------------------
//  klistermärkesbilder
// ------------------------------------------------------------
function drawSticker(kind, x, y, col) {
  push(); translate(x, y); noStroke();
  fill('#ffffff'); ellipse(0, 0, 64, 64);
  fillA(col, 90); ellipse(0, 0, 54, 54);
  fill(col);
  if (kind === 'tooth') {
    fill('#ffffff'); stroke('#d9cbbc'); strokeWeight(2);
    beginShape();
    vertex(-16, -18); vertex(-4, -22); vertex(4, -22); vertex(16, -18);
    vertex(14, 2); vertex(10, 20); vertex(2, 12); vertex(-2, 12); vertex(-10, 20); vertex(-14, 2);
    endShape(CLOSE);
    noStroke(); fill('#8fd8c6'); ellipse(-6, -10, 5, 5); ellipse(6, -10, 5, 5);
    fill('#f2a0b4'); arc(0, -2, 14, 10, 0, PI);
  } else if (kind === 'scissors') {
    stroke('#7f8f8a'); strokeWeight(4);
    line(-14, -14, 10, 12); line(14, -14, -10, 12);
    noStroke(); fill('#ef8064'); ellipse(-16, 16, 12, 12); ellipse(16, 16, 12, 12);
    fill('#ffffff'); ellipse(-16, 16, 5, 5); ellipse(16, 16, 5, 5);
  } else if (kind === 'heart') {
    heartShape(0, 2, 17);
  } else if (kind === 'pencil') {
    fill('#f7c948'); rect(-8, -20, 16, 30, 3);
    fill('#f2a0b4'); rect(-8, -20, 16, 8, 3);
    fill('#e8b53f'); triangle(-8, 10, 8, 10, 0, 24);
    fill('#4a3f39'); triangle(-3, 17, 3, 17, 0, 24);
  } else if (kind === 'block') {
    fill(col); rect(-18, -12, 36, 28, 6);
    fillA('#ffffff', 120); rect(-18, -12, 36, 8, 4);
    fill('#f7c948'); ellipse(0, 4, 10, 10);
  } else if (kind === 'paw') {
    fill(col); ellipse(0, 6, 26, 22);
    ellipse(-12, -8, 9, 12); ellipse(-4, -14, 9, 12);
    ellipse(4, -14, 9, 12); ellipse(12, -8, 9, 12);
  } else if (kind === 'star') {
    starShape(0, 1, 21, 9);
  } else if (kind === 'flower') {
    for (let i = 0; i < 5; i++) { push(); rotate(i * TAU / 5); ellipse(0, -12, 12, 16); pop(); }
    fill('#f7c948'); ellipse(0, 0, 12, 12);
  } else if (kind === 'car') {
    rect(-22, -4, 44, 16, 6); rect(-13, -16, 26, 14, 5);
    fill('#eaf6f3'); rect(-9, -13, 9, 8, 2); rect(2, -13, 9, 8, 2);
    fill('#4a3f39'); ellipse(-12, 14, 9, 9); ellipse(12, 14, 9, 9);
  } else if (kind === 'cat') {
    ellipse(0, 3, 34, 30);
    triangle(-16, -8, -6, -20, -2, -6);
    triangle(16, -8, 6, -20, 2, -6);
    fill('#4a3f39'); ellipse(-7, 0, 4, 5); ellipse(7, 0, 4, 5);
  } else if (kind === 'cake') {
    fill('#f7e6d0'); rect(-20, -2, 40, 18, 5);
    fill('#f2a0b4'); rect(-20, -2, 40, 7, 3);
    fill('#ef8064'); ellipse(0, -12, 7, 9);
    fill('#8fd8c6'); rect(-22, 16, 44, 5, 2);
  } else if (kind === 'crown') {
    beginShape();
    vertex(-22, 12); vertex(-22, -10); vertex(-10, 0); vertex(0, -16);
    vertex(10, 0); vertex(22, -10); vertex(22, 12);
    endShape(CLOSE);
    fill('#f19ab4'); ellipse(0, 4, 5, 5);
  }
  fillA('#ffffff', 190); ellipse(-20, -20, 5, 5); ellipse(19, 15, 4, 4);
  pop();
}

// ------------------------------------------------------------
//  klistermärkesalbum
// ------------------------------------------------------------
function drawAlbum(t) {
  noStroke();
  fillA('#4a3f39', 130); rect(0, 0, W, H);
  const pw = 800, ph = 556;
  const px = (W - pw) / 2, py = (H - ph) / 2;
  G.albumPanel = { x: px, y: py, w: pw, h: ph };
  G.albumClose = { x: px + pw - 44, y: py + 44 };
  fillA('#000000', 26); rect(px + 6, py + 8, pw, ph, 28);
  fill('#fffaf3'); rect(px, py, pw, ph, 28);
  fill(PAL.ink); textAlign(CENTER, CENTER); textSize(21);
  text(G.albumTab === 'photos' ? 'MINA BILDER' : 'MINA KLISTERMÄRKEN', W / 2, py + 38);

  // flikar
  const tabs = [
    { id: 'stickers', label: 'KLISTERMÄRKEN', x: W / 2 - 190, y: py + 58, w: 180, h: 34 },
    { id: 'photos', label: 'BILDER', x: W / 2 + 10, y: py + 58, w: 180, h: 34 },
  ];
  G.albumTabs = tabs;
  for (const tb of tabs) {
    const on = G.albumTab === tb.id;
    fill(on ? '#8fd8c6' : '#f1e6d8'); rect(tb.x, tb.y, tb.w, tb.h, 17);
    fill(on ? '#1f6b58' : PAL.dim); textSize(11);
    text(tb.label, tb.x + tb.w / 2, tb.y + tb.h / 2);
  }

  G.albumGrid = [];
  G.photoRects = [];

  if (G.albumTab === 'stickers') {
    fill(PAL.dim); textSize(12);
    text(stickerCount() + ' av ' + STICKERS.length, W / 2, py + 112);
    const cw = 168, ch = 124, gap = 14, cols = 4;
    const startX = W / 2 - (cols * cw + (cols - 1) * gap) / 2;
    const startY = py + 126;
    const unlocked = stickerCount();
    for (let i = 0; i < STICKERS.length; i++) {
      const cx = startX + (i % cols) * (cw + gap);
      const cy = startY + floor(i / cols) * (ch + gap);
      const open = i < unlocked;
      fillA('#000000', 10); rect(cx + 3, cy + 4, cw, ch, 18);
      fill(open ? '#ffffff' : '#f0e8de'); rect(cx, cy, cw, ch, 18);
      if (open) drawSticker(STICKERS[i].kind, cx + cw / 2, cy + 60, STICKERS[i].col);
      else {
        fill('#ded2c4'); ellipse(cx + cw / 2, cy + 60, 60, 60);
        fill('#ffffff'); textAlign(CENTER, CENTER); textSize(24);
        text('?', cx + cw / 2, cy + 58);
      }
      G.albumGrid.push({ i: i, x: cx, y: cy, w: cw, h: ch });
    }
  } else {
    fill(PAL.dim); textSize(12);
    text(PHOTOS.length + ' av ' + PHOTO_MAX + ' kort', W / 2, py + 112);
    const cw = 172, ch = 120, gap = 12, cols = 4;
    const startX = W / 2 - (cols * cw + (cols - 1) * gap) / 2;
    const startY = py + 128;
    for (let i = 0; i < PHOTO_MAX; i++) {
      const cx = startX + (i % cols) * (cw + gap);
      const cy = startY + floor(i / cols) * (ch + gap);
      fillA('#000000', 10); rect(cx + 3, cy + 4, cw, ch, 16);
      fill('#ffffff'); rect(cx, cy, cw, ch, 16);
      if (i < PHOTOS.length) {
        const im = photoImg(PHOTOS[i]);
        if (im.complete && im.naturalWidth) {
          push();
          drawingContext.save();
          roundClip(cx, cy, cw, ch, 16);
          drawingContext.drawImage(im, cx, cy, cw, ch);
          drawingContext.restore();
          pop();
        }
      } else {
        fill('#efe6da'); rect(cx + 6, cy + 6, cw - 12, ch - 12, 12);
        fill('#c9b8a4'); rect(cx + cw / 2 - 22, cy + ch / 2 - 16, 44, 32, 7);
        fill('#c9b8a4'); ellipse(cx + cw / 2, cy + ch / 2, 18, 18);
        fill('#efe6da'); ellipse(cx + cw / 2, cy + ch / 2, 11, 11);
      }
      G.photoRects.push({ i: i, x: cx, y: cy, w: cw, h: ch });
    }
  }

  // stäng
  fillA('#ffffff', 235); ellipse(px + pw - 44, py + 44, 44, 44);
  strokeA(PAL.ink, 220); strokeWeight(3.4);
  line(px + pw - 54, py + 34, px + pw - 34, py + 54);
  line(px + pw - 34, py + 34, px + pw - 54, py + 54);
  noStroke();

  // stor bild
  if (G.albumTab === 'photos' && G.photoBig !== null && PHOTOS[G.photoBig]) {
    fillA('#2f2a26', 210); rect(0, 0, W, H);
    const bw = 660, bh = 460;
    const bx = (W - bw) / 2, by = (H - bh) / 2;
    fill('#ffffff'); rect(bx - 10, by - 10, bw + 20, bh + 20, 18);
    const im = photoImg(PHOTOS[G.photoBig]);
    if (im.complete && im.naturalWidth) {
      const ar = im.naturalWidth / im.naturalHeight;
      let dw = bw, dh = dw / ar;
      if (dh > bh) { dh = bh; dw = dh * ar; }
      push();
      drawingContext.drawImage(im, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh);
      pop();
    }
    G.photoBtns = [];
    const bw2 = 210, bh2 = 50, gap2 = 18;
    const b1 = { id: 'postcard', x: bx + 60, y: by + bh + 16, w: bw2, h: bh2 };
    const b2 = { id: 'share', x: bx + bw - 60 - bw2, y: by + bh + 16, w: bw2, h: bh2 };
    fill('#f7c948'); rect(b1.x, b1.y, b1.w, b1.h, 24);
    fill('#5b4a2a'); textAlign(CENTER, CENTER); textSize(14);
    text('GÖR VYKORT', b1.x + b1.w / 2, b1.y + b1.h / 2);
    fill('#8fd8c6'); rect(b2.x, b2.y, b2.w, b2.h, 24);
    fill('#1f6b58'); textSize(14);
    text('SPARA / DELA', b2.x + b2.w / 2, b2.y + b2.h / 2);
    G.photoBtns = [b1, b2];
    fillA(PAL.dim, 230); textAlign(CENTER, CENTER); textSize(11);
    text('tryck utanför för att stänga', W / 2, by - 22);
  }
}

function roundClip(x, y, w, h, r) {
  const c = drawingContext;
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
  c.clip();
}

// ------------------------------------------------------------
//  meny — sex platser
// ------------------------------------------------------------
function drawSceneMenu(t) {
  noStroke();
  fillA('#4a3f39', 120); rect(0, 0, W, H);
  const pw = 800, ph = 580;
  const px = (W - pw) / 2, py = (H - ph) / 2 + 2;
  G.menuPanel = { x: px, y: py, w: pw, h: ph };
  G.menuClose = { x: px + pw - 42, y: py + 40 };
  fillA('#000000', 26); rect(px + 6, py + 8, pw, ph, 28);
  fill('#fffaf3'); rect(px, py, pw, ph, 28);
  fill(PAL.ink); textAlign(CENTER, CENTER); textSize(24);
  text('VART GÅR VI?', W / 2, py + 44);
  fill(PAL.dim); textSize(12);
  text('tryck eller svep', W / 2, py + 72);

  const cw = 122, ch = 112, gap = 9, cols = 6;
  const startX = W / 2 - (cols * cw + (cols - 1) * gap) / 2;
  const startY = py + 94;
  G.menuRects = [];
  for (let i = 0; i < SCENE_META.length; i++) {
    const m = SCENE_META[i];
    const cx = startX + (i % cols) * (cw + gap);
    const cy = startY + floor(i / cols) * (ch + gap);
    const active = G.scene === m.id;
    fillA('#000000', 14); rect(cx + 3, cy + 4, cw, ch, 20);
    fill(active ? '#8fd8c6' : '#ffffff'); rect(cx, cy, cw, ch, 20);
    strokeA(active ? '#63bda8' : '#efdcc8', active ? 240 : 200);
    strokeWeight(active ? 4 : 2); noFill(); rect(cx, cy, cw, ch, 20); noStroke();
    fillA('#ffffff', 200); ellipse(cx + cw / 2, cy + 40, 62, 62);
    drawIcon(m.icon, cx + cw / 2, cy + 42, PAL.ink, 0.84);
    fill(PAL.ink); textAlign(CENTER, CENTER); textSize(11);
    text(m.label, cx + cw / 2, cy + 88, cw - 8, 22);
    const stepIdx = LADDER.findIndex(function (l) { return l.id === m.id; });
    if (VISIT.started && !VISIT.finished && stepIdx >= 0) {
      const cur = stepIdx === VISIT.step, done = stepIdx < VISIT.step;
      if (cur || done) {
        fillA(cur ? '#f7c948' : '#8fd8c6', 245); rect(cx + cw - 54, cy + 8, 46, 20, 10);
        fill(cur ? '#5b4a2a' : '#1f6b58'); textAlign(CENTER, CENTER); textSize(9);
        text(cur ? 'DAG ' + (stepIdx + 1) : 'KLAR', cx + cw - 31, cy + 18);
      }
    }
    G.menuRects.push({ id: m.id, x: cx, y: cy, w: cw, h: ch });
  }

  if (VISIT.started) {
    const fw = 230, fh = 44;
    const fx2 = px + 26, fy2 = py + ph - fh - 16;
    fill(VISIT.finished ? '#f7c948' : '#8fd8c6'); rect(fx2, fy2, fw, fh, 22);
    fill(VISIT.finished ? '#5b4a2a' : '#1f6b58');
    textAlign(CENTER, CENTER); textSize(13);
    if (VISIT.finished) { text('SPELA IGEN', fx2 + fw / 2, fy2 + fh / 2); G.menuRestart = { x: fx2, y: fy2, w: fw, h: fh }; }
    else { text('FORTSÄTT  →', fx2 + fw / 2, fy2 + fh / 2); G.menuCont = { x: fx2, y: fy2, w: fw, h: fh }; }
  }

  fillA('#ffffff', 235); ellipse(px + pw - 42, py + 40, 44, 44);
  strokeA(PAL.ink, 220); strokeWeight(3.4);
  line(px + pw - 52, py + 30, px + pw - 32, py + 50);
  line(px + pw - 32, py + 30, px + pw - 52, py + 50);
  noStroke();
}

// ------------------------------------------------------------
//  intro
// ------------------------------------------------------------
function drawIntro(t) {
  noStroke();
  fillA('#3a332e', 120); rect(0, 0, W, H);
  const pw = 800, ph = 604;
  const px = (W - pw) / 2, py = (H - ph) / 2;
  fillA('#000000', 26); rect(px + 6, py + 8, pw, ph, 28);
  fill('#fffaf3'); rect(px, py, pw, ph, 28);
  fill(PAL.ink); textAlign(CENTER, CENTER); textSize(27);
  text('VÄLKOMMEN TILL LILLA STADEN', W / 2, py + 46);
  fill(PAL.dim); textSize(13.5);
  text('Sjutton ställen. En gubbe. Inga regler.', W / 2, py + 74);
  fillA(PAL.dim, 165); textSize(9.5);
  text('FÖR IPAD  ·  LÄGG TILL PÅ HEMSKÄRMEN', W / 2, py + 92);

  const cw = 122, ch = 96, gap = 9, cols = 6;
  const startX = W / 2 - (cols * cw + (cols - 1) * gap) / 2;
  const startY = py + 106;
  for (let i = 0; i < SCENE_META.length; i++) {
    const m = SCENE_META[i];
    const cx = startX + (i % cols) * (cw + gap);
    const cy = startY + floor(i / cols) * (ch + gap);
    fillA('#f3f8f5', 255); rect(cx, cy, cw, ch, 16);
    fillA('#ffffff', 230); ellipse(cx + cw / 2, cy + 32, 48, 48);
    drawIcon(m.icon, cx + cw / 2, cy + 33, PAL.ink, 0.72);
    fill(PAL.ink); textAlign(CENTER, TOP); textSize(9.8); textLeading(10.5);
    text(m.label, cx + cw / 2 - cw / 2 + 5, cy + 58, cw - 10, 32);
  }
  const bw = 300, bh = 58;
  const bx = W / 2 - bw / 2, by = py + ph - bh - 24;
  fill('#63bda8'); rect(bx, by, bw, bh, 29);
  fill('#ffffff'); textAlign(CENTER, CENTER); textSize(18);
  text('BÖRJA!', bx + bw / 2, by + bh / 2);
  G.introBtn = { x: bx, y: by, w: bw, h: bh };
}

// ------------------------------------------------------------
//  hjälpkort
// ------------------------------------------------------------
function drawHelp(t) {
  const meta = SCENE_META.filter(function (m) { return m.id === G.scene; })[0];
  if (!meta) return;
  noStroke();
  fillA('#4a3f39', 130); rect(0, 0, W, H);
  const pw = 620, ph = 416;
  const px = (W - pw) / 2, py = (H - ph) / 2 + 6;
  G.helpPanel = { x: px, y: py, w: pw, h: ph };
  fillA('#000000', 24); rect(px + 5, py + 7, pw, ph, 26);
  fill('#fffaf3'); rect(px, py, pw, ph, 26);
  fill('#e8f5f0'); ellipse(px + 74, py + 74, 84, 84);
  drawIcon(meta.icon, px + 74, py + 74, PAL.ink, 1.2);
  fill(PAL.ink); textAlign(LEFT, CENTER); textSize(24);
  text(meta.label, px + 132, py + 58);
  fill(PAL.dim); textSize(14);
  text(meta.desc, px + 132, py + 86);
  const steps = meta.steps || [];
  let yy = py + 138;
  for (let i = 0; i < steps.length; i++) {
    fill('#8fd8c6'); ellipse(px + 52, yy + 20, 34, 34);
    fill('#ffffff'); textAlign(CENTER, CENTER); textSize(16);
    text(i + 1, px + 52, yy + 20);
    fill(PAL.ink); textAlign(LEFT, TOP); textSize(19);
    text(steps[i], px + 84, yy + 2, pw - 132, 56);
    yy += 68;
  }
  const bw = 230, bh = 58;
  const bx = px + pw - bw - 26, by = py + ph - bh - 24;
  fill('#63bda8'); rect(bx, by, bw, bh, 29);
  fill('#ffffff'); textAlign(CENTER, CENTER); textSize(18);
  text('KÖR!', bx + bw / 2, by + bh / 2);
  G.helpRects = [{ x: bx, y: by, w: bw, h: bh }];
}

// ------------------------------------------------------------
//  dagen klar
// ------------------------------------------------------------
function drawDayDone(t) {
  noStroke();
  fillA('#3a332e', 130); rect(0, 0, W, H);
  const last = G.dayDone.last;
  const lv = visitLevel();
  const pw = 600, ph = 392;
  const px = (W - pw) / 2, py = (H - ph) / 2;
  fillA('#000000', 24); rect(px + 6, py + 8, pw, ph, 26);
  fill('#fffaf3'); rect(px, py, pw, ph, 26);
  fill('#f7c948'); starShape(W / 2, py + 96, 46, 20);
  fillA('#ffffff', 200); ellipse(W / 2 - 18, py + 78, 12, 12);
  fill(PAL.ink); textAlign(CENTER, CENTER); textSize(26);
  text(last ? 'ALLA BESÖK KLARA!' : 'DAGEN ÄR KLAR!', W / 2, py + 166);
  fill(PAL.dim); textSize(14);
  text(last ? 'Du har jobbat på alla ställen.' : lv.name + ' · ' + lv.day, W / 2, py + 196);
  fill(PAL.ink); textSize(15);
  text('★ ' + G.stars, W / 2, py + 226);
  if (!last) {
    const nx = LADDER[min(VISIT.step + 1, LADDER.length - 1)];
    fillA('#f3f8f5', 255); rect(px + 60, py + 244, 480, 44, 14);
    fill(PAL.dim); textSize(12);
    text('Nästa: ' + nx.name, W / 2, py + 266);
  }
  const bw = 300, bh = 58;
  const bx = W / 2 - bw / 2, by = py + ph - bh - 26;
  fill(VISIT.step >= LADDER.length - 1 && last ? '#f7c948' : '#63bda8');
  rect(bx, by, bw, bh, 29);
  fill(last ? '#5b4a2a' : '#ffffff'); textSize(17);
  text(last ? 'KLART!' : 'NÄSTA  →', bx + bw / 2, by + bh / 2);
  G.dayBtn = { x: bx, y: by, w: bw, h: bh };
}// ------------------------------------------------------------
//  inmatning — touch först, mus som reserv
// ------------------------------------------------------------
let lastTouchAt = -9999;
function pressAt(px, py, isTouch) {
  if (isTouch) lastTouchAt = millis();
  unlockAudio();
  G.lastAct = millis();
  const raw = { x: (px - VIEW.ox) / VIEW.s, y: (py - VIEW.oy) / VIEW.s };
  const off = isTouch ? 24 : 0;
  const w = { x: raw.x, y: raw.y - off / VIEW.s };

  if (G.intro) {
    if (G.introBtn && inRect(raw, G.introBtn)) {
      sfx.good(); startVisit(); return;
    }
    return;
  }
  if (G.dayDone) {
    if (G.dayBtn && inRect(raw, G.dayBtn)) {
      sfx.pop();
      if (G.dayDone.last) {
        VISIT.finished = true; VISIT.count = 0; saveVisit();
        G.dayDone = null; G.menu = true;
      }
      else nextVisit();
    }
    return;
  }
  if (G.album) {
    if (G.photoBig !== null) {
      for (const b of G.photoBtns) {
        if (inRect(raw, b)) {
          if (b.id === 'postcard') makePostcard(G.photoBig);
          else albumShare(G.photoBig);
          return;
        }
      }
      G.photoBig = null; sfx.pop(); return;
    }
    if (G.albumClose && dist(raw.x, raw.y, G.albumClose.x, G.albumClose.y) < 34) { G.album = false; sfx.pop(); return; }
    for (const tb of G.albumTabs) {
      if (inRect(raw, tb)) { G.albumTab = tb.id; sfx.pop(); return; }
    }
    if (G.albumTab === 'photos') {
      for (const r of G.photoRects) {
        if (inRect(raw, r) && r.i < PHOTOS.length) { G.photoBig = r.i; sfx.pling(); return; }
      }
    }
    return;
  }
  if (G.help) {
    if (G.helpRects.length && inRect(raw, G.helpRects[0])) {
      sfx.pop(); G.help = false; G.lastAct = millis();
    }
    return;
  }
  if (G.menu) {
    if (G.menuClose && dist(raw.x, raw.y, G.menuClose.x, G.menuClose.y) < 34) { G.menu = false; sfx.pop(); return; }
    if (G.menuCont && inRect(raw, G.menuCont)) { G.menu = false; startVisit(); return; }
    if (G.menuRestart && inRect(raw, G.menuRestart)) {
      VISIT.step = 0; VISIT.count = 0; VISIT.finished = false; VISIT.started = true; saveVisit();
      G.menu = false; resetScene(LADDER[0].id); switchScene(LADDER[0].id);
      resetScene(LADDER[0].id); G.help = true; return;
    }
    for (const r of G.menuRects) {
      if (inRect(raw, r)) {
        if (r.id === G.scene) { G.menu = false; sfx.pop(); }
        else switchScene(r.id);
        return;
      }
    }
    return;
  }

  const scOwn2 = SCENES[G.scene];
  if (scOwn2 && scOwn2.ownHud) {
    G.swipeStart = { x: raw.x, y: raw.y, t: millis(), moved: false };
    if (scOwn2.down) { try { scOwn2.down(w); } catch (e) { window.__sceneErr = 'down: ' + e.message; } }
    return;
  }

  // HUD
  if (inRect(raw, { x: 18, y: 16, w: 160, h: 60 })) { G.album = true; G.lastAct = millis(); sfx.pop(); return; }
  if (inRect(raw, { x: 682, y: 12, w: 82, h: 78 })) { takePhoto(); return; }
  if (inRect(raw, { x: 760, y: 12, w: 76, h: 78 })) {
    G.soundOn = !G.soundOn; saveSound();
    if (G.soundOn) { sfx.pling(); } return;
  }
  if (inRect(raw, { x: 826, y: 12, w: 72, h: 78 })) { G.help = true; sfx.pop(); return; }
  if (inRect(raw, { x: 894, y: 12, w: 86, h: 78 })) { G.menu = true; sfx.pop(); return; }
  if (dist(raw.x, raw.y, 52, 660) < 46) {
    const sc = SCENES[G.scene];
    if (sc && sc.reset) { sc.reset(); sfx.whoosh(); toast('Börjar om', 900); }
    return;
  }

  const sc = SCENES[G.scene];
  if (sc) {
    G.swipeStart = { x: raw.x, y: raw.y, t: millis(), moved: false };
    if (raw.y > 100 && G.mascotHit && dist(raw.x, raw.y, G.mascotHit.x, G.mascotHit.y) < G.mascotHit.r) {
      G.pose = 2.6; sfx.giggle(); setMood('happy', 2200); G.lastAct = millis();
      return;
    }
    if (sc.down) { try { sc.down(w); } catch (e) { window.__sceneErr = 'down: ' + e.message; } }
  }
}
function moveAt(px, py, isTouch) {
  if (isTouch) lastTouchAt = millis();
  G.lastAct = millis();
  const raw = { x: (px - VIEW.ox) / VIEW.s, y: (py - VIEW.oy) / VIEW.s };
  const off = isTouch ? 24 : 0;
  const w = { x: raw.x, y: raw.y - off / VIEW.s };
  if (G.swipeStart) {
    if (abs(raw.x - G.swipeStart.x) > 12 || abs(raw.y - G.swipeStart.y) > 12) G.swipeStart.moved = true;
  }
  const sc = SCENES[G.scene];
  if (sc && sc.move) { try { sc.move(w); } catch (e) { window.__sceneErr = 'move: ' + e.message; } }
}
function releaseAt(px, py, isTouch) {
  if (isTouch) lastTouchAt = millis();
  const raw = { x: (px - VIEW.ox) / VIEW.s, y: (py - VIEW.oy) / VIEW.s };
  const off = isTouch ? 24 : 0;
  const w = { x: raw.x, y: raw.y - off / VIEW.s };
  const sc = SCENES[G.scene];
  const hadDrag = !!G.dragAny;
  if (sc && sc.up) { try { sc.up(w); } catch (e) { window.__sceneErr = 'up: ' + e.message; } }
  G.dragAny = false;
  const s = G.swipeStart;
  G.swipeStart = null;
  if (hadDrag || !s || G.dragAny || G.menu || G.help || G.intro || G.dayDone || G.album) return;
  const dx = raw.x - s.x, dy = raw.y - s.y;
  if (millis() - s.t < 900 && abs(dx) > 220 && abs(dy) < 110 && abs(dx) > abs(dy) * 2.2) {
    const idx = SCENE_META.findIndex(function (m) { return m.id === G.scene; });
    const nidx = dx < 0 ? (idx + 1) % SCENE_META.length : (idx - 1 + SCENE_META.length) % SCENE_META.length;
    switchScene(SCENE_META[nidx].id);
  }
}

function touchStarted() {
  if (touches.length) { pressAt(touches[0].x, touches[0].y, true); return false; }
  return false;
}
function touchMoved() {
  if (touches.length) { moveAt(touches[0].x, touches[0].y, true); return false; }
  return false;
}
function touchEnded() {
  if (touches.length) releaseAt(touches[0].x, touches[0].y, true);
  else releaseAt(mouseX, mouseY, true);
  return false;
}
function mousePressed() {
  if (millis() - lastTouchAt < 500) return false;
  pressAt(mouseX, mouseY, false); return false;
}
function mouseDragged() {
  if (millis() - lastTouchAt < 500) return false;
  moveAt(mouseX, mouseY, false); return false;
}
function mouseReleased() {
  if (millis() - lastTouchAt < 500) return false;
  releaseAt(mouseX, mouseY, false); return false;
}
function keyPressed() {
  if (key === 'a' || key === 'A') { G.album = !G.album; }
  if (key === 'm' || key === 'M') { G.menu = !G.menu; }
  if (key === 'h' || key === 'H') { G.help = true; }
  if (key === 'r' || key === 'R') { const sc = SCENES[G.scene]; if (sc && sc.reset) sc.reset(); }
  if (key === '+' || key === '=') { STICK.total += 2; saveStickerStars(); }
}

// testkrokar
window.__tap = function (x, y, isTouch) {
  pressAt(sx(x), sy(y), isTouch !== false);
  releaseAt(sx(x), sy(y), isTouch !== false);
  return true;
};
window.__drag = function (x1, y1, x2, y2, steps) {
  steps = steps || 8;
  pressAt(sx(x1), sy(y1), false);
  for (let i = 1; i <= steps; i++) {
    moveAt(sx(x1 + (x2 - x1) * i / steps), sy(y1 + (y2 - y1) * i / steps), false);
  }
  releaseAt(sx(x2), sy(y2), false);
  return true;
};
window.__state = function () {
  return { scene: G.scene, stars: G.stars, err: window.__sceneErr || null, msg: G.toast, mood: G.mood };
};
// test- och debuggkrokar
window.__L = {
  G: G, SCENES: SCENES, META: SCENE_META, LADDER: LADDER,
  visit: function () { return VISIT; },
  setVisit: function (o) { VISIT = o; saveVisit(); },
  resetAll: function () {
    VISIT = { step: 0, count: 0, finished: false, started: false };
    saveVisit();
    G.stars = 0; STICK.total = 0; saveStickerStars();
    G.dayDone = null; G.help = false; G.menu = false; G.album = false; G.intro = false;
    G.demoDone = {}; G.demo = null; G.demoPending = false;
  },
};
