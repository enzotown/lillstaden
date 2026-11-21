// ============================================================
//  PIZZERIAN — kavla, sås, ost och in i stenugnen
// ============================================================

SCENES.pizzeria = {
  reset() {
    this.thick = 1; this.sauce = 0; this.cheese = false;
    this.bake = 0; this.baked = false; this.bakeT = 0;
    this.rollDone = false; this.sauceDone = false; this.cheeseDone = false; this.bakeDone = false;
    this.drag = null; this.pin = { x: 200, y: 592, a: -0.5 };
    this.flour = []; this.bubbles = [];
    this.fire = random(1000);
  },
  items() {
    return [
      { id: 'pin', x: this.pin.x, y: this.pin.y, r: 54 },
      { id: 'sauce', x: 664, y: 606, r: 40 },
      { id: 'cheese', x: 780, y: 606, r: 40 },
    ];
  },
  mascot() { return { x: 934, y: 528, s: 0.58, hat: 'chef', outfit: 'baker' }; },

  draw(t) {
    drawRoom({ wall: '#fdf0e6', wall2: '#f7dfd2', floor: '#d9b891', floorY: 486 });

    // italiensk flagga som vimpel
    fill('#8fbf8f'); triangle(120, 96, 160, 96, 140, 126);
    fill('#ffffff'); triangle(160, 96, 200, 96, 180, 126);
    fill('#e58b7a'); triangle(200, 96, 240, 96, 220, 126);
    fill('#8a6a52'); rect(118, 92, 124, 6, 3);

    // skylt
    fill('#c98a5a'); rect(330, 112, 300, 58, 12);
    fill('#fff6e6'); rect(336, 118, 288, 46, 9);
    fill('#a9683c'); textAlign(CENTER, CENTER); textSize(19);
    text('PIZZERIA', 480, 141);
    fill('#8b5a34'); textSize(9.5);
    text('VEDUGN', 480, 156);
    fill('#a9683c'); rect(474, 170, 10, 16, 4);

    // hylla med tomater och oljor
    fill('#d8b58d'); rect(150, 210, 210, 10, 4);
    for (let i = 0; i < 4; i++) {
      fill('#e0715f'); ellipse(180 + i * 46, 200, 26, 24);
      fill('#8fbf8f'); rect(174 + i * 46, 186, 10, 6, 3);
    }
    fill('#c9a35f'); rect(620, 190, 26, 62, 6); rect(654, 200, 22, 52, 6);
    fill('#f7e6bd'); rect(624, 198, 18, 8, 3); rect(658, 208, 14, 8, 3);
    fill('#d8b58d'); rect(600, 254, 100, 8, 4);

    // stenugn
    fill('#9a8f86'); rect(704, 286, 272, 200, 18);
    fill('#b3a89e'); rect(714, 296, 252, 180, 14);
    fill('#6d3418'); rect(736, 330, 200, 128, 96, 96);
    // glöd och lågor
    const glow = this.bake > 0 && !this.baked ? 0.55 + sin(t * 7) * 0.2 : (this.baked ? 0.4 : 0.22);
    fillA('#ff7a33', 190 * glow); ellipse(836, 424, 196, 120);
    fillA('#ffd08a', 150 * glow); ellipse(836, 440, 150, 80);
    for (let i = 0; i < 4; i++) {
      const fl = 0.6 + sin(t * 5 + i * 1.7) * 0.18;
      fillA(i % 2 ? '#ffb347' : '#ff8a3d', 200);
      ellipse(790 + i * 30, 452 - fl * 18, 25 * fl, 34 * fl);
    }
    fill('#cbbaa8'); rect(736, 322, 200, 12, 6);
    fill('#e8dccd'); rect(724, 296, 232, 22, 10);
    fill('#b3a89e'); ellipse(836, 476, 220, 22);

    // bakbord
    fill('#c98a5a'); rect(270, 470, 470, 190, 16);
    fill('#e0a96d'); rect(270, 462, 470, 22, 11);
    fill('#a9683c'); rect(270, 494, 470, 10, 4);
    fillA('#ffffff', 60); rect(282, 466, 330, 7, 4);

    // degen / pizzan
    const r = 104;
    const h = 20 + 34 * this.thick;
    const dy = 528 - 8 * (1 - this.thick);
    fillA('#000000', 18); ellipse(430, 546, r * 2 + 16, 26);
    fill('#f2ddb8'); ellipse(430, dy + 6, r * 2, h + 10);
    fill('#f8e8c9'); ellipse(430, dy, r * 2 - 10, h + 2);
    if (this.sauce > 0.02) {
      fillA('#cf5f45', 235); ellipse(430, dy - 2, (r * 2 - 30) * (0.35 + 0.65 * this.sauce), (h - 4) * (0.35 + 0.65 * this.sauce));
      fillA('#b64d36', 120); ellipse(430, dy + 2, (r * 2 - 44) * (0.3 + 0.7 * this.sauce), (h - 10) * (0.3 + 0.7 * this.sauce));
    }
    if (this.cheese) {
      fillA('#f8d98a', 245);
      for (let i = 0; i < 16; i++) {
        const a = i * 1.9, rr = (i % 4) * 0.2;
        ellipse(430 + cos(a) * (18 + rr * 62), dy - 3 + sin(a) * (5 + rr * 12), 20, 12);
      }
      if (this.baked) {
        fillA('#c98b3f', 170);
        for (let i = 0; i < 5; i++) ellipse(370 + i * 30, dy - 8 + (i % 2) * 8, 16, 9);
      }
    }
    if (this.baked) {
      // färdig pizza: kant och bubblor
      noFill(); stroke('#d8a463'); strokeWeight(7);
      ellipse(430, dy, r * 2 - 6, h + 14);
      noStroke();
      for (const b of this.bubbles) {
        fillA('#f0c987', 220);
        ellipse(430 + b.x, dy + b.y, b.r, b.r * 0.7);
      }
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.45 + i * 0.33) % 1;
        fillA('#ffffff', 110 * (1 - ph));
        ellipse(410 + i * 22, dy - 44 - ph * 80, 16 + ph * 20, 20 + ph * 18);
      }
    }

    // mjöl
    fillA('#ffffff', 150);
    for (let i = 0; i < 8; i++) ellipse(330 + i * 24, 486 + (i % 3) * 4, 14, 5);

    // såsslev
    if (!(this.drag && this.drag.id === 'sauce')) this.drawLadleAt(664, 604);
    // ostskål
    if (!(this.drag && this.drag.id === 'cheese')) this.drawCheeseAt(780, 606);
    // pizzaspade
    fill('#c9a35f'); rect(596, 470, 12, 120, 5);
    fill('#b08a4c'); ellipse(602, 582, 62, 46);
    // kavel
    if (!(this.drag && this.drag.id === 'pin')) this.drawPin(this.pin.x, this.pin.y, this.pin.a);

    this.drawDragLayer(t);

    // mjölpuffar
    for (const f of this.flour) { fillA('#ffffff', 170 * f.life); ellipse(f.x, f.y, 5, 5); }

  },

  drawLadleAt(x, y) {
    fillA('#000000', 16); ellipse(x, y + 26, 52, 12);
    push(); translate(x, y - 2); rotate(-0.35);
    fill('#b7c2c6'); rect(-4, -6, 8, 44, 4);
    fill('#8f9ba0'); ellipse(0, -14, 44, 34);
    fillA('#cf5f45', 240); ellipse(0, -14, 36, 26);
    fillA('#b64d36', 160); ellipse(-3, -16, 20, 12);
    pop();
  },

  drawCheeseAt(x, y) {
    fillA('#000000', 14); ellipse(x, y + 28, 82, 16);
    fill('#ffffff'); ellipse(x, y + 10, 84, 44);
    fill('#f1e6d8'); ellipse(x, y + 4, 84, 40);
    fill('#f8d98a'); ellipse(x, y, 66, 26);
    fill('#f0c987'); ellipse(x - 8, y - 6, 24, 12);
    for (let i = 0; i < 7; i++) {
      fillA('#f7dfa6', 230);
      push(); translate(x - 18 + i * 6, y - 6 - (i % 3) * 4); rotate(i * 0.5);
      rect(-6, -2, 12, 4, 2); pop();
    }
    fillA('#ffffff', 120); ellipse(x - 20, y - 18, 18, 6);
  },

  drawDragLayer(t) {
    const dr = this.drag;
    if (!dr) return;
    if (dr.id !== 'pin' && !this.baked && dist(dr.x, dr.y, 430, 520) < 160) {
      const rr = dr.id === 'sauce' ? 106 : 96;
      hoverRing(430, 522, rr);
    }
    if (dr.id === 'pizza' && dist(dr.x, dr.y, 836, 400) < 170) hoverRing(836, 400, 92);
    if (dr.id === 'pin') {
      push(); translate(dr.x, dr.y - 16); rotate(0.5);
      this.drawPin(0, 0, 0); pop();
    } else if (dr.id === 'sauce') {
      this.drawLadleAt(dr.x, dr.y - 14);
    } else if (dr.id === 'cheese') {
      this.drawCheeseAt(dr.x, dr.y - 18);
    }
  },

  drawPin(x, y, a) {
    push(); translate(x, y); rotate(a);
    fillA('#000000', 18); rect(-56, 12, 112, 12, 6);
    fill('#e8c877'); rect(-54, -4, 16, 30, 7); rect(38, -4, 16, 30, 7);
    fill('#f7e6bd'); rect(-40, -8, 80, 36, 14);
    fillA('#d8b06a', 200); rect(-40, 18, 80, 10, 6);
    pop();
  },

  down(p) {
    for (const it of this.items()) {
      if (dist(p.x, p.y, it.x, it.y) < it.r + 16) {
        this.drag = { id: it.id, x: p.x, y: p.y };
        G.dragAny = true; G.lastAct = millis();
        if (it.id === 'sauce' && !this.rollDone) { sfx.bad(); toast('Kavla botten först', 1300); this.drag.id = 'noop'; return; }
        if (it.id === 'cheese' && !this.sauceDone) { sfx.bad(); toast('Sleva på sås först', 1300); this.drag.id = 'noop'; return; }
        if (it.id === 'pin' && (this.sauceDone || this.baked)) { sfx.bad(); this.drag.id = 'noop'; return; }
        sfx.pickup(); return;
      }
    }
    if (!this.baked && this.bake <= 0 && dist(p.x, p.y, 430, 520) < 120) {
      this.drag = { id: 'pizza', x: p.x, y: p.y };
      G.dragAny = true; G.lastAct = millis();
      if (!this.cheese) { sfx.bad(); toast('Lägg på ost först', 1300); this.drag.id = 'noop'; return; }
      sfx.pickup();
    }
  },

  move(p) {
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id === 'pin') {
      this.pin.x = p.x; this.pin.y = p.y;
      if (!this.rollDone && dist(p.x, p.y, 430, 520) < 98) {
        this.thick = max(0, this.thick - 0.055);
        this.flour.push({ x: p.x + random(-26, 26), y: p.y + random(-8, 8), vx: random(-0.4, 0.4), vy: random(-0.8, -0.2), life: 1 });
        if (frameCount % 5 === 0) sfx.splash();
        if (this.thick <= 0.03) {
          this.rollDone = true; gainStar(1); sfx.good(); toast('Platt botten!', 1200);
          burst(430, 520, ['#ffffff', '#f2ddb8'], 12, 1);
        }
      }
    }
    if (d.id === 'sauce' && this.rollDone && !this.sauceDone && dist(p.x, p.y, 430, 520) < 124) {
      this.sauce = min(1, this.sauce + 0.05);
      if (frameCount % 7 === 0) sfx.splash();
      if (this.sauce >= 0.88) {
        this.sauceDone = true; gainStar(1); sfx.pop(); toast('Tomat på!', 1200);
      }
    }
  },

  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'noop') return;
    if (d.id === 'pin') { this.pin.x = 200; this.pin.y = 592; this.pin.a = -0.5; sfx.drop(); return; }
    if (d.id === 'sauce') {
      if (this.sauceDone) { sfx.pop(); return; }
      sfx.drop(); toast('Sleva sås över hela botten', 1300); return;
    }
    if (d.id === 'cheese') {
      if (dist(p.x, p.y, 430, 520) < 120 && this.sauceDone) {
        this.cheese = true; this.cheeseDone = true; gainStar(1);
        sfx.pop(); sfx.good(); toast('Ost!', 1100);
        addHearts(430, 470, 2);
      } else { sfx.drop(); toast('Lägg osten på pizzan', 1300); }
      return;
    }
    if (d.id === 'pizza') {
      if (dist(p.x, p.y, 836, 400) < 150) {
        this.bake = 0.001; this.bakeT = 0; sfx.whoosh();
        this.bubbles = [];
        for (let i = 0; i < 7; i++) this.bubbles.push({ x: random(-60, 60), y: random(-10, 10), r: random(10, 22) });
      } else sfx.drop();
    }
  },

  update(t) {
    if (this.bake > 0 && !this.baked) {
      if (!this.bakeT) this.bakeT = t;
      this.bake += (t - this.bakeT) / 2.3;
      this.bakeT = t;
      if (frameCount % 4 === 0) {
        G.parts.push({ x: 800 + random(-30, 70), y: 440, vx: random(-0.3, 0.3), vy: random(-1.4, -0.6), r: random(3, 6), life: 1, col: '#ffb347', spin: 0 });
      }
      if (this.bake >= 1) {
        this.bake = 1; this.baked = true; this.bakeDone = true;
        gainStar(1); sfx.good(); toast('Pizza!', 1600);
        setMood('happy', 2800); speak('Vilken god pizza!');
        burst(836, 420, ['#ffb347', '#f7c948', '#ffffff'], 20, 1.3);
      }
    }
    for (const f of this.flour) { f.x += f.vx; f.y += f.vy; f.vy += 0.02; f.life -= 0.02; }
    this.flour = this.flour.filter(function (f) { return f.life > 0; });
  },
};

