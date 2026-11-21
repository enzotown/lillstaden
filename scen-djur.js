// ============================================================
//  DJURKLINIKEN — tvätta hunden, plåstra tassen, ge ett ben
// ============================================================

SCENES.vet = {
  reset() {
    this.spots = [
      { x: 472, y: 388, w: 0 },
      { x: 556, y: 412, w: 0 },
      { x: 606, y: 372, w: 0 },
    ];
    this.washDone = false; this.pawDone = false; this.boneDone = false;
    this.drag = null; this.tool = null;
    this.wag = 1; this.result = 0; this.said = false; this.done = 0;
    this.look = { x: 0, y: 0 }; this.bone = null; this.eat = 0;
  },
  items() {
    return [
      { id: 'sponge', x: 640, y: 596, r: 40 },
      { id: 'plaster', x: 745, y: 596, r: 38 },
      { id: 'bone', x: 850, y: 596, r: 40 },
    ];
  },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    drawRoom({ wall: '#e9f5ef', wall2: '#d4ebe2', floor: '#e8cdb0', floorY: 486 });
    drawWindow(60, 148, 170, 136, { sky: '#cdeaf7' });
    // hylla med saker
    fill('#d8c3a8'); rect(760, 132, 190, 10, 4);
    fill('#ef8064'); rect(790, 96, 24, 36, 5);
    fill('#8fd8c6'); rect(830, 104, 20, 28, 5);
    fill('#f7c948'); ellipse(884, 116, 24, 26);
    // affisch
    fill('#ffffff'); rect(608, 140, 96, 116, 10);
    fill('#8fd8c6'); rect(608, 140, 96, 18, 8);
    drawIcon('paw', 656, 212, '#4a3f39', 1.1);

    // undersökningsbord
    fillA('#000000', 22); ellipse(500, 570, 560, 44);
    fill('#cfe0d8'); rect(232, 452, 540, 34, 14);
    fill('#b6cec4'); rect(272, 486, 22, 84, 8); rect(706, 486, 22, 84, 8);
    fillA('#ffffff', 150); rect(242, 458, 520, 8, 4);

    // svans
    const wagA = sin(t * 6 * this.wag) * 0.35;
    push(); translate(658, 392); rotate(-0.42 + wagA);
    fill('#d9b382'); rect(0, -14, 82, 28, 14);
    fillA('#ffffff', 80); rect(10, -10, 56, 7, 4);
    fill('#b98f60'); ellipse(78, 0, 22, 20);
    pop();

    // matta
    fillA('#000000', 16); ellipse(500, 574, 580, 46);
    fill('#dcefe6'); ellipse(500, 566, 560, 40);

    // kropp
    fillA('#000000', 20); ellipse(510, 466, 320, 40);
    fill('#d9b382'); ellipse(510, 402, 320, 148);
    fillA('#ffffff', 60); ellipse(520, 372, 250, 70);
    // fläckar
    fill('#b98f60'); ellipse(600, 420, 60, 44); ellipse(430, 428, 46, 34);

    // ben/tassar
    fill('#d9b382');
    rect(560, 430, 34, 44, 14); rect(624, 432, 34, 42, 14);
    rect(356, 432, 34, 44, 14);
    push(); translate(392, 470); fill('#d9b382'); ellipse(0, 0, 46, 26); pop();

    // smuts
    for (const s of this.spots) {
      if (s.w >= 1) continue;
      const k = 1 - s.w;
      fillA('#8b6a44', 210 * k);
      ellipse(s.x, s.y, 44 * k + 8, 34 * k + 6);
      fillA('#6f5436', 170 * k);
      ellipse(s.x - 6, s.y - 4, 16 * k, 12 * k);
    }

    // huvud
    const hx = 306, hy = 350 + sin(t * 1.6) * 2;
    push(); translate(hx, hy);
    // öron
    fill('#b98f60');
    push(); translate(-44, -26); rotate(-0.25 + sin(t * 2) * 0.04); ellipse(0, 26, 40, 86); pop();
    push(); translate(46, -24); rotate(0.25 - sin(t * 2) * 0.04); ellipse(0, 26, 40, 86); pop();
    // huvud
    fill('#d9b382'); ellipse(0, 0, 132, 124);
    fillA('#ffffff', 90); ellipse(-10, -34, 80, 40);
    // nos
    fill('#e8c9a2'); ellipse(0, 26, 74, 56);
    fill('#5b4433'); ellipse(0, 10, 26, 20);
    fillA('#ffffff', 180); ellipse(-5, 5, 8, 5);
    // mun
    strokeA('#5b4433', 220); strokeWeight(3); noFill();
    arc(0, 26, 30, 20, 0, PI); noStroke();
    // tunga
    if (this.boneDone || this.eat > 0) {
      fill('#ef8f9c'); ellipse(0, 40 + sin(t * 8) * 2, 22, 16);
    }
    // ögon
    fill('#ffffff'); ellipse(-32, -14, 30, 30); ellipse(32, -14, 30, 30);
    fill('#4a3f39');
    const lx = this.bone ? 6 : -4;
    ellipse(-32 + lx, -12, 14, 16); ellipse(32 + lx, -12, 14, 16);
    fillA('#ffffff', 230); ellipse(-36 + lx, -18, 5, 5); ellipse(28 + lx, -18, 5, 5);
    // bryn
    fillA('#8b6a44', 190); rect(-46, -34, 26, 5, 2); rect(20, -34, 26, 5, 2);
    pop();

    // plåster på tassen
    if (this.pawDone) {
      push(); translate(392, 470); rotate(-0.25); this.drawPlaster(0, 0, 0.9); pop();
    }
    // benet i munnen
    if (this.boneDone) {
      push(); translate(300, 396); rotate(0.15 + sin(t * 3) * 0.03);
      this.drawBone(0, 0, 0.85); pop();
    }

    // bricka
    drawToolTray(550, 380, '#eef7f3');
    for (const it of this.items()) {
      if (it.id === 'sponge' && this.washDone) continue;
      if (it.id === 'plaster' && this.pawDone) continue;
      if (it.id === 'bone' && this.boneDone) continue;
      fill('#f4fbf8'); ellipse(it.x, it.y, it.r * 2 - 6, it.r * 2 - 6);
      if (it.id === 'sponge') this.drawSponge(it.x, it.y, 1);
      else if (it.id === 'plaster') this.drawPlaster(it.x, it.y, 1);
      else this.drawBone(it.x, it.y, 1);
    }
    if (this.drag) {
      if (this.drag.id === 'sponge') {
        for (const s of this.spots) if (s.w < 1 && dist(this.drag.x, this.drag.y, s.x, s.y) < 80) hoverRing(s.x, s.y, 34);
      } else if (this.drag.id === 'plaster' && !this.pawDone && dist(this.drag.x, this.drag.y, 392, 470) < 80) {
        hoverRing(392, 470, 42);
      } else if (this.drag.id === 'bone' && !this.boneDone && dist(this.drag.x, this.drag.y, 306, 392) < 90) {
        hoverRing(306, 392, 46);
      }
      push(); translate(this.drag.x, this.drag.y - 28); rotate(0.1);
      if (this.drag.id === 'sponge') this.drawSponge(0, 0, 1.1);
      else if (this.drag.id === 'plaster') this.drawPlaster(0, 0, 1.1);
      else this.drawBone(0, 0, 1.1);
      pop();
    }

    this.done = (this.washDone ? 1 : 0) + (this.pawDone ? 1 : 0) + (this.boneDone ? 1 : 0);
    if (this.done >= 3 && !this.said) {
      this.said = true; this.result = 2800; this.wag = 2.2;
      setMood('happy', 3400); sfx.pling(); sfx.bark();
      addHearts(306, 300, 5);
      speak('Vilken glad hund!');
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 400, 0, 1);
      fillA('#ffffff', 240 * a); rect(W / 2 - 160, 196, 320, 90, 24);
      fillA('#4a3f39', 255 * a); textAlign(CENTER, CENTER); textSize(19);
      text('HUNDEN MÅR BRA!', W / 2, 241);
      if (this.result <= 0) this.result = 0;
    }
    if (this.eat > 0) this.eat -= deltaTime / 900;
  },

  drawSponge(x, y, sc) {
    push(); translate(x, y); scale(sc); noStroke();
    fill('#f7c948'); rect(-22, -14, 44, 28, 9);
    fill('#e8b93f'); rect(-22, 2, 44, 12, 6);
    fillA('#ffffff', 130); rect(-16, -10, 14, 8, 4);
    for (let i = 0; i < 5; i++) { fillA('#c79a2a', 140); ellipse(-14 + i * 7, 8, 3, 3); }
    pop();
  },
  drawPlaster(x, y, sc) {
    push(); translate(x, y); scale(sc); rotate(-0.2); noStroke();
    fill('#f2d7b8'); rect(-24, -10, 48, 20, 7);
    fillA('#e0bd94', 255); rect(-8, -10, 16, 20, 4);
    pop();
  },
  drawBone(x, y, sc) {
    push(); translate(x, y); scale(sc); noStroke();
    fill('#fffaf0'); stroke('#e0d2bd'); strokeWeight(1.6);
    rect(-18, -6, 36, 12, 6);
    ellipse(-19, -7, 14, 14); ellipse(-19, 7, 14, 14);
    ellipse(19, -7, 14, 14); ellipse(19, 7, 14, 14);
    noStroke();
    pop();
  },

  down(p) {
    for (const it of this.items()) {
      if (it.id === 'sponge' && this.washDone) continue;
      if (it.id === 'plaster' && this.pawDone) continue;
      if (it.id === 'bone' && this.boneDone) continue;
      if (dist(p.x, p.y, it.x, it.y) < it.r + 12) {
        this.tool = it.id; this.drag = { x: p.x, y: p.y, id: it.id };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },
  move(p) {
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id === 'sponge') {
      for (const s of this.spots) {
        if (s.w >= 1) continue;
        if (dist(p.x, p.y, s.x, s.y) < 56) {
          s.w = min(1, s.w + 0.16);
          if (frameCount % 6 === 0) sfx.splash();
          if (frameCount % 3 === 0) {
            G.parts.push({ x: s.x + random(-14, 14), y: s.y + random(-10, 10), vx: random(-0.6, 0.6), vy: random(-1.2, -0.2), r: random(3, 6), life: 1, col: '#cfe9e0', spin: 0 });
          }
        }
      }
      if (!this.washDone && this.spots.every(function (s) { return s.w >= 1; })) {
        this.washDone = true; gainStar(1); sfx.good(); toast('Ren och fin!', 1400);
        burst(540, 400, ['#ffffff', '#8fd8c6'], 14, 1.1);
      }
    }
  },
  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'sponge') { sfx.drop(); return; }
    if (d.id === 'plaster') {
      if (!this.pawDone && dist(p.x, p.y, 392, 470) < 52) {
        this.pawDone = true; sfx.pop(); gainStar(1); toast('Plåster på tassen', 1400);
      } else sfx.drop();
      return;
    }
    if (d.id === 'bone') {
      if (!this.boneDone && dist(p.x, p.y, 306, 392) < 70) {
        const beforeWag = this.wag;
        this.boneDone = true; this.wag = 2.4; gainStar(1);
        sfx.bark(); sfx.good(); toast('Mums!', 1200);
        addHearts(306, 320, 3);
      } else {
        this.bone = null; sfx.drop();
      }
    }
  },
};

SCENE_META.push({
  id: 'vet', label: 'Djurkliniken', icon: 'paw',
  desc: 'Tvätta och plåstra hunden', say: 'Tvätta hunden och sätt på ett plåster.',
  steps: ['Dra svampen över fläckarna.', 'Sätt plåster på tassen.', 'Ge hunden ett ben.'],
});
DEMOS.vet = function () {
  if (!SCENES.vet.spots) return null;
  const spot = SCENES.vet.spots[0], sp = SCENES.vet.items()[0];
  return { from: { x: sp.x, y: sp.y }, to: { x: spot.x, y: spot.y }, r: 40 };
};
HINTS.vet = function () {
  const sc = SCENES.vet;
  if (!sc.spots) return null;
  if (!sc.washDone) return { x: sc.items()[0].x, y: sc.items()[0].y, r: 38 };
  if (!sc.pawDone) return { x: sc.items()[1].x, y: sc.items()[1].y, r: 36 };
  if (!sc.boneDone) return { x: sc.items()[2].x, y: sc.items()[2].y, r: 38 };
  return null;
};