// ============================================================
//  HEMMET — hyllan med allt Marre hittat
//  Varje plats ger en sak. Sakerna sparas i webbläsaren.
// ============================================================

const SAKER = {
  dentist:      { n: 'Tandborsten',  k: 'tooth' },
  hairdresser:  { n: 'Saxen',        k: 'scissors' },
  doctor:       { n: 'Plåstret',     k: 'heart' },
  school:       { n: 'Pennan',       k: 'pencil' },
  fritids:      { n: 'Klossen',      k: 'block' },
  vet:          { n: 'Tassavtrycket', k: 'paw' },
  bakery:       { n: 'Bullen',       k: 'bread' },
  bus:          { n: 'Bussbiljetten', k: 'bus' },
  library:      { n: 'Boken',        k: 'book' },
  pizzeria:     { n: 'Pizzan',       k: 'pizza' },
  park:         { n: 'Ankan',        k: 'tree' },
  fire:         { n: 'Brandhjälmen', k: 'flame' },
  farm:         { n: 'Mjölkhinken',  k: 'cow' },
  pier:         { n: 'Fisken',       k: 'fish' },
  saga:         { n: 'Sagostjärnan', k: 'star' },
  rakna:        { n: 'Sifferkortet', k: 'count' },
};
const SAK_ORDNING = ['dentist', 'hairdresser', 'doctor', 'school', 'fritids', 'vet',
  'bakery', 'bus', 'library', 'pizzeria', 'park', 'fire', 'farm', 'pier', 'saga', 'rakna'];
const SAK_COLS = 8;

let FUNNA = (function () {
  try {
    const raw = localStorage.getItem('lilla-staden-saker');
    if (raw) { const p = JSON.parse(raw); if (p && typeof p === 'object') return p; }
  } catch (e) {}
  return {};
})();
function saveFunna() {
  try { localStorage.setItem('lilla-staden-saker', JSON.stringify(FUNNA)); } catch (e) {}
}
function funnaAntal() {
  let n = 0;
  for (const id of SAK_ORDNING) if (FUNNA[id]) n++;
  return n;
}

SAY_FILES['Här bor Marre. Alla saker du hittat står på hyllan.'] = 'roster/say-hem.mp3';

// haka på stjärnorna: första stjärnan på en plats ger platsens sak
const __gainStar0 = gainStar;
gainStar = function (n) {
  __gainStar0(n);
  try {
    const s = SAKER[G.scene];
    if (s && !FUNNA[G.scene]) {
      FUNNA[G.scene] = 1;
      saveFunna();
      sfx.sparkle();
      setTimeout(function () { sfx.pling(); }, 220);
      toast('Ny sak: ' + s.n + '!', 2100);
      burst(W / 2, 120, ['#f7c948', '#8fd8c6', '#f2a0b4', '#ffffff'], 16, 1.1);
    }
  } catch (e) {}
};