SCENE_META.push({
  id: 'pizzeria', label: 'Pizzerian', icon: 'pizza',
  desc: 'Baka en pizza', say: 'Kavla botten, sleva på sås och grädda pizzan.',
  steps: ['Dra kaveln över degen.', 'Sleva sås över hela botten.', 'Lägg på ost och dra pizzan till ugnen.'],
});
DEMOS.pizzeria = function () {
  const sc = SCENES.pizzeria;
  if (!sc.items) return null;
  if (!sc.rollDone) return { from: { x: 200, y: 592 }, to: { x: 430, y: 520 }, r: 44 };
  if (!sc.sauceDone) return { from: { x: 664, y: 606 }, to: { x: 430, y: 516 }, r: 38 };
  if (!sc.cheeseDone) return { from: { x: 780, y: 606 }, to: { x: 430, y: 520 }, r: 36 };
  if (!sc.baked) return { from: { x: 430, y: 520 }, to: { x: 836, y: 400 }, r: 40 };
  return null;
};
HINTS.pizzeria = function () {
  const sc = SCENES.pizzeria;
  if (!sc.items) return null;
  if (!sc.rollDone) return { x: 200, y: 592, r: 56 };
  if (!sc.sauceDone) return { x: 664, y: 606, r: 46 };
  if (!sc.cheeseDone) return { x: 780, y: 606, r: 46 };
  if (!sc.baked) return { x: 430, y: 520, r: 60 };
  return null;
};