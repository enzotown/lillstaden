// ============================================================
//  BRANDSTATIONEN — släck elden, res katten, sätt på hjälmen
// ============================================================

SCENES.fire = {
  reset() {
    // tre lågor på huset
    this.flames = [
      { x: 762, y: 272, w: 0, s: 1.0 },
      { x: 818, y: 236, w: 0, s: 1.25 },
      { x: 890, y: 282, w: 0, s: 0.85 },
    ];
    this.houseX = 686; this.houseY = 340;
    this.ladderDone = false; this.helmetDone = false; this.fireDone = false;
    this.catDown = 0;
    this.drag = null; this.tool = null;
    this.done = 0; this.result = 0; this.said = false;
    this.smoke = 0;
  },
  items() {
    return [
      { id: 'slang', x: 470, y: 596, r: 46 },
      { id: 'stege', x: 640, y: 596, r: 46 },
      { id: 'hjalmen', x: 810, y: 596, r: 46 },
    ];
  },
  head() { return { x: 566, y: 524 - 214 * 0.82, r: 44 }; },
  catSpot() { return { x: 866, y: 386 }; },
  ladderSpot() { return { x: 856, y: 432 }; },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    drawRoom({ wall: '#e4eef3', wall2: '#d3e3ec', floor: '#dcd2c4', floorY: 486 });

    // garageport
    fill('#c9d5dc'); rect(44, 118, 300, 368, 12);
    for (let i = 0; i < 8; i++) {
      fillA('#ffffff', 110); rect(52, 126 + i * 44, 284, 34, 7);
    }
    fillA('#000000', 20); rect(44, 118, 300, 12, 6);
    // skylt på väggen
    fillA('#000000', 18); rect(524, 186, 200, 56, 12);
    fill('#ffffff'); rect(522, 182, 200, 56, 12);
    fill('#e2604a'); textAlign(CENTER, CENTER); textSize(14);
    text('BRAND', 622, 200);
    fill('#a08e80'); textSize(8.5);
    text('SLÄCK · RÄDDA · HJÄLP', 622, 220);

    // slangrulle på väggen
    fill('#8d8f96'); rect(392, 176, 76, 70, 10);
    fill('#e2604a'); ellipse(430, 210, 58, 58);
    fill('#c9ced4'); ellipse(430, 210, 26, 26);

    // golvlinje
    fillA('#000000', 14); rect(0, 480, W, 10);

    this.drawTruck(t);

    // huset som brinner
    this.drawHouse(t);

    // brandmannen
    this.drawFirefighter(t);

    // stegen lutad mot fönstret
    if (this.ladderDone) this.drawLadderPlaced(t);

    // katten
    const cd = this.catDown;
    if (this.ladderDone) {
      // klättrar ner och sitter på marken vid stegen
      const cy = 498 + sin(t * 2.2) * 1.5;
      this.drawCat(800, cy, 1.0, true, t);
    } else {
      this.drawCat(866, 386, 0.9, false, t);
    }

    // bricka
    drawToolTray(392, 476, '#fdeee9');
    for (const it of this.items()) {
      fill('#fff7f3'); ellipse(it.x, it.y, it.r * 2 - 8, it.r * 2 - 8);
      if (it.id === 'slang') this.drawNozzle(it.x, it.y, 1);
      else if (it.id === 'stege') this.drawLadderIcon(it.x, it.y, 1);
      else this.drawHelmet(it.x, it.y, 1);
    }

    // ringar medan man håller något
    const d = this.drag;
    if (d) {
      if (d.id === 'slang') {
        for (const f of this.flames) if (f.w < 1 && dist(d.x, d.y, f.x, f.y) < 78) hoverRing(f.x, f.y, 40);
      } else if (d.id === 'stege' && !this.ladderDone && dist(d.x, d.y, this.ladderSpot().x, this.ladderSpot().y) < 120) {
        hoverRing(this.ladderSpot().x, this.ladderSpot().y, 58);
      } else if (d.id !== 'slang' && d.id !== 'stege' && !this.helmetDone && dist(d.x, d.y, this.head().x, this.head().y) < 110) {
        hoverRing(this.head().x, this.head().y - 26, 54);
      }
      // dragen bild överst
      push(); translate(d.x, d.y - 26);
      if (d.id === 'slang') { rotate(-0.3); this.drawNozzle(0, 0, 1.15); }
      else if (d.id === 'stege') { rotate(0.1); this.drawLadderIcon(0, 0, 1.15); }
      else { this.drawHelmet(0, 0, 1.2); }
      pop();
    }

    this.done = (this.fireDone ? 1 : 0) + (this.ladderDone ? 1 : 0) + (this.helmetDone ? 1 : 0);
    if (this.done >= 3 && !this.said) {
      this.said = true; this.result = 3000;
      setMood('happy', 3600); sfx.pling(); sfx.good();
      addHearts(566, 250, 5); burst(566, 300, ['#f7c948', '#e2604a', '#ffffff'], 18, 1.2);
      speak('Vilken brandman du är!');
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 420, 0, 1);
      fillA('#ffffff', 245 * a); rect(W / 2 - 176, 190, 352, 92, 24);
      fillA('#e2604a', 255 * a); textAlign(CENTER, CENTER); textSize(18);
      text('BRANDEN ÄR SLÄCKT!', W / 2, 236);
      if (this.result <= 0) this.result = 0;
    }
  },

  // ----------------------------------------------------------
  drawTruck(t) {
    push(); translate(92, 296);
    noStroke();
    fillA('#000000', 24); ellipse(200, 206, 400, 34);
    // flak/kropp
    fill('#e2604a'); rect(54, 34, 344, 96, 12);
    fillA('#ffffff', 80); rect(60, 38, 332, 14, 7);
    fill('#c94b3a'); rect(54, 104, 344, 26, 10);
    // hytt
    fill('#e2604a'); rect(0, -14, 168, 78, 16);
    fillA('#ffffff', 90); rect(6, -10, 156, 12, 6);
    fill('#cfe9f2'); rect(16, 0, 58, 44, 9);
    fill('#cfe9f2'); rect(86, 0, 58, 44, 9);
    fillA('#ffffff', 150); rect(20, 6, 20, 20, 5);
    // kofångare
    fill('#a9b1b8'); rect(-12, 96, 26, 30, 8);
    fill('#f7c948'); ellipse(-1, 78, 16, 22);
    // stege på taket
    fill('#f7c948'); rect(30, 22, 320, 10, 5); rect(30, 4, 320, 8, 4);
    strokeA('#d8a428', 220); strokeWeight(3);
    for (let i = 0; i < 9; i++) line(46 + i * 34, 4, 46 + i * 34, 32);
    noStroke();
    // blåljus
    fill('#7fa8c9'); rect(40, -26, 46, 14, 7);
    fillA('#bfe3f2', 160 + sin(t * 7) * 70); rect(40, -26, 46, 14, 7);
    fill('#8d8f96'); rect(34, -14, 8, 10, 3); rect(84, -14, 8, 10, 3);
    // hjul
    fill('#4a3f39'); ellipse(96, 142, 78, 78); ellipse(330, 142, 78, 78);
    fill('#c9ced4'); ellipse(96, 142, 36, 36); ellipse(330, 142, 36, 36);
    fill('#8d8f96'); ellipse(96, 142, 14, 14); ellipse(330, 142, 14, 14);
    pop();
  },

  drawHouse(t) {
    const hx = this.houseX, hy = this.houseY;
    noStroke();
    // skugga
    fillA('#000000', 26); ellipse(hx + 130, 508, 300, 28);
    // vägg
    fill('#d8a97a'); rect(hx, hy, 268, 162, 6);
    for (let i = 0; i < 4; i++) { fillA('#b5834f', 90); rect(hx, hy + 12 + i * 40, 268, 5); }
    // tak
    fill('#a2623f'); triangle(hx - 14, hy + 4, hx + 282, hy + 4, hx + 134, hy - 116);
    fillA('#000000', 30); triangle(hx - 14, hy + 4, hx + 282, hy + 4, hx + 134, hy - 116);
    fill('#b87450'); triangle(hx + 8, hy - 4, hx + 260, hy - 4, hx + 134, hy - 96);
    // dörr
    fill('#7d4f34'); rect(hx + 26, hy + 66, 62, 96, 6);
    fill('#f7c948'); ellipse(hx + 78, hy + 116, 9, 9);
    // fönster med katt
    fill('#cfe9f2'); rect(hx + 150, hy + 34, 82, 76, 8);
    fillA('#ffffff', 120); rect(hx + 156, hy + 40, 26, 24, 5);
    stroke('#ffffff'); strokeWeight(6); line(hx + 191, hy + 34, hx + 191, hy + 110);
    line(hx + 150, hy + 72, hx + 232, hy + 72); noStroke();
    fillA('#000000', 30); rect(hx + 150, hy + 34, 82, 76, 8);

    // lågor
    for (const f of this.flames) {
      const k = 1 - f.w;
      if (k <= 0.02) continue;
      push(); translate(f.x, f.y);
      const fl = 1 + sin(t * 7 + f.x) * 0.06;
      scale(f.s * k * fl, f.s * k * fl);
      fillA('#e2604a', 60); ellipse(0, 6, 76, 74);
      fill('#f7a03c');
      beginShape();
      vertex(0, -48); bezierVertex(24, -26, 30, -4, 24, 12);
      bezierVertex(18, 30, 8, 36, 0, 36);
      bezierVertex(-8, 36, -18, 30, -24, 12);
      bezierVertex(-30, -4, -24, -26, 0, -48);
      endShape(CLOSE);
      fill('#f7c948');
      beginShape();
      vertex(2, -20); bezierVertex(14, -4, 13, 14, 0, 22);
      bezierVertex(-13, 14, -12, -4, 2, -20);
      endShape(CLOSE);
      fillA('#ffffff', 150); ellipse(-8, 8, 9, 15);
      pop();
    }
    // rök
    if (!this.fireDone) {
      for (let i = 0; i < 3; i++) {
        const ph = ((millis() / 2200) + i / 3) % 1;
        fillA('#a8b1b8', 70 * (1 - ph));
        ellipse(hx + 120 + sin(ph * 6 + i) * 26, hy - 120 - ph * 150, 30 + ph * 60, 26 + ph * 50);
      }
    }
  },

  drawFirefighter(t) {
    const h = this.head();
    noStroke();
    // skugga
    fillA('#000000', 22); ellipse(h.x, 526, 126, 22);
    push(); translate(h.x, 524); scale(0.82);
    // (ritas i lokal skala, fötterna i 0,0)
    // ben
    fill('#3f5a6b'); rect(-38, -72, 32, 64, 11); rect(6, -72, 32, 64, 11);
    fill('#4a3f39'); rect(-44, -20, 44, 20, 8); rect(0, -20, 44, 20, 8);
    // jacka
    fill('#f7c948'); rect(-50, -176, 100, 104, 20);
    fillA('#ffffff', 70); rect(-43, -169, 30, 84, 14);
    fill('#eef4f6'); rect(-50, -128, 100, 11);
    fill('#eef4f6'); rect(-50, -92, 100, 9);
    // knappar
    fill('#a08e80'); ellipse(0, -152, 6, 6); ellipse(0, -140, 6, 6);
    // armar
    fill('#f7c948'); rect(-74, -170, 27, 84, 13); rect(47, -170, 27, 84, 13);
    fill('#f6c9a4'); ellipse(-60, -82, 25, 23); ellipse(60, -82, 25, 23);
    // ansikte
    drawFace(0, -214, 46, {
      skin: '#f6c9a4', hair: 'short', hairCol: '#6b4a33',
      mouth: 'smile', eyes: 'open', blushCol: '#f08a90',
    });
    // hjälm
    if (this.helmetDone) this.drawHelmet(0, -244, 1.32);
    pop();
  },

  drawCat(x, y, s, happy, t) {
    push(); translate(x, y); scale(s);
    noStroke();
    // svans
    push(); translate(20, 2); rotate(-0.5 + sin(t * 3) * 0.25);
    fill('#e8955a'); rect(0, -4, 34, 9, 5); pop();
    // kropp
    fill('#efa869'); ellipse(0, 4, 52, 40);
    fillA('#ffffff', 120); ellipse(-6, 10, 30, 20);
    // huvud
    fill('#efa869'); ellipse(0, -20, 40, 36);
    // öron
    triangle(-16, -34, -6, -46, -2, -32);
    triangle(16, -34, 6, -46, 2, -32);
    fillA('#f2a0b4', 200); triangle(-13, -35, -7, -42, -5, -33); triangle(13, -35, 7, -42, 5, -33);
    // ögon
    if (happy) {
      stroke('#4a3f39'); strokeWeight(2.4); noFill();
      arc(-8, -22, 10, 8, PI * 1.1, PI * 1.9); arc(8, -22, 10, 8, PI * 1.1, PI * 1.9);
      noStroke();
    } else {
      fill('#4a3f39'); ellipse(-8, -22, 7, 9); ellipse(8, -22, 7, 9);
      fillA('#ffffff', 220); ellipse(-10, -24, 3, 3); ellipse(6, -24, 3, 3);
    }
    // nos + morrhår
    fill('#f2a0b4'); triangle(-3, -14, 3, -14, 0, -10);
    strokeA('#c98a5e', 200); strokeWeight(1.6);
    line(-6, -13, -20, -16); line(-6, -11, -20, -8);
    line(6, -13, 20, -16); line(6, -11, 20, -8);
    noStroke();
    pop();
  },

  drawLadderPlaced(t) {
    push(); translate(872, 504); rotate(-0.13);
    noStroke();
    fillA('#000000', 22); rect(-30, -8, 76, 9, 4);
    fill('#e0b878'); rect(-26, -172, 10, 180, 5); rect(18, -172, 10, 180, 5);
    fill('#c99a5e');
    for (let i = 0; i < 7; i++) rect(-18, -164 + i * 24, 36, 7, 3);
    fillA('#ffffff', 80); rect(-24, -170, 4, 172, 2);
    pop();
  },

  drawNozzle(x, y, sc) {
    push(); translate(x, y); scale(sc); noStroke();
    fillA('#000000', 18); ellipse(0, 18, 56, 12);
    // handtag
    fill('#e2604a'); rect(-12, -4, 24, 34, 8);
    fillA('#ffffff', 90); rect(-8, 0, 7, 22, 3);
    // rör
    fill('#a9b1b8'); rect(-9, -26, 18, 26, 6);
    fill('#c9ced4'); rect(-6, -22, 6, 18, 3);
    // munstycke
    fill('#8d8f96'); rect(-13, -36, 26, 14, 6);
    fill('#5f6b73'); ellipse(0, -38, 22, 8);
    // vattendroppe
    fillA('#bfe3f2', 210); ellipse(0, -50, 8, 11);
    pop();
  },

  drawLadderIcon(x, y, sc) {
    push(); translate(x, y); scale(sc); noStroke();
    fillA('#000000', 16); ellipse(0, 20, 62, 10);
    fill('#e0b878'); rect(-26, -30, 9, 52, 4); rect(17, -30, 9, 52, 4);
    fill('#c99a5e');
    for (let i = 0; i < 4; i++) rect(-18, -26 + i * 14, 36, 6, 3);
    fillA('#ffffff', 90); rect(-24, -28, 4, 48, 2);
    pop();
  },

  drawHelmet(x, y, sc) {
    push(); translate(x, y); scale(sc); noStroke();
    // skugga
    fillA('#000000', 16); ellipse(0, 22, 74, 12);
    // hakrem
    stroke('#e0b878'); strokeWeight(3); noFill();
    arc(0, 4, 52, 44, PI * 0.15, PI * 0.85); noStroke();
    // kulle
    fill('#f7c948'); arc(0, 2, 64, 54, PI, TAU);
    fill('#e8b93f'); arc(0, 2, 64, 54, PI, TAU);
    fill('#f7c948'); arc(0, 0, 64, 50, PI, TAU);
    fillA('#ffffff', 120); arc(-6, -2, 40, 30, PI, TAU);
    // skärm
    fill('#f7c948'); rect(-44, 0, 88, 10, 5);
    fill('#e8b93f'); rect(-44, 6, 88, 5, 3);
    // märke
    fill('#e2604a'); rect(-11, -16, 22, 18, 5);
    fill('#ffffff'); textAlign(CENTER, CENTER); textSize(11);
    text('1', 0, -8);
    pop();
  },

  down(p) {
    for (const it of this.items()) {
      if (dist(p.x, p.y, it.x, it.y) < it.r + 12) {
        if (it.id === 'stege' && this.ladderDone) continue;
        if (it.id !== 'slang' && it.id !== 'stege' && this.helmetDone) continue;
        this.tool = it.id; this.drag = { x: p.x, y: p.y, id: it.id };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },

  move(p) {
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id !== 'slang' || this.fireDone) return;
    for (const f of this.flames) {
      if (f.w >= 1) continue;
      if (dist(p.x, p.y, f.x, f.y) < 74) {
        f.w = min(1, f.w + 0.11);
        if (frameCount % 5 === 0) sfx.splash();
        if (frameCount % 2 === 0) {
          G.parts.push({
            x: f.x + random(-16, 16), y: f.y + random(-10, 10),
            vx: random(-0.8, 0.8), vy: random(-1.6, -0.4),
            r: random(3, 6), life: 1, col: '#bfe3f2', spin: 0,
          });
        }
      }
    }
    if (!this.fireDone && this.flames.every(function (f) { return f.w >= 1; })) {
      this.fireDone = true; gainStar(1); sfx.good();
      toast('Elden är släckt!', 1500);
      burst(816, 360, ['#bfe3f2', '#ffffff'], 16, 1.1);
    }
  },

  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'slang') { sfx.drop(); return; }
    if (d.id === 'stege') {
      const s = this.ladderSpot();
      if (!this.ladderDone && dist(p.x, p.y, s.x, s.y) < 110) {
        this.ladderDone = true; gainStar(1); sfx.pop(); sfx.good();
        toast('Katten är räddad!', 1600);
        addHearts(866, 420, 3);
        this.catDown = 1;
      } else sfx.drop();
      return;
    }
    // hjälm
    const h = this.head();
    if (!this.helmetDone && dist(p.x, p.y, h.x, h.y) < 96) {
      this.helmetDone = true; gainStar(1); sfx.pop();
      toast('Hjälmen på!', 1400);
      addHearts(h.x, h.y - 40, 2);
    } else sfx.drop();
  },
};

SCENE_META.push({
  id: 'fire', label: 'Brandstationen', icon: 'flame',
  desc: 'Släck eld och rädda katten', say: 'Släck elden, res katten och sätt på hjälmen.',
  steps: ['Dra slangen över lågorna.', 'Luta stegen mot fönstret.', 'Sätt hjälmen på brandmannen.'],
});
DEMOS.fire = function () {
  const sc = SCENES.fire;
  if (!sc.flames) return null;
  const f = sc.flames.filter(function (x) { return x.w < 1; })[0] || sc.flames[0];
  const it = sc.items()[0];
  return { from: { x: it.x, y: it.y }, to: { x: f.x, y: f.y }, r: 40 };
};
HINTS.fire = function () {
  const sc = SCENES.fire;
  if (!sc.flames) return null;
  if (!sc.fireDone) return { x: sc.items()[0].x, y: sc.items()[0].y, r: 42 };
  if (!sc.ladderDone) return { x: sc.items()[1].x, y: sc.items()[1].y, r: 42 };
  if (!sc.helmetDone) return { x: sc.items()[2].x, y: sc.items()[2].y, r: 42 };
  return null;
};