// ------------------------------------------------------------
SCENES.hem = {
  reset() {
    this.sel = null; this.selT = 0; this.t = 0; this.allT = 0;
    this.cat = { x: 300, y: 592, t: 0 };
  },
  mascot() { return { x: 848, y: 598, s: 0.66, hat: 'cap' }; },

  slots() {
    const out = [];
    const cols = SAK_COLS;
    const dx = cols > 6 ? 100 : 122;
    const x0 = W / 2 - ((cols - 1) * dx) / 2;
    for (let i = 0; i < SAK_ORDNING.length; i++) {
      out.push({
        id: SAK_ORDNING[i],
        x: x0 + (i % cols) * dx,
        y: (i < cols ? 300 : 430),
      });
    }
    return out;
  },

  draw(t) {
    this.t = t;
    // vägg med tapet
    noStroke(); fill('#f7ead9'); rect(0, 0, W, H);
    for (let i = 0; i < 14; i++) {
      fillA('#f0dcc2', 120); rect(i * 74, 0, 30, 470);
    }
    fillA('#e9cfae', 140); rect(0, 0, W, 96);
    fill('#e6c9a4'); rect(0, 462, W, H - 462);
    for (let i = 0; i < 11; i++) { strokeA('#000000', 18); strokeWeight(2); line(0, 486 + i * 24, W, 486 + i * 24); }
    noStroke();

    // fönster
    drawWindow(32, 136, 150, 128, { sky: '#cfe9f6' });
    fillA('#f7c948', 150); ellipse(96, 186, 50, 50);

    // tavla med Marre + hjärta
    fill('#ffffff'); rect(690, 116, 150, 108, 12);
    fill('#dcefef'); rect(698, 122, 134, 94, 9);
    fill('#f2a0b4'); heartShape(765, 168, 20);
    

    // hyllor
    for (const y of [300, 430]) {
      fillA('#000000', 22); rect(112, y + 12, 830, 14, 6);
      fill('#c98a5a'); rect(110, y, 830, 18, 7);
      fill('#e0a96d'); rect(110, y, 830, 7, 4);
      fill('#efdcc8'); rect(110, y - 8, 830, 10, 5);
    }
    // konsoler
    fill('#b57a4c');
    for (const x of [150, 470, 780]) { rect(x, 318, 14, 26, 4); rect(x, 448, 14, 26, 4); }

    // saker på hyllan
    const slots = this.slots();
    for (const sl of slots) {
      const s = SAKER[sl.id];
      const har = !!FUNNA[sl.id];
      const bob = (this.sel === sl.id) ? sin(t * 6) * 4 - 10 : 0;
      // skugga
      fillA('#000000', har ? 16 : 0); ellipse(sl.x, sl.y - 4, 62, 10);
      if (har) {
        push();
        translate(sl.x, sl.y - 34 + bob);
        if (this.sel === sl.id) { fillA('#ffffff', 190); ellipse(0, 4, 84, 84); }
        drawIcon(s.k, 0, 0, '#4a3f39', 0.95);
        pop();
      } else {
        fillA('#ffffff', 120); ellipse(sl.x, sl.y - 34, 56, 56);
        fillA('#c9b6a3', 190); textAlign(CENTER, CENTER); textSize(24);
        text('?', sl.x, sl.y - 35);
      }
    }

    // räknare på väggen
    const n = funnaAntal();
    fillA('#ffffff', 232); rect(430, 132, 200, 62, 18);
    fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(13);
    text('SAKER PÅ HYLLAN', 530, 152);
    textSize(24);
    text(n + ' av ' + SAK_ORDNING.length, 530, 176);

    // matta
    fillA('#f2a0b4', 120); ellipse(300, 606, 300, 74);
    fillA('#e88fa6', 60); ellipse(300, 606, 240, 54);

    // sovande katt
    this.drawCat(t);

    // korg med filt
    fill('#d9a15c'); ellipse(660, 612, 120, 44);
    fill('#c9873f'); ellipse(660, 600, 108, 30);
    fill('#f6e3c4'); ellipse(660, 590, 92, 34);
    fill('#a9c7f5'); ellipse(646, 584, 40, 22);

    // namnbricka på vald sak
    if (this.sel && SAKER[this.sel]) {
      const s = SAKER[this.sel];
      const w2 = max(160, textWidth(s.n) + 60);
      fillA('#4a3f39', 225 * constrain(this.selT / 260, 0, 1));
      rect(W / 2 - w2 / 2, 74, w2, 46, 23);
      fill('#ffffff'); textAlign(CENTER, CENTER); textSize(17);
      text(s.n, W / 2, 97);
    }

    // allt funnet?
    if (funnaAntal() >= SAK_ORDNING.length) {
      const a = 0.75 + 0.25 * sin(t * 2);
      fillA('#f7c948', 235 * a); rect(330, 62, 340, 52, 26);
      fill('#5b4a2a'); textAlign(CENTER, CENTER); textSize(16);
      text('ALLA SAKER FUNNA!', 500, 88);
    }
  },

  drawCat(t) {
    const c = this.cat;
    const br = sin(t * 1.6) * 3;
    noStroke();
    fillA('#000000', 18); ellipse(c.x, c.y + 18, 132, 20);
    fill('#c3b4a4'); ellipse(c.x, c.y, 118, 62);
    fill('#d6c8b8'); ellipse(c.x + 6, c.y - 8 + br * 0.2, 84, 34);
    // huvud
    fill('#c3b4a4'); ellipse(c.x - 48, c.y - 6, 52, 46);
    triangle(c.x - 70, c.y - 22, c.x - 58, c.y - 46, c.x - 44, c.y - 22);
    triangle(c.x - 34, c.y - 22, c.x - 24, c.y - 44, c.x - 18, c.y - 18);
    // stängda ögon
    stroke('#6b5b4c'); strokeWeight(2.4); noFill();
    arc(c.x - 60, c.y - 6, 12, 8, PI * 0.1, PI * 0.9);
    arc(c.x - 36, c.y - 6, 12, 8, PI * 0.1, PI * 0.9);
    noStroke();
    fill('#f2a0b4'); ellipse(c.x - 48, c.y + 4, 7, 5);
    // svans
    push(); translate(c.x + 56, c.y - 2); noFill(); stroke('#c3b4a4'); strokeWeight(9);
    arc(0, 0, 52, 46, -PI * 0.6, PI * 0.7); noStroke(); pop();
    // Zzz
    fillA('#8fa8bd', 190); textAlign(LEFT, CENTER); textSize(15);
    text('z', c.x - 6, c.y - 54 - (t * 12 % 20));
    textSize(11); text('z', c.x + 12, c.y - 74 - (t * 12 % 16));
  },

  down(p) {
    for (const sl of this.slots()) {
      if (dist(p.x, p.y, sl.x, sl.y - 34) < 62) {
        this.sel = sl.id; this.selT = 0; G.lastAct = millis();
        const s = SAKER[sl.id];
        if (FUNNA[sl.id]) {
          speak(s.n);
          sfx.pling();
          burst(sl.x, sl.y - 40, ['#f7c948', '#8fd8c6', '#ffffff'], 12, 1);
          setMood('happy', 1400);
        } else {
          toast('Den saken har du inte hittat än', 1800);
          sfx.pop();
        }
        return;
      }
    }
  },
  update(t) {
    if (this.sel) this.selT += deltaTime;
  },
};

