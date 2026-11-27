// ============================================================
//  BAGERIET — kavla degen, välj fyllning, grädda bullen
// ============================================================

SCENES.bakery = {
  reset() {
    this.thick = 1;           // degens tjocklek 1 → 0
    this.top = null;          // choklad / strössel / kanel
    this.bake = 0;            // 0 → 1 under gräddning
    this.baked = false;
    this.rollDone = false; this.topDone = false; this.bakeDone = false;
    this.drag = null; this.pin = { x: 210, y: 592, a: -0.5 };
    this.steam = []; this.flour = []; this.t = 0;
    this.doorOpen = 0;
  },
  items() {
    return [
      { id: 'pin', x: this.pin.x, y: this.pin.y, r: 54 },
      { id: 'choklad', x: 690, y: 606, r: 40, col: '#6b4630' },
      { id: 'strössel', x: 790, y: 606, r: 40, col: '#f2a0b4' },
      { id: 'kanel', x: 890, y: 606, r: 40, col: '#d9a15c' },
    ];
  },
  mascot() { return { x: 934, y: 528, s: 0.58, hat: 'baker', outfit: 'baker' }; },

  draw(t) {
    this.t = t;
    drawRoom({ wall: '#fdf1e2', wall2: '#f6e2cb', floor: '#e3c49f', floorY: 486 });

    // rutigt golv
    for (let i = 0; i < 14; i++) {
      fillA(i % 2 ? '#d8b58d' : '#e3c49f', 90);
      rect(i * 74, 486, 74, 214);
    }

    // fönster med sol
    drawWindow(52, 150, 178, 142, { sky: '#ffeec2' });
    fillA('#f7c948', 190); ellipse(150, 196, 54, 54);
    fillA('#f7c948', 60); ellipse(150, 196, 76, 76);

    // skylt
    fill('#c98a5a'); rect(300, 116, 300, 58, 12);
    fill('#fff6e6'); rect(306, 122, 288, 46, 9);
    fill('#a9683c'); textAlign(CENTER, CENTER); textSize(19);
    text('BAGERIET', 450, 145);
    fill('#8b5a34'); textSize(10);
    text('NYBAKAT', 450, 160);
    fill('#a9683c'); rect(444, 174, 10, 18, 4);

    // hyllor med bröd
    fill('#d8b58d'); rect(560, 196, 300, 10, 4);
    fill('#d8b58d'); rect(560, 292, 300, 10, 4);
    for (let i = 0; i < 5; i++) {
      const bx = 588 + i * 58;
      fill(i % 2 ? '#e0a96d' : '#d79a5c');
      ellipse(bx, 186, 44, 22);
      fillA('#c9873f', 160); ellipse(bx, 180, 30, 8);
    }
    for (let i = 0; i < 4; i++) {
      const bx = 600 + i * 68;
      fill('#f3d9a8'); ellipse(bx, 280, 42, 20);
      fill('#c9873f'); ellipse(bx, 276, 8, 8);
    }
    // pretzel på vägg
    push(); translate(516, 236); noFill(); stroke('#b97a3e'); strokeWeight(7);
    arc(0, 0, 42, 40, PI * 0.15, PI * 1.85);
    arc(0, 0, 42, 40, -PI * 0.85, PI * 0.85);
    noStroke(); pop();

    // ugn
    fill('#8a9aa0'); rect(744, 320, 236, 178, 16);
    fill('#a8b6bb'); rect(754, 330, 216, 158, 12);
    fill('#5f6d72'); rect(770, 350, 184, 108, 10);
    // glöd
    const glow = this.bake > 0 && !this.baked ? 0.5 + sin(t * 6) * 0.2 : (this.baked ? 0.55 : 0);
    if (glow > 0) { fillA('#ff9d4d', 190 * glow); rect(770, 350, 184, 108, 10); }
    if (this.bake > 0 && !this.baked) {
      this.doorOpen = min(1, this.doorOpen + 0.06);
    } else if (this.baked) {
      this.doorOpen = 1;
    }
    // lucka
    if (this.doorOpen < 0.98) {
      fill('#38464b'); rect(770, 350 + (1 - this.doorOpen) * 0, 184 * (1 - this.doorOpen * 0.0), 108, 10);
      fill('#b9c6ca'); rect(776, 356, 172, 96, 8);
      fill('#7d8b90'); rect(776, 356, 172, 10, 6);
      fill('#f2c14e'); rect(906, 436, 30, 8, 4);
      fill('#d8a63a'); ellipse(960, 462, 18, 18);
    }
    fill('#6d7c81'); rect(770, 458, 184, 12, 6);
    // vred
    fill('#e8c877'); ellipse(838, 330, 16, 16); ellipse(866, 330, 16, 16);
    fill('#f7e6bd'); ellipse(862, 322, 8, 8);

    // disk / bakbord
    fill('#c98a5a'); rect(300, 470, 560, 190, 18);
    fill('#e0a96d'); rect(300, 462, 560, 22, 11);
    fillA('#ffffff', 90); rect(312, 466, 400, 7, 4);
    fill('#a9683c'); rect(300, 494, 560, 10, 4);

    // deg
    const r = 96;
    const h = 22 + 40 * this.thick;
    const dy = 500 - h * 0.18;
    if (!this.baked) {
      fillA('#000000', 18); ellipse(470, 512 + h * 0.1, r * 2 + 20, 28);
      fill('#f6e3c4'); ellipse(470, dy + 6, r * 2, h + 8);
      fill('#fdf1dc'); ellipse(470, dy, r * 2 - 8, h);
      fillA('#e9cfa6', 140); ellipse(470, dy + h * 0.28, r * 1.5, h * 0.5);
    } else {
      // färdig bulle
      fillA('#000000', 20); ellipse(470, 512, r * 2, 26);
      fill('#c9873f'); ellipse(470, dy + 8, r * 2 - 6, h + 18);
      fill('#e8b168'); ellipse(470, dy, r * 2 - 14, h + 10);
      fill('#f6cf90'); ellipse(470, dy - 6, r * 1.45, h * 0.75);
      if (this.top === 'choklad') { fill('#5a3826'); ellipse(470, dy - 6, r * 1.35, h * 0.6); }
      if (this.top === 'strössel') {
        for (let i = 0; i < 26; i++) {
          const a = (i * 2.4 + 0.7), rr = (i % 5) * 0.16;
          fill(['#f2a0b4', '#8fd8c6', '#f7c948', '#a9c7f5'][i % 4]);
          push(); translate(470 + cos(a) * (30 + rr * 60), dy - 8 + sin(a) * (8 + rr * 14));
          rotate(a * 2); rect(-4, -1.5, 8, 3, 1.5); pop();
        }
      }
      if (this.top === 'kanel') {
        fillA('#a5642f', 220);
        for (let i = 0; i < 4; i++) ellipse(470 - 40 + i * 26, dy - 8, 30, 8);
      }
      // glasyr-ränder
      stroke('#fff6e6'); strokeWeight(4); noFill();
      arc(470, dy - 4, 120, 26, PI * 0.15, PI * 0.85);
      noStroke();
    }

    // ånga
    if (this.baked) {
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.5 + i * 0.33) % 1;
        fillA('#ffffff', 120 * (1 - ph));
        ellipse(440 + i * 30 + sin(t * 2 + i) * 6, dy - 40 - ph * 80, 16 + ph * 18, 20 + ph * 16);
      }
    }

    // mjöl på bordet
    fillA('#ffffff', 150);
    for (let i = 0; i < 9; i++) ellipse(360 + i * 26, 486 + (i % 3) * 4, 16, 5);

    // skålar
    const bowls = this.items().filter(function (it) { return it.id !== 'pin'; });
    for (const b of bowls) {
      if (this.drag && this.drag.id === b.id) continue;
      this.drawBowlAt(b, b.x, b.y);
    }

    // kavel
    if (!(this.drag && this.drag.id === 'pin')) this.drawPin(this.pin.x, this.pin.y, this.pin.a);

    this.drawDragLayer(t);

  },

  drawBowlAt(b, x, y) {
    fillA('#000000', 16); ellipse(x, y + 26, 74, 18);
    fill('#ffffff'); ellipse(x, y + 8, 74, 40);
    fill('#f1e6d8'); ellipse(x, y + 2, 74, 36);
    fill(b.col); ellipse(x, y + 2, 56, 24);
    fillA('#ffffff', 70); ellipse(x - 8, y - 3, 20, 8);
    if (this.top === b.id) {
      fill('#63bda8'); ellipse(x + 24, y - 20, 18, 18);
      fill('#ffffff'); textAlign(CENTER, CENTER); textSize(11); text('✓', x + 24, y - 20);
    }
  },

  drawDragLayer(t) {
    const dr = this.drag;
    if (!dr) return;
    if (dr.id !== 'pin' && dr.id !== 'bun' && !this.topDone && dist(dr.x, dr.y, 470, 480) < 150) {
      hoverRing(470, 490, 104);
    }
    if (dr.id === 'bun' && dist(dr.x, dr.y, 860, 404) < 150) hoverRing(860, 404, 96);
    if (dr.id === 'pin') {
      push(); translate(dr.x, dr.y - 16); rotate(0.5);
      this.drawPin(0, 0, 0); pop();
    } else if (dr.id === 'bun') {
      fillA('#000000', 20); ellipse(dr.x, dr.y + 20, 176, 30);
      fill('#e8b168'); ellipse(dr.x, dr.y, 176, 62);
      fill('#f6cf90'); ellipse(dr.x, dr.y - 6, 130, 40);
    } else {
      const b = this.items().filter(function (it) { return it.id === dr.id; })[0];
      if (b) this.drawBowlAt(b, dr.x, dr.y - 18);
    }
  },

  drawPin(x, y, a) {
    push(); translate(x, y); rotate(a);
    fillA('#000000', 18); rect(-56, 12, 112, 12, 6);
    fill('#e8c877'); rect(-54, -4, 16, 30, 7); rect(38, -4, 16, 30, 7);
    fill('#f7e6bd'); rect(-40, -8, 80, 36, 14);
    fillA('#d8b06a', 200); rect(-40, 18, 80, 10, 6);
    fillA('#ffffff', 160); rect(-34, -4, 60, 7, 4);
    pop();
  },

  down(p) {
    for (const it of this.items()) {
      if (it.id !== 'pin' && this.topDone) continue;
      if (it.id === 'pin' && this.baked) continue;
      if (dist(p.x, p.y, it.x, it.y) < it.r + 14) {
        this.drag = { id: it.id, x: p.x, y: p.y };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis();
        return;
      }
    }
    // dra den färdiga bullen till ugnen
    if (this.topDone && !this.baked && this.bake <= 0 && dist(p.x, p.y, 470, 480) < 110) {
      this.drag = { id: 'bun', x: p.x, y: p.y };
      G.dragAny = true; sfx.pickup(); G.lastAct = millis();
    }
  },

  move(p) {
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id === 'pin') {
      this.pin.x = p.x; this.pin.y = p.y;
      this.pin.a = -0.5 + sin(millis() / 300) * 0.06;
      if (!this.rollDone && dist(p.x, p.y, 470, 476) < 96) {
        this.thick = max(0, this.thick - 0.055);
        this.flour.push({ x: p.x + random(-30, 30), y: p.y + random(-10, 10), vx: random(-0.5, 0.5), vy: random(-0.9, -0.2), life: 1 });
        if (frameCount % 5 === 0) sfx.splash();
        if (this.thick <= 0.03) {
          this.rollDone = true; gainStar(1); sfx.good(); toast('Platt och fin!', 1300);
          burst(470, 470, ['#ffffff', '#f3d9a8'], 12, 1);
          this.kneaded = true;
        }
      }
    }
  },

  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'pin') {
      this.pin.x = 210; this.pin.y = 592; this.pin.a = -0.5;
      sfx.drop(); return;
    }
    if (d.id === 'bun') {
      if (this.bake <= 0 && dist(p.x, p.y, 860, 404) < 150) {
        this.bake = 0.001; this.bakeT = 0; sfx.whoosh();
        G.lastAct = millis();
      } else sfx.drop();
      return;
    }
    // fyllning
    if (this.rollDone && !this.topDone && dist(p.x, p.y, 470, 476) < 130) {
      this.top = d.id; this.topDone = true;
      gainStar(1); sfx.pop(); sfx.good(); toast('Mm, ' + (d.id === 'choklad' ? 'choklad!' : d.id === 'strössel' ? 'strössel!' : 'kanel!'), 1300);
      addHearts(470, 430, 2);
    } else {
      sfx.drop();
      toast(this.rollDone ? 'Lägg den på degen' : 'Kavla degen först', 1300);
    }
  },

  update(t) {
    if (this.bake > 0 && !this.baked) {
      if (!this.bakeT) this.bakeT = t;
      this.bake += (t - this.bakeT) / 1.9;
      this.bakeT = t;
      if (this.bake >= 1) {
        this.bake = 1; this.baked = true; this.bakeDone = true;
        gainStar(1); sfx.good(); toast('Nygräddad bulle!', 1600);
        setMood('happy', 2600); speak('Nygräddad bulle!');
        burst(860, 400, ['#f7c948', '#ff9d4d', '#ffffff'], 18, 1.2);
        addHearts(860, 330, 3);
      }
    }
    for (const f of this.flour) { f.x += f.vx; f.y += f.vy; f.vy += 0.02; f.life -= 0.02; }
    this.flour = this.flour.filter(function (f) { return f.life > 0; });
    // mjölpuffar
    for (const f of this.flour) { fillA('#ffffff', 170 * f.life); ellipse(f.x, f.y, 5, 5); }
  },
};

SCENE_META.push({
  id: 'bakery', label: 'Bageriet', icon: 'bread',
  desc: 'Baka en bulle', say: 'Kavla degen, välj fyllning och grädda bullen.',
  steps: ['Dra kaveln över degen.', 'Dra en skål med fyllning till degen.', 'Dra bullen till ugnen.'],
});
DEMOS.bakery = function () {
  const sc = SCENES.bakery;
  if (!sc.items) return null;
  if (!sc.rollDone) return { from: { x: sc.pin.x, y: sc.pin.y }, to: { x: 470, y: 470 }, r: 44 };
  if (!sc.topDone) return { from: { x: 690, y: 606 }, to: { x: 470, y: 476 }, r: 36 };
  if (!sc.baked) return { from: { x: 470, y: 480 }, to: { x: 860, y: 404 }, r: 40 };
  return null;
};
HINTS.bakery = function () {
  const sc = SCENES.bakery;
  if (!sc.items) return null;
  if (!sc.rollDone) return { x: sc.pin.x, y: sc.pin.y, r: 56 };
  if (!sc.topDone) return { x: 690, y: 606, r: 44 };
  if (!sc.baked) return { x: 470, y: 478, r: 60 };
  return null;
};