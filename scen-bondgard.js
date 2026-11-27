// ============================================================
//  BONDGÅRDEN — mjölka kon, borsta hästen, samla äggen
// ============================================================

SCENES.farm = {
  reset() {
    // lera på hästens kropp
    this.spots = [
      { x: 482, y: 366, w: 0 },
      { x: 536, y: 402, w: 0 },
      { x: 578, y: 356, w: 0 },
    ];
    // ägg i halmen
    this.eggs = [
      { x: 752, y: 468, got: false },
      { x: 806, y: 486, got: false },
      { x: 858, y: 462, got: false },
    ];
    this.bucketDone = false; this.brushDone = false; this.eggsDone = false;
    this.milk = 0; this.milking = 0; this.squirt = 0;
    this.drag = null; this.tool = null; this.eggDrag = null;
    this.done = 0; this.result = 0; this.said = false;
    this.tail = 0; this.chew = 0;
  },
  items() {
    return [
      { id: 'bucket', x: 520, y: 596, r: 46 },
      { id: 'brush', x: 680, y: 596, r: 46 },
    ];
  },
  bucketSpot() { return { x: 136, y: 492 }; },
  basketSpot() { return { x: 676, y: 470 }; },
  horseNap() { return { x: 530, y: 388 }; },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    // himmel och äng
    noStroke();
    fill('#dff1f9'); rect(0, 0, W, 402);
    fill('#ffffff'); ellipse(140, 96, 120, 44); ellipse(186, 88, 84, 36);
    fill('#fdf6c8'); ellipse(806, 74, 66, 66);
    fill('#a9d89e'); rect(0, 396, W, H - 396);
    fill('#9ccf92'); rect(0, 396, W, 10);
    // grässtrån
    strokeA('#8cc283', 160); strokeWeight(3);
    for (let i = 0; i < 26; i++) {
      const gx = 20 + i * 39, gy = 420 + (i % 3) * 22;
      line(gx, gy, gx + 4, gy - 12);
    }
    noStroke();

    this.drawBarn(t);
    this.drawCow(t);
    this.drawHorse(t);
    this.drawHay(t);

    // ägg kvar i halmen
    for (const e of this.eggs) {
      if (e.got) continue;
      if (this.eggDrag && this.eggDrag.egg === e) continue;
      this.drawEgg(e.x, e.y, 0.9);
    }
    // ägget man håller
    if (this.eggDrag) this.drawEgg(this.eggDrag.x, this.eggDrag.y, 1.05);

    // hink med mjölk under kon
    if (this.bucketDone || this.milking > 0) {
      this.drawBucket(this.bucketSpot().x, this.bucketSpot().y + 6, 1);
      if (this.milk > 0) {
        fill('#fffdf6'); rect(this.bucketSpot().x - 22, this.bucketSpot().y + 2, 44, 22 * this.milk, 6);
      }
    }
    // mjölkstrålar
    if (this.milking > 0) {
      for (let i = 0; i < 2; i++) {
        strokeA('#ffffff', 220); strokeWeight(4);
        line(this.bucketSpot().x + (i ? 18 : -18), 448, this.bucketSpot().x + (i ? 8 : -8), this.bucketSpot().y - 4);
      }
      noStroke();
    }

    // bricka
    drawToolTray(452, 396, '#f6f2e2');
    for (const it of this.items()) {
      fill('#fffdf8'); ellipse(it.x, it.y, it.r * 2 - 8, it.r * 2 - 8);
      if (it.id === 'bucket') this.drawBucket(it.x, it.y + 4, 1);
      else this.drawBrush(it.x, it.y, 1);
    }

    // ringar medan man drar
    const d = this.drag;
    if (d) {
      if (d.id === 'bucket' && !this.bucketDone && dist(d.x, d.y, this.bucketSpot().x, this.bucketSpot().y) < 120) {
        hoverRing(this.bucketSpot().x, this.bucketSpot().y, 52);
      }
      if (d.id === 'brush') {
        for (const s of this.spots) if (s.w < 1 && dist(d.x, d.y, s.x, s.y) < 80) hoverRing(s.x, s.y, 34);
      }
      push(); translate(d.x, d.y - 26);
      if (d.id === 'bucket') this.drawBucket(0, 4, 1.15); else { rotate(0.2); this.drawBrush(0, 0, 1.15); }
      pop();
    }
    if (this.eggDrag) {
      const b = this.basketSpot();
      if (dist(this.eggDrag.x, this.eggDrag.y, b.x, b.y) < 110) hoverRing(b.x, b.y - 6, 46);
    }

    this.done = (this.bucketDone ? 1 : 0) + (this.brushDone ? 1 : 0) + (this.eggsDone ? 1 : 0);
    if (this.done >= 3 && !this.said) {
      this.said = true; this.result = 3000;
      setMood('happy', 3600); sfx.pling(); sfx.good();
      addHearts(500, 260, 5); burst(500, 320, ['#f7c948', '#ffffff', '#a9d89e'], 18, 1.2);
      speak('Vilken duktig bonde du är!');
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 420, 0, 1);
      fillA('#ffffff', 245 * a); rect(W / 2 - 176, 186, 352, 92, 24);
      fillA('#7fbf8f', 255 * a); textAlign(CENTER, CENTER); textSize(18);
      text('BONDGÅRDEN MÅR BRA!', W / 2, 232);
      if (this.result <= 0) this.result = 0;
    }

    // små rörelser
    if (this.milking > 0) {
      this.milking -= deltaTime;
      this.milk = constrain(1 - this.milking / 1500, 0, 1);
      if (this.milking <= 0) {
        this.milking = 0; this.milk = 1;
        if (!this.bucketDone) {
          this.bucketDone = true; gainStar(1); sfx.good();
          toast('Mjölken är klar!', 1500);
        }
      }
    }
    if (this.chew > 0) this.chew -= deltaTime / 600;
  },

  // ----------------------------------------------------------
  drawBarn(t) {
    noStroke();
    // lada
    fill('#b8443a'); rect(6, 176, 348, 240, 8);
    fill('#c9584a'); rect(14, 168, 332, 232, 8);
    // tak
    fill('#8a3a34'); triangle(-6, 172, 366, 172, 180, 74);
    fillA('#ffffff', 60); triangle(24, 164, 336, 164, 180, 92);
    // dörr
    fill('#fff6ec'); rect(96, 268, 168, 148, 6);
    fill('#c9584a'); rect(104, 276, 68, 140, 4); rect(188, 276, 68, 140, 4);
    strokeA('#fff6ec', 220); strokeWeight(6);
    line(104, 276, 172, 416); line(188, 276, 256, 416);
    noStroke();
    // lucka på loftet
    fill('#fff6ec'); rect(150, 200, 60, 52, 5);
    fill('#8a3a34'); rect(156, 206, 48, 40, 3);
    // halmbalar vid sidan
    fill('#e8c877'); rect(316, 372, 44, 44, 6); rect(316, 330, 44, 40, 6);
  },

  drawCow(t) {
    const bob = sin(t * 1.3) * 2;
    push(); translate(-50, bob);
    noStroke();
    // skugga
    fillA('#000000', 18); ellipse(190, 486, 250, 26);
    // ben
    fill('#f3f0ea');
    rect(112, 430, 26, 56, 10); rect(150, 436, 26, 52, 10);
    rect(226, 436, 26, 52, 10); rect(258, 430, 26, 56, 10);
    fill('#5b5049'); rect(112, 474, 26, 14, 6); rect(150, 478, 26, 12, 6);
    rect(226, 478, 26, 12, 6); rect(258, 474, 26, 14, 6);
    // kropp
    fill('#fdfaf3'); ellipse(190, 386, 210, 126);
    fill('#4a3f39');
    ellipse(146, 372, 62, 46); ellipse(230, 404, 46, 34); ellipse(206, 350, 34, 26);
    // juver
    fill('#f2b3b8'); ellipse(186, 448, 46, 30);
    fill('#e39aa1'); ellipse(176, 458, 10, 14); ellipse(196, 458, 10, 14);
    // svans
    push(); translate(288, 372); rotate(0.2 + sin(t * 2.2) * 0.12);
    stroke('#fdfaf3'); strokeWeight(7); line(0, 0, 26, 54); noStroke();
    fill('#4a3f39'); ellipse(27, 58, 12, 16); pop();
    // huvud
    fill('#fdfaf3'); ellipse(322, 330, 92, 84);
    fill('#4a3f39'); ellipse(300, 312, 30, 24);
    // öron
    fill('#f2b3b8'); ellipse(282, 348, 30, 20); ellipse(360, 344, 28, 18);
    // nos
    fill('#f6c9c4'); ellipse(340, 356, 62, 44);
    fill('#d98f92'); ellipse(322, 356, 8, 6); ellipse(340, 356, 8, 6);
    strokeA('#b8737a', 220); strokeWeight(2); noFill();
    arc(332, 366, 26, 16, 0.1, PI - 0.1); noStroke();
    // öga
    fill('#ffffff'); ellipse(318, 318, 22, 22);
    fill('#3a332e'); ellipse(320, 318, 11, 13);
    fillA('#ffffff', 230); ellipse(317, 314, 4, 4);
    // horn
    fill('#e8dcc8'); push(); translate(300, 292); rotate(-0.5); triangle(-4, 8, 4, 8, 0, -12); pop();
    push(); translate(348, 288); rotate(0.35); triangle(-4, 8, 4, 8, 0, -12); pop();
    // klöver i munnen
    fill('#7fbf7f'); ellipse(368, 372, 18, 14); ellipse(382, 366, 12, 10);
    pop();
  },

  drawHorse(t) {
    push(); translate(30, 0);
    noStroke();
    // skugga
    fillA('#000000', 18); ellipse(500, 486, 250, 26);
    // ben
    fill('#b07a4a');
    rect(428, 432, 26, 56, 10); rect(462, 438, 26, 50, 10);
    rect(534, 438, 26, 50, 10); rect(566, 432, 26, 56, 10);
    fill('#5b4433'); rect(428, 476, 26, 14, 6); rect(462, 480, 26, 12, 6);
    rect(534, 480, 26, 12, 6); rect(566, 476, 26, 14, 6);
    // kropp
    fill('#c08552'); ellipse(500, 388, 206, 128);
    fillA('#ffffff', 60); ellipse(486, 358, 130, 54);
    // svans
    push(); translate(596, 372); rotate(0.3 + sin(t * 1.8) * 0.1);
    fill('#8a5a3b'); ellipse(8, 18, 26, 78); pop();
    // hals och huvud
    fill('#c08552');
    push(); translate(392, 350); rotate(-0.45); ellipse(0, 0, 62, 120); pop();
    fill('#c08552'); ellipse(372, 300, 88, 68);
    // man
    fill('#7d4f34'); ellipse(404, 330, 34, 90); ellipse(392, 292, 30, 40);
    // nos
    fill('#d8a97a'); ellipse(342, 314, 58, 40);
    fillA('#8a5a3b', 180); ellipse(330, 312, 8, 6);
    // öron + öga
    fill('#b07a4a'); triangle(392, 268, 404, 250, 412, 272);
    fill('#ffffff'); ellipse(384, 296, 20, 20);
    fill('#3a332e'); ellipse(384, 296, 10, 12);
    fillA('#ffffff', 230); ellipse(381, 292, 4, 4);
    // lera
    for (const s of this.spots) {
      if (s.w >= 1) continue;
      const k = 1 - s.w;
      fillA('#7b5a3a', 220 * k);
      ellipse(s.x, s.y, 40 * k + 8, 30 * k + 6);
      fillA('#5d4429', 180 * k);
      ellipse(s.x - 5, s.y - 3, 14 * k, 10 * k);
    }
    // borstad glans
    if (this.brushDone) {
      fillA('#ffffff', 70 + sin(t * 4) * 30);
      ellipse(470, 362, 120, 30);
    }
    pop();
  },

  drawHay(t) {
    noStroke();
    // halmhög
    fill('#e8c877'); ellipse(848, 512, 196, 80);
    fillA('#d8b45f', 200); ellipse(848, 520, 178, 60);
    strokeA('#c9a24f', 200); strokeWeight(4);
    for (let i = 0; i < 12; i++) {
      const a = -PI + (i / 11) * PI;
      line(848 + cos(a) * 84, 508 + sin(a) * 22, 848 + cos(a) * 96, 492 + sin(a) * 30);
    }
    noStroke();
    // korg
    const b = this.basketSpot();
    push(); translate(b.x, b.y - 6);
    fillA('#000000', 16); ellipse(0, 34, 74, 14);
    fill('#c99a5e'); ellipse(0, 0, 76, 30);
    fill('#b0803f'); beginShape();
    vertex(-38, 0); vertex(38, 0); vertex(26, 34); vertex(-26, 34);
    endShape(CLOSE);
    fillA('#8a5f2c', 200);
    for (let i = -1; i <= 1; i++) rect(i * 18 - 3, 2, 6, 30, 3);
    fill('#d8b06a'); ellipse(0, 0, 66, 22);
    fill('#b0803f'); noFill(); stroke('#a8783a'); strokeWeight(5);
    arc(0, -2, 56, 40, PI, TAU); noStroke();
    // ägg i korgen
    const n = this.eggs.filter(function (e) { return e.got; }).length;
    for (let i = 0; i < n; i++) this.drawEgg(-16 + i * 16, -10, 0.8);
    pop();
  },

  drawEgg(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fillA('#000000', 14); ellipse(0, 18, 26, 8);
    fill('#fffaf0'); ellipse(0, 0, 30, 38);
    fillA('#f0e2c8', 220); ellipse(5, 6, 16, 20);
    fillA('#ffffff', 200); ellipse(-6, -8, 8, 12);
    pop();
  },

  drawBucket(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fillA('#000000', 16); ellipse(0, 24, 62, 12);
    fill('#c9ced4'); beginShape();
    vertex(-28, -14); vertex(28, -14); vertex(22, 22); vertex(-22, 22);
    endShape(CLOSE);
    fill('#e2e8ec'); ellipse(0, -14, 56, 18);
    fillA('#9aa4ab', 200); ellipse(0, -13, 44, 12);
    fill('#fdfaf3'); ellipse(0, -13, 34, 8);
    noFill(); stroke('#8d949a'); strokeWeight(4);
    arc(0, -16, 50, 34, PI, TAU); noStroke();
    pop();
  },

  drawBrush(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fillA('#000000', 16); ellipse(0, 22, 62, 12);
    // trähandtag
    fill('#c99a5e'); rect(-8, -34, 16, 30, 7);
    fillA('#ffffff', 100); rect(-4, -30, 5, 22, 2);
    // borsthuvud
    fill('#a9784a'); rect(-26, -6, 52, 18, 8);
    fillA('#ffffff', 90); rect(-20, -3, 32, 5, 2);
    // borst
    fill('#efe6d2');
    for (let i = 0; i < 8; i++) rect(-24 + i * 6, 11, 4, 12, 2);
    fillA('#c9bda3', 200);
    for (let i = 0; i < 8; i++) rect(-24 + i * 6, 19, 4, 4, 1);
    pop();
  },

  down(p) {
    for (const e of this.eggs) {
      if (e.got) continue;
      if (dist(p.x, p.y, e.x, e.y) < 42) {
        this.eggDrag = { egg: e, x: p.x, y: p.y };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
    for (const it of this.items()) {
      if (it.id === 'bucket' && this.bucketDone) continue;
      if (dist(p.x, p.y, it.x, it.y) < it.r + 12) {
        this.tool = it.id; this.drag = { x: p.x, y: p.y, id: it.id };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },

  move(p) {
    if (this.eggDrag) { this.eggDrag.x = p.x; this.eggDrag.y = p.y; return; }
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id !== 'brush') return;
    for (const s of this.spots) {
      if (s.w >= 1) continue;
      if (dist(p.x, p.y, s.x, s.y) < 56) {
        s.w = min(1, s.w + 0.15);
        if (frameCount % 6 === 0) sfx.splash();
        if (frameCount % 3 === 0) {
          G.parts.push({
            x: s.x + random(-12, 12), y: s.y + random(-8, 8),
            vx: random(-0.7, 0.7), vy: random(-1.3, -0.3),
            r: random(3, 5), life: 1, col: '#c9a878', spin: 0,
          });
        }
      }
    }
    if (!this.brushDone && this.spots.every(function (s) { return s.w >= 1; })) {
      this.brushDone = true; gainStar(1); sfx.good();
      toast('Hästen är fin!', 1500);
      burst(this.horseNap().x, this.horseNap().y, ['#ffffff', '#e8dcc8'], 14, 1.1);
    }
  },

  up(p) {
    if (this.eggDrag) {
      const e = this.eggDrag.egg, b = this.basketSpot();
      const drop = dist(p.x, p.y, b.x, b.y) < 100;
      this.eggDrag = null; G.dragAny = false;
      if (drop) {
        e.got = true; sfx.pop();
        if (!this.eggsDone && this.eggs.every(function (x) { return x.got; })) {
          this.eggsDone = true; gainStar(1); sfx.good(); sfx.pling();
          toast('Alla ägg i korgen!', 1600);
          addHearts(b.x, b.y - 40, 3);
        }
      } else sfx.drop();
      return;
    }
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'bucket') {
      const s = this.bucketSpot();
      if (!this.bucketDone && dist(p.x, p.y, s.x, s.y) < 90) {
        this.milking = 1500; this.milk = 0; sfx.splash();
        toast('Mjölka kon …', 1200);
      } else sfx.drop();
      return;
    }
    sfx.drop();
  },
};

SCENE_META.push({
  id: 'farm', label: 'Bondgården', icon: 'cow',
  desc: 'Mjölka, borsta och samla ägg', say: 'Mjölka kon, borsta hästen och samla äggen.',
  steps: ['Sätt hinken under kon.', 'Borsta hästen ren.', 'Lägg äggen i korgen.'],
});
DEMOS.farm = function () {
  const sc = SCENES.farm;
  if (!sc.eggs) return null;
  const it = sc.items()[0];
  return { from: { x: it.x, y: it.y }, to: { x: sc.bucketSpot().x, y: sc.bucketSpot().y }, r: 46 };
};
HINTS.farm = function () {
  const sc = SCENES.farm;
  if (!sc.eggs) return null;
  if (!sc.bucketDone) return { x: sc.items()[0].x, y: sc.items()[0].y, r: 42 };
  if (!sc.brushDone) return { x: sc.items()[1].x, y: sc.items()[1].y, r: 42 };
  if (!sc.eggsDone) {
    const e = sc.eggs.filter(function (x) { return !x.got; })[0];
    if (e) return { x: e.x, y: e.y, r: 30 };
  }
  return null;
};