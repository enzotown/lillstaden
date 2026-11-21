// ============================================================
//  FISKEBRYGGAN — håva fisk, lägg i hinken, mata måsen
// ============================================================

SCENES.pier = {
  reset() {
    this.fish = [
      { x: 286, y: 384, w: 0, caught: false, got: false, ph: 0.4 },
      { x: 470, y: 408, w: 0, caught: false, got: false, ph: 2.1 },
      { x: 664, y: 380, w: 0, caught: false, got: false, ph: 4.0 },
    ];
    this.caught = 0;             // fiskar i hinken
    this.gullFed = false; this.gullFly = 0;
    this.drag = null; this.tool = null; this.fishDrag = null;
    this.done = 0; this.result = 0; this.said = false;
    this.wave = 0;
  },
  items() {
    return [
      { id: 'hav', x: 470, y: 596, r: 46 },
      { id: 'brod', x: 640, y: 596, r: 46 },
    ];
  },
  bucketSpot() { return { x: 652, y: 500 }; },
  gullSpot() { return { x: 74, y: 286 }; },
  dockSpot(i) { return { x: 300 + i * 92, y: 496 }; },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    // himmel
    noStroke();
    fill('#e8f6fd'); rect(0, 0, W, 300);
    fill('#cfeaf7'); rect(0, 210, W, 92);
    fill('#fdf6c8'); ellipse(858, 92, 78, 78);
    fillA('#f7e08a', 120); ellipse(858, 92, 118, 118);
    fill('#ffffff'); ellipse(220, 96, 132, 46); ellipse(286, 86, 96, 38);
    // hav
    fill('#8fc9e0'); rect(0, 298, W, 174);
    fill('#7fbfd8'); rect(0, 356, W, 116);
    strokeA('#ffffff', 150); strokeWeight(3);
    for (let i = 0; i < 12; i++) {
      const wy = 312 + (i % 4) * 42;
      const off = sin(t * 1.2 + i) * 10;
      line(20 + i * 84 + off, wy, 20 + i * 84 + 46 + off, wy);
    }
    noStroke();

    this.drawDock(t);
    this.drawGullPost(t);
    this.drawBoat(t);

    // fiskar i vattnet
    for (const f of this.fish) {
      if (f.caught) continue;
      const bob = sin(t * 1.6 + f.ph) * 5;
      push(); translate(f.x, f.y + bob);
      fillA('#000000', 14); ellipse(0, 10, 34, 8);
      this.drawFish(0, 0, 0.85, 1);
      pop();
    }
    // fiskar på bryggan (fångade, väntar på hinken)
    for (const f of this.fish) {
      if (!f.caught || f.got) continue;
      const d = this.dockSpot(this.fish.indexOf(f));
      if (this.fishDrag && this.fishDrag.f === f) continue;
      this.drawFish(d.x, d.y, 0.95, 1 - f.w);
    }
    // fisken man håller
    if (this.fishDrag) this.drawFish(this.fishDrag.x, this.fishDrag.y, 1.1, 1);

    // hink med fiskar
    const b = this.bucketSpot();
    this.drawBucket(b.x, b.y, 1);
    for (let i = 0; i < this.caught; i++) {
      push(); translate(b.x - 14 + i * 14, b.y - 26 - (i % 2) * 4);
      this.drawFish(0, 0, 0.55, 1); pop();
    }

    // måsen
    this.drawGull(t);

    // bricka
    drawToolTray(390, 396, '#eef7fb');
    for (const it of this.items()) {
      fill('#f8fdff'); ellipse(it.x, it.y, it.r * 2 - 8, it.r * 2 - 8);
      if (it.id === 'hav') this.drawNet(it.x, it.y, 1);
      else this.drawBread(it.x, it.y, 1);
    }

    // ringar
    const d = this.drag;
    if (d) {
      if (d.id === 'hav') {
        for (const f of this.fish) if (!f.caught && dist(d.x, d.y, f.x, f.y) < 78) hoverRing(f.x, f.y, 36);
      } else if (!this.gullFed && dist(d.x, d.y, this.gullSpot().x, this.gullSpot().y) < 110) {
        hoverRing(this.gullSpot().x, this.gullSpot().y + 8, 40);
      }
      push(); translate(d.x, d.y - 26);
      if (d.id === 'hav') { rotate(-0.25); this.drawNet(0, 0, 1.15); }
      else { rotate(0.15); this.drawBread(0, 0, 1.2); }
      pop();
    }
    if (this.fishDrag && dist(this.fishDrag.x, this.fishDrag.y, b.x, b.y) < 110) {
      hoverRing(b.x, b.y - 8, 46);
    }

    if (this.gullFly > 0) this.gullFly -= deltaTime / 1400;

    this.done = (this.caught >= 3 ? 1 : 0) + (this.gullFed ? 1 : 0);
    if (this.caught >= 3 && this.gullFed && !this.said) {
      this.said = true; this.result = 3000;
      setMood('happy', 3600); sfx.pling(); sfx.good();
      addHearts(430, 240, 5); burst(430, 300, ['#f7c948', '#ffffff', '#8fc9e0'], 18, 1.2);
      speak('Vilken fiskelycka!');
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 420, 0, 1);
      fillA('#ffffff', 245 * a); rect(W / 2 - 176, 182, 352, 92, 24);
      fillA('#7fbfd8', 255 * a); textAlign(CENTER, CENTER); textSize(18);
      text('FULL HINK MED FISK!', W / 2, 228);
      if (this.result <= 0) this.result = 0;
    }
  },

  // ----------------------------------------------------------
  drawDock(t) {
    noStroke();
    fillA('#000000', 20); rect(0, 470, W, 10);
    fill('#c99a6a'); rect(0, 470, W, 54);
    fillA('#000000', 12);
    for (let i = 0; i < 12; i++) rect(i * 86, 470, 4, 54);
    fill('#b5834f'); rect(0, 516, W, 12);
    // pålar
    fill('#a9784a');
    for (const px of [96, 402, 700, 960]) rect(px, 470, 18, 70, 4);
    fillA('#ffffff', 90); rect(0, 472, W, 5);
  },

  drawGullPost(t) {
    noStroke();
    fill('#a9784a'); rect(64, 300, 16, 172, 5);
    fillA('#000000', 18); ellipse(72, 478, 44, 10);
    fill('#8f5c3a'); rect(58, 296, 28, 12, 4);
    // rep runt pålen
    strokeA('#e0cdb0', 220); strokeWeight(4); noFill();
    ellipse(72, 360, 26, 12); ellipse(72, 376, 26, 12); noStroke();
  },

  drawGull(t) {
    const g = this.gullSpot();
    const fly = this.gullFly > 0 ? (1 - this.gullFly) : 0;
    const x = g.x + (this.gullFed ? -60 - fly * 120 : 0) + sin(t * 1.4) * 2;
    const y = g.y + (this.gullFed ? -40 - fly * 90 : 0);
    push(); translate(x, y);
    fillA('#000000', 16); ellipse(0, 34, 40, 10);
    // kropp
    fill('#fdfaf3'); ellipse(0, 6, 54, 42);
    // vinge
    fill('#e8e2d4'); ellipse(-4, 8, 36, 22);
    // huvud
    fill('#fdfaf3'); ellipse(22, -12, 30, 28);
    // näbb
    fill('#f7c948'); triangle(34, -10, 50, -4, 34, 2);
    fill('#e8a33a'); triangle(34, 0, 46, -2, 34, 4);
    // öga
    fill('#3a332e'); ellipse(26, -16, 5, 6);
    // ben
    stroke('#e8a33a'); strokeWeight(3);
    line(-6, 24, -6, 34); line(6, 24, 6, 34); noStroke();
    // vingarna lyfts när måsen flyger
    if (this.gullFed) {
      push(); translate(-6, -2); rotate(-0.5 - sin(t * 14) * 0.3);
      fill('#fdfaf3'); ellipse(0, -14, 20, 44); pop();
    }
    pop();
  },

  drawBoat(t) {
    push(); translate(806, 452); rotate(sin(t * 1.1) * 0.04);
    noStroke();
    fillA('#000000', 18); ellipse(0, 40, 200, 16);
    // skrov
    fill('#f2f6f8'); beginShape();
    vertex(-92, -6); vertex(96, -6); vertex(74, 38); vertex(-74, 38);
    endShape(CLOSE);
    fill('#e2604a'); rect(-92, 12, 190, 12, 4);
    fill('#c9ced4'); rect(-92, -6, 190, 8, 4);
    // mast + segel
    fill('#c99a5e'); rect(-4, -96, 8, 92, 3);
    fill('#ffffff'); triangle(4, -92, 4, -20, 62, -20);
    fill('#f7c948'); triangle(4, -92, 4, -20, -46, -20);
    // åra
    fill('#c99a5e'); push(); rotate(0.5); rect(-84, 0, 6, 74, 3); pop();
    pop();
  },

  drawFish(x, y, s, alpha) {
    push(); translate(x, y); scale(s);
    noStroke();
    fillA('#f2a15f', 255 * alpha);
    ellipse(0, 0, 44, 26);
    fillA('#e08a45', 255 * alpha);
    triangle(-20, 0, -34, -12, -34, 12);
    fillA('#ffffff', 210 * alpha); ellipse(8, -5, 10, 8);
    fillA('#3a332e', 240 * alpha); ellipse(9, -5, 5, 5);
    fillA('#ffffff', 120 * alpha); ellipse(-2, 4, 16, 6);
    pop();
  },

  drawNet(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fillA('#000000', 16); ellipse(0, 26, 66, 12);
    // skaft ner åt höger
    push(); translate(30, 8); rotate(0.85);
    fill('#c99a5e'); rect(-5, -4, 10, 58, 5);
    fill('#a9784a'); rect(-5, 44, 10, 12, 4);
    pop();
    // ring
    noFill(); stroke('#8d949a'); strokeWeight(6);
    ellipse(-2, -8, 62, 52); noStroke();
    // nät
    fillA('#eef6fa', 215); ellipse(-2, -6, 52, 44);
    strokeA('#b9c9d4', 190); strokeWeight(1.6);
    for (let i = -2; i <= 2; i++) line(-2 + i * 10, -26, -2 + i * 10, 14);
    for (let i = -1; i <= 1; i++) line(-24, -6 + i * 10, 20, -6 + i * 10);
    noStroke();
    // liten fisk i nätet
    fillA('#f2a15f', 230); ellipse(-4, 0, 22, 12);
    triangle(-14, 0, -22, -6, -22, 6);
    fillA('#3a332e', 200); ellipse(2, -2, 3, 3);
    pop();
  },

  drawBucket(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fillA('#000000', 16); ellipse(0, 26, 66, 12);
    fill('#7fa8c9'); beginShape();
    vertex(-28, -16); vertex(28, -16); vertex(22, 24); vertex(-22, 24);
    endShape(CLOSE);
    fill('#a9c7dd'); ellipse(0, -16, 56, 18);
    fill('#5f8e9c'); ellipse(0, -15, 44, 12);
    fillA('#ffffff', 90); rect(-22, -10, 8, 30, 3);
    noFill(); stroke('#8d949a'); strokeWeight(4);
    arc(0, -18, 52, 36, PI, TAU); noStroke();
    pop();
  },

  drawBread(x, y, s) {
    push(); translate(x, y); scale(s); noStroke();
    fillA('#000000', 16); ellipse(0, 20, 58, 12);
    fill('#e8b168'); ellipse(0, 0, 58, 34);
    fill('#c9873f'); ellipse(0, 8, 58, 16);
    fillA('#fff3d8', 200); ellipse(-10, -6, 18, 8);
    fill('#a5642f');
    for (let i = -1; i <= 1; i++) { push(); translate(i * 14, -2); rotate(0.5); rect(-2, -8, 4, 14, 2); pop(); }
    pop();
  },

  down(p) {
    // fiskar på bryggan först
    for (const f of this.fish) {
      if (!f.caught || f.got) continue;
      const d = this.dockSpot(this.fish.indexOf(f));
      if (dist(p.x, p.y, d.x, d.y) < 44) {
        this.fishDrag = { f: f, x: p.x, y: p.y };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
    for (const it of this.items()) {
      if (dist(p.x, p.y, it.x, it.y) < it.r + 12) {
        this.tool = it.id; this.drag = { x: p.x, y: p.y, id: it.id };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },

  move(p) {
    if (this.fishDrag) { this.fishDrag.x = p.x; this.fishDrag.y = p.y; return; }
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id !== 'hav') return;
    for (const f of this.fish) {
      if (f.caught) continue;
      if (dist(p.x, p.y, f.x, f.y) < 66) {
        f.w = min(1, f.w + 0.14);
        if (frameCount % 6 === 0) sfx.splash();
        if (frameCount % 3 === 0) {
          G.parts.push({
            x: f.x + random(-14, 14), y: f.y + random(-8, 8),
            vx: random(-0.7, 0.7), vy: random(-1.4, -0.4),
            r: random(3, 5), life: 1, col: '#bfe3f2', spin: 0,
          });
        }
        if (f.w >= 1 && !f.caught) {
          f.caught = true; sfx.pop(); sfx.good();
          toast('En fisk!', 1100);
          burst(f.x, f.y, ['#ffffff', '#8fc9e0'], 10, 1.0);
        }
      }
    }
  },

  up(p) {
    if (this.fishDrag) {
      const f = this.fishDrag.f, b = this.bucketSpot();
      const drop = dist(p.x, p.y, b.x, b.y) < 100;
      this.fishDrag = null; G.dragAny = false;
      if (drop) {
        f.got = true; this.caught++; sfx.pop();
        if (this.caught === 3) { gainStar(1); sfx.good(); toast('Hinken är full!', 1500); }
        else gainStar(1);
      } else sfx.drop();
      return;
    }
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'brod') {
      const g = this.gullSpot();
      if (!this.gullFed && dist(p.x, p.y, g.x, g.y) < 96) {
        this.gullFed = true; this.gullFly = 1; gainStar(1);
        sfx.pop(); sfx.good(); toast('Måsen är mätt!', 1500);
        addHearts(g.x + 40, g.y - 30, 2);
      } else sfx.drop();
      return;
    }
    sfx.drop();
  },
};

SCENE_META.push({
  id: 'pier', label: 'Fiskebryggan', icon: 'fish',
  desc: 'Håva fisk och mata måsen', say: 'Håva fisk, lägg den i hinken och mata måsen.',
  steps: ['Dra håven genom vattnet.', 'Lägg fiskarna i hinken.', 'Ge måsen en brödbit.'],
});
DEMOS.pier = function () {
  const sc = SCENES.pier;
  if (!sc.fish) return null;
  const f = sc.fish.filter(function (x) { return !x.caught; })[0] || sc.fish[0];
  const it = sc.items()[0];
  return { from: { x: it.x, y: it.y }, to: { x: f.x, y: f.y }, r: 40 };
};
HINTS.pier = function () {
  const sc = SCENES.pier;
  if (!sc.fish) return null;
  const left = sc.fish.filter(function (x) { return !x.caught; })[0];
  if (left) return { x: sc.items()[0].x, y: sc.items()[0].y, r: 42 };
  const onDock = sc.fish.filter(function (x) { return x.caught && !x.got; })[0];
  if (onDock) {
    const d = sc.dockSpot(sc.fish.indexOf(onDock));
    return { x: d.x, y: d.y, r: 32 };
  }
  if (!sc.gullFed) return { x: sc.items()[1].x, y: sc.items()[1].y, r: 42 };
  return null;
};