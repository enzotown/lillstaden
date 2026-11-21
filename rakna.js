// ============================================================
//  RÄKNA MED ENZO — räkna sakerna, tryck på rätt siffra
// ============================================================

const TAL_ORD = ['noll', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio'];
for (let ti = 1; ti <= 10; ti++) {
  SAY_FILES[TAL_ORD[ti]] = 'roster/tal-' + ti + '.mp3';
}
SAY_FILES['Rätt!'] = 'roster/say-ratt.mp3';
SAY_FILES['Prova igen.'] = 'roster/say-prova.mp3';
SAY_FILES['Räkna sakerna. Tryck på den siffra som stämmer.'] = 'roster/say-rakna.mp3';

const RAKNA_RUNDOR = [
  { namn: 'Bageriet', typ: 'bulle', antal: 2, farg: '#fdf1e2',
    pos: [{ x: 300, y: 318 }, { x: 520, y: 318 }, { x: 740, y: 318 }, { x: 380, y: 424 }, { x: 600, y: 424 }, { x: 820, y: 424 }] },
  { namn: 'Parken', typ: 'anka', antal: 3, farg: '#dff1e0',
    pos: [{ x: 270, y: 496 }, { x: 470, y: 516 }, { x: 680, y: 496 }, { x: 830, y: 528 }, { x: 380, y: 552 }, { x: 590, y: 566 }] },
  { namn: 'Pizzerian', typ: 'pizza', antal: 4, farg: '#fbe9d6',
    pos: [{ x: 240, y: 392 }, { x: 420, y: 372 }, { x: 610, y: 392 }, { x: 800, y: 372 }, { x: 330, y: 470 }, { x: 540, y: 470 }] },
  { namn: 'Biblioteket', typ: 'bok', antal: 5, farg: '#eee6f8',
    pos: [{ x: 230, y: 168 }, { x: 430, y: 168 }, { x: 640, y: 168 }, { x: 840, y: 168 }, { x: 300, y: 258 }, { x: 620, y: 258 }] },
  { namn: 'Djurkliniken', typ: 'katt', antal: 6, farg: '#e4f1f4',
    pos: [{ x: 240, y: 404 }, { x: 400, y: 404 }, { x: 560, y: 404 }, { x: 720, y: 404 }, { x: 320, y: 516 }, { x: 600, y: 516 }] },
];

// var sakerna ligger (upp till sex stycken)
const RAKNA_POS = [
  { x: 250, y: 300 }, { x: 430, y: 270 }, { x: 610, y: 300 },
  { x: 790, y: 275 }, { x: 330, y: 430 }, { x: 540, y: 440 },
];

SCENES.rakna = {
  reset() {
    this.runda = 0;
    this.raknade = 0;
    this.fel = 0;
    this.skak = 0;
    this.done = false;
    this.klarT = 0;
    this.allDone = false;
    this.val = null;
    this.t = 0;
    this.nyaVal();
  },

  rundaData() { return RAKNA_RUNDOR[min(this.runda, RAKNA_RUNDOR.length - 1)]; },

  nyaVal() {
    const ratt = this.rundaData().antal;
    const alt = [ratt];
    let guard = 0;
    while (alt.length < 3 && guard++ < 80) {
      const k = constrain(ratt + floor(random(-2, 3)), 1, 9);
      if (alt.indexOf(k) === -1) alt.push(k);
    }
    // blanda
    for (let i = alt.length - 1; i > 0; i--) {
      const j = floor(random(i + 1));
      const tmp = alt[i]; alt[i] = alt[j]; alt[j] = tmp;
    }
    this.val = alt;
  },

  knappar() {
    const out = [];
    const bw = 168, bh = 108, gap = 26;
    const tot = 3 * bw + 2 * gap;
    for (let i = 0; i < 3; i++) {
      out.push({ v: this.val[i], x: (W - tot) / 2 + i * (bw + gap), y: 548, w: bw, h: bh });
    }
    return out;
  },

  mascot() { return { x: 900, y: 452, s: 0.5, hat: 'cap' }; },

  draw(t) {
    this.t = t;
    const r = this.rundaData();
    noStroke();
    fill(r.farg); rect(0, 0, W, H);

    // bakgrund per plats
    if (r.typ === 'bulle') {
      fill('#f6e2cb'); rect(0, 0, W, 120);
      fill('#c98a5a'); rect(80, 380, 840, 200, 18);
      fill('#e0a96d'); rect(80, 370, 840, 22, 11);
      drawWindow(790, 196, 180, 136, { sky: '#ffeec2' });
    } else if (r.typ === 'anka') {
      sagaOutdoor('#bfe3f2', '#e8f6e6', 820, 110);
      fill('#a9cfe0'); ellipse(520, 560, 900, 200, 20);
      sagaTree(140, 560, 0.9);
    } else if (r.typ === 'pizza') {
      fill('#f7d9c4'); rect(0, 0, W, 110);
      for (let i = 0; i < 9; i++) { fillA('#ffffff', 90); rect(i * 118, 110, 58, 390); }
      fill('#fdf1dc'); rect(0, 0, W, 0);
      fill('#e8b168'); ellipse(520, 470, 940, 130);
      fill('#d9a15c'); ellipse(520, 460, 900, 100);
    } else if (r.typ === 'bok') {
      fill('#efe6f8'); rect(0, 0, W, H);
      fill('#d9cbe8'); for (let i = 0; i < 4; i++) rect(90, 190 + i * 90, 820, 14, 6);
      fill('#c9b6dd'); for (let i = 0; i < 4; i++) { rect(100, 204 + i * 90, 16, 60, 4); rect(890, 204 + i * 90, 16, 60, 4); }
    } else {
      fill('#e4f1f4'); rect(0, 0, W, H);
      fill('#cfe4e8'); for (let i = 0; i < 7; i++) rect(i * 150, 0, 60, 470);
      fill('#bfdde4'); rect(0, 470, W, 230);
      fill('#ffffff'); rect(110, 200, 190, 130, 12);
      fillA('#a9c7f5', 160); rect(126, 216, 158, 98, 8);
    }

    // fråga
    fillA('#ffffff', 235); rect(W / 2 - 250, 108, 500, 66, 24);
    fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(20);
    text('Hur många ' + this.sakNamn() + '?', W / 2, 130);
    fillA('#a08e80', 255); textSize(11);
    text('TRYCK PÅ SAKERNA OCH RÄKNA', W / 2, 152);

    // sakerna
    const n = r.antal;
    for (let i = 0; i < n; i++) {
      const p = r.pos[i];
      const har = i < this.raknade;
      const pulse = har ? 1 + 0.06 * sin(t * 5 + i) : 1;
      push();
      translate(p.x, p.y);
      scale(pulse);
      if (har) { fillA('#ffffff', 235); ellipse(0, 4, 104, 104); }
      this.drawSak(r.typ, 0, 0, 1);
      if (har) {
        fill('#63bda8'); ellipse(34, -34, 32, 32);
        fill('#ffffff'); textAlign(CENTER, CENTER); textSize(15);
        text(i + 1, 34, -34);
      }
      pop();
    }

    // sifferknappar
    const sk = this.skak > 0 ? sin(millis() / 22) * 9 * this.skak : 0;
    for (const b of this.knappar()) {
      push(); translate(sk, 0);
      fillA('#000000', 18); rect(b.x + 4, b.y + 6, b.w, b.h, 22);
      const rattSvar = b.v === r.antal;
      fill(this.done && rattSvar ? '#f7c948' : '#ffffff');
      rect(b.x, b.y, b.w, b.h, 22);
      strokeA(this.done && rattSvar ? '#d9a63a' : '#e6d6c4', 230); strokeWeight(3); noFill();
      rect(b.x, b.y, b.w, b.h, 22); noStroke();
      fill(this.done && rattSvar ? '#5b4a2a' : '#4a3f39');
      textAlign(CENTER, CENTER); textSize(54);
      text(b.v, b.x + b.w / 2, b.y + b.h / 2 - 4);
      fillA('#a08e80', 200); textSize(10);
      text('tryck', b.x + b.w / 2, b.y + b.h - 16);
      pop();
    }

    // prickar: hur många rundor klara
    for (let i = 0; i < RAKNA_RUNDOR.length; i++) {
      fill(i < this.runda ? '#63bda8' : (i === this.runda ? '#4a3f39' : '#d8cfc4'));
      ellipse(560 + i * 24, 500, i === this.runda ? 13 : 10, i === this.runda ? 13 : 10);
    }

  },

  sakNamn() {
    const ty = this.rundaData().typ;
    return ty === 'bulle' ? 'bullar' : ty === 'anka' ? 'ankor' : ty === 'pizza' ? 'pizzor' : ty === 'bok' ? 'böcker' : 'katter';
  },

  drawSak(typ, x, y, s) {
    if (typ === 'bulle') {
      noStroke();
      fillA('#000000', 18); ellipse(x, y + 34, 96, 18);
      fill('#c9873f'); ellipse(x, y + 12, 96, 62);
      fill('#e8b168'); ellipse(x, y + 4, 96, 56);
      fill('#f6cf90'); ellipse(x, y - 6, 66, 32);
      strokeA('#ffffff', 190); strokeWeight(3); noFill();
      arc(x, y + 2, 60, 22, PI * 0.15, PI * 0.85); noStroke();
      fillA('#a5642f', 220);
      for (let i = 0; i < 4; i++) ellipse(x - 26 + i * 17, y - 8, 16, 4);
    } else if (typ === 'anka') {
      sagaDuck(x, y, 1.15, false);
    } else if (typ === 'pizza') {
      push(); translate(x, y); scale(s); drawIcon('pizza', 0, 0, '#4a3f39', 2.1); pop();
    } else if (typ === 'bok') {
      push(); translate(x, y); scale(s);
      fillA('#000000', 16); rect(-52, 24, 108, 12, 5);
      fill(['#8fd8c6', '#f2a0b4', '#a9c7f5', '#f7c948', '#b79ce0', '#ef8064'][this.raknade % 6]);
      rect(-50, -40, 100, 74, 7);
      fill('#fffaf3'); rect(-40, -32, 80, 58, 5);
      fillA('#4a3f39', 90); rect(-32, -20, 64, 4, 2); rect(-32, -10, 64, 4, 2); rect(-32, 0, 42, 4, 2);
      pop();
    } else {
      sagaCat(x, y + 20, 0.85, true);
    }
  },

  down(p) {
    if (this.done) return;
    const r = this.rundaData();
    // räkna en sak
    for (let i = 0; i < r.antal; i++) {
      const q = r.pos[i];
      if (dist(p.x, p.y, q.x, q.y) < 58 && i >= this.raknade) {
        this.raknade = i + 1;
        sfx.pop();
        speak(TAL_ORD[min(this.raknade, 10)]);
        burst(q.x, q.y - 20, ['#ffffff', '#f7c948'], 6, 0.8);
        G.lastAct = millis();
        return;
      }
    }
    // svara
    for (const b of this.knappar()) {
      if (inRect(p, b)) {
        if (b.v === r.antal) {
          this.done = true;
          this.klarT = millis();
          gainStar(1);
          sfx.good();
          setTimeout(function () { sfx.pling(); }, 220);
          speak('Rätt!');
          burst(W / 2, 320, ['#f7c948', '#8fd8c6', '#f2a0b4', '#ffffff'], 26, 1.4);
          addHearts(W / 2, 300, 3);
          toast('Rätt! ' + r.antal + ' stycken', 1600);
          const self = this;
          setTimeout(function () {
            if (self.runda < RAKNA_RUNDOR.length - 1) {
              self.runda++; self.raknade = 0; self.done = false; self.nyaVal();
            } else {
              self.allDone = true;
              toast('Alla rundor klara!', 2400);
            }
          }, 1500);
        } else {
          this.skak = 1;
          this.fel++;
          sfx.bad();
          toast('Prova igen!', 1200);
          speak('Prova igen.');
        }
        return;
      }
    }
  },

  update(t) {
    if (this.skak > 0) this.skak = max(0, this.skak - deltaTime / 380);
  },
};

SCENE_META.push({
  id: 'rakna', label: 'Räkna med Enzo', icon: 'count',
  desc: 'Räkna bullar, ankor och pizzor',
  say: 'Räkna sakerna. Tryck på den siffra som stämmer.',
  steps: ['Tryck på varje sak och räkna högt.', 'Tryck på siffran som stämmer.', 'Fem rundor – du får en stjärna varje gång.'],
});

DEMOS.rakna = function () {
  const sc = SCENES.rakna;
  if (!sc || sc.done) return null;
  if (sc.raknade < sc.rundaData().antal) {
    const q = sc.rundaData().pos[sc.raknade];
    return { from: { x: q.x + 90, y: q.y + 90 }, to: { x: q.x, y: q.y }, r: 40 };
  }
  const b = sc.knappar().filter(function (k) { return k.v === sc.rundaData().antal; })[0];
  return b ? { from: { x: b.x + b.w / 2, y: b.y - 60 }, to: { x: b.x + b.w / 2, y: b.y + b.h / 2 }, r: 40 } : null;
};
HINTS.rakna = function () {
  const sc = SCENES.rakna;
  if (!sc || sc.done) return null;
  if (sc.raknade < sc.rundaData().antal) {
    const q = sc.rundaData().pos[sc.raknade];
    return { x: q.x, y: q.y, r: 52 };
  }
  const b = sc.knappar().filter(function (k) { return k.v === sc.rundaData().antal; })[0];
  return b ? { x: b.x + b.w / 2, y: b.y + b.h / 2, r: 60 } : null;
};