SCENE_META.unshift({
  id: 'hem', label: 'Hemmet', icon: 'house',
  desc: 'Hyllan med alla saker',
  say: 'Här bor Marre. Alla saker du hittat står på hyllan.',
  steps: ['Tryck på en sak på hyllan.', 'Lyssna vad den heter.', 'Gå ut och hitta fler saker.'],
});
HINTS.hem = null;
DEMOS.hem = null;

// ------------------------------------------------------------
//  ?platser=...  — läraren väljer vilka platser som syns
//  Ex: .../index.html?platser=tand,brand,bondgard
// ------------------------------------------------------------
(function () {
  const ALIAS = {
    hem: 'hem', tand: 'dentist', tandlakare: 'dentist', frisor: 'hairdresser',
    doktor: 'doctor', skola: 'school', fritids: 'fritids', djur: 'vet',
    bageri: 'bakery', buss: 'bus', bibliotek: 'library', pizzeria: 'pizzeria',
    park: 'park', brand: 'fire', bondgard: 'farm', brygga: 'pier',
    saga: 'saga', rakna: 'rakna',
  };
  let q = null;
  try { q = new URLSearchParams(location.search).get('platser'); } catch (e) { q = null; }
  if (!q) return;
  const ids = q.split(',').map(function (s) { return s.trim().toLowerCase(); })
    .filter(Boolean).map(function (s) { return ALIAS[s] || s; });
  const finns = SCENE_META.filter(function (m) { return ids.indexOf(m.id) >= 0; });
  if (!finns.length) return;                     // stavfel: visa allt som vanligt
  for (let i = SCENE_META.length - 1; i >= 0; i--) {
    if (ids.indexOf(SCENE_META[i].id) < 0) SCENE_META.splice(i, 1);
  }
  window.__visarPlatser = SCENE_META.map(function (m) { return m.id; });
})();