// ============================================================
//  PARKEN — ankor i dammen, sandslott och gunga
// ============================================================

SCENES.park = {
  reset() {
    this.ducks = [
      { x: 236, y: 594, inPond: false, t: random(6) },
      { x: 300, y: 632, inPond: false, t: random(6) },
      { x: 196, y: 650, inPond: false, t: random(6) },
    ];
    this.duckDone = false;
    this.sand = 0; this.sandDone = false;
    this.swing = 0; this.swingV = 0; this.swingDone = false;
    this.drag = null;
    this.swings = 0;
    this.kid = { face: 0 };
  },
  pond() { return { x: 448, y: 452, rx: 140, ry: 62 }; },
  sandbox() { return { x: 700, y: 512, w: 218, h: 108 }; },
  bucket() { return { x: 636, y: 612, r: 42 }; },
  seat() { return { x: 168 + this.swing * 60, y: 402 }; },
  mascot() { return { x: 934, y: 566, s: 0.58, hat: 'cap', outfit: '' }; },

  draw(t) {
    // himmel
    noStroke(); fill('#dff1fb'); rect(0, 0, W, 430);
    fillA('#f7c948', 220); ellipse(852, 96, 84, 84);
    fillA('#fff3c4', 90); ellipse(852, 96, 124, 124);
    for (let i = 0; i < 4; i++) {
      const cx = 90 + i * 250 + sin(t * 0.2 + i) * 14;
      fillA('#ffffff', 225);
      ellipse(cx, 108 + (i % 2) * 30, 92, 42);
      ellipse(cx + 38, 96 + (i % 2) * 30, 68, 38);
      ellipse(cx - 36, 104 + (i % 2) * 30, 58, 34);
    }
    // träd i bakgrunden
    for (let i = 0; i < 5; i++) {
      const tx = 70 + i * 230;
      fill('#8f6a44'); rect(tx - 8, 300, 16, 130, 5);
      fill(i % 2 ? '#7fbf8f' : '#6fae83'); ellipse(tx, 276, 132, 116);
      fillA('#ffffff', 45); ellipse(tx - 26, 250, 44, 32);
    }
    // gräs
    fill('#a9d9a0'); rect(0, 420, W, 280);
    fill('#98cd90'); rect(0, 560, W, 140);
    fillA('#8fc287', 120);
    for (let i = 0; i < 26; i++) ellipse(30 + i * 38, 470 + (i % 4) * 26, 22, 7);

    // gångväg
    fillA('#e6d7bf', 220); ellipse(720, 660, 300, 60);

    // damm
    const pd = this.pond();
    fillA('#cde8d8', 220); ellipse(pd.x, pd.y + 10, pd.rx * 2 + 26, pd.ry * 2 + 18);
    fill('#8fc9c2'); ellipse(pd.x, pd.y, pd.rx * 2, pd.ry * 2);
    fill('#a8dbd3'); ellipse(pd.x - 10, pd.y - 8, pd.rx * 1.8, pd.ry * 1.7);
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.4 + i * 0.33) % 1;
      noFill(); strokeA('#ffffff', 120 * (1 - ph)); strokeWeight(2.4);
      ellipse(pd.x - 30 + i * 40, pd.y + 6, 30 + ph * 40, 12 + ph * 16);
      noStroke();
    }
    // näckrosor
    fill('#7fbf8f'); ellipse(pd.x + 82, pd.y - 18, 30, 16);
    fill('#f2a0b4'); ellipse(pd.x + 88, pd.y - 24, 12, 10);

    // sandlåda
    const sb = this.sandbox();
    // träram
    fill('#b08a5b'); rect(sb.x - 14, sb.y - 14, sb.w + 28, sb.h + 28, 16);
    fill('#c9a97f'); rect(sb.x - 8, sb.y - 8, sb.w + 16, sb.h + 16, 12);
    fill('#efd9a8'); rect(sb.x, sb.y, sb.w, sb.h, 9);
    fillA('#e3c785', 220); ellipse(sb.x + sb.w / 2, sb.y + sb.h * 0.62, sb.w - 26, sb.h * 0.7);
    // sandkorn och små högar
    fillA('#c9a97f', 130);
    for (let i = 0; i < 22; i++) ellipse(sb.x + 14 + (i * 37) % (sb.w - 28), sb.y + 16 + (i * 53) % (sb.h - 30), 4, 3);
    fill('#e8cf9a'); ellipse(sb.x + 34, sb.y + sb.h - 26, 52, 26);
    fill('#e8cf9a'); ellipse(sb.x + sb.w - 30, sb.y + sb.h - 30, 44, 22);
    // leksaksgrep
    fill('#f2a0b4'); rect(sb.x + sb.w - 62, sb.y + 24, 7, 30, 3);
    fill('#f2a0b4'); rect(sb.x + sb.w - 68, sb.y + 52, 19, 7, 3);

    // sandslott
    if (this.sand > 0) {
      const bx = sb.x + 96, by = sb.y + 76;
      const hh = 18 + this.sand * 22;
      fill('#e8cf9a'); rect(bx - 46, by - hh * 0.5, 92, hh, 8);
      if (this.sand >= 2) rect(bx - 28, by - hh * 1.1, 56, hh, 8);
      if (this.sand >= 3) {
        rect(bx - 14, by - hh * 1.65, 28, hh * 0.7, 6);
        fill('#e0715f'); triangle(bx - 14, by - hh * 1.65, bx + 14, by - hh * 1.65, bx, by - hh * 1.65 - 18);
        fill('#e8cf9a'); ellipse(bx, by - hh * 1.65 - 26, 18, 18);
      }
      fillA('#c9a97f', 150);
      for (let i = 0; i < 3; i++) ellipse(bx - 40 + i * 40, by + hh * 0.4, 26, 8);
    }

    // hink och spade
    if (!(this.drag && this.drag.id === 'bucket')) {
      const b = this.bucket();
      this.drawBucketAt(b.x, b.y);
    }

    // gunga
    const st = this.seat();
    fill('#9a8f86'); rect(104, 250, 10, 240, 4); rect(276, 250, 10, 240, 4);
    fill('#8a8079'); rect(96, 244, 196, 12, 6);
    fill('#8a8079'); rect(96, 244, 10, 12, 4);
    strokeA('#6d6259', 220); strokeWeight(3);
    line(180, 256, st.x, st.y);
    line(200, 256, st.x + 34, st.y);
    noStroke();
    fill('#c98a5a'); rect(st.x - 4, st.y, 42, 12, 5);
    // ett barn på gungan
    const kx = st.x + 17, ky = st.y - 6;
    fill('#f6ddc6'); ellipse(kx, ky - 26, 28, 28);
    fill('#a9c7f5'); rect(kx - 13, ky - 14, 26, 24, 8);
    fill('#4a3f39'); ellipse(kx - 6, ky - 28, 4, 5); ellipse(kx + 6, ky - 28, 4, 5);
    stroke('#4a3f39'); strokeWeight(2.4); noFill();
    arc(kx, ky - 22, 12, 8, 0, PI);
    noStroke();
    fill('#8fbf8f'); ellipse(kx - 10, ky - 38, 10, 8); ellipse(kx + 10, ky - 38, 10, 8);
    // fartstreck
    if (abs(this.swingV) > 0.4) {
      strokeA('#ffffff', 150); strokeWeight(3);
      const dir = this.swingV > 0 ? -1 : 1;
      for (let i = 0; i < 3; i++) line(st.x + dir * 30 - 10, st.y - 4 + i * 8, st.x + dir * (56 + i * 10), st.y - 4 + i * 8);
      noStroke();
    }

    // ankor
    for (const d of this.ducks) {
      if (this.drag && this.drag.id === 'duck' && this.drag.i === this.ducks.indexOf(d)) continue;
      const wob = d.inPond ? sin(t * 1.4 + d.t) * 3 : 0;
      this.drawDuck(d.x, d.y + wob, d.inPond, t);
    }
    if (this.drag && this.drag.id === 'duck') {
      const d = this.ducks[this.drag.i];
      this.drawDuck(this.drag.x, this.drag.y, false, t);
    }
    if (this.drag && this.drag.id === 'bucket') {
      const sb = this.sandbox();
      if (this.drag.x > sb.x - 40 && this.drag.x < sb.x + sb.w + 40 &&
          this.drag.y > sb.y - 60 && this.drag.y < sb.y + sb.h + 40 && this.sand < 3) {
        hoverRing(sb.x + sb.w / 2, sb.y + sb.h / 2 - 10, 70);
      }
      this.drawBucketAt(this.drag.x, this.drag.y - 18);
    }
    if (this.drag && this.drag.id === 'duck') {
      const pd = this.pond();
      if (dist(this.drag.x, this.drag.y, pd.x, pd.y) < 130) {
        fillA('#63bda8', 30); ellipse(pd.x, pd.y, pd.rx * 2 - 10, pd.ry * 2 - 10);
        noFill(); strokeA('#63bda8', 210); strokeWeight(4);
        ellipse(pd.x, pd.y, pd.rx * 2, pd.ry * 2); noStroke();
      }
    }


  },

  step() {
    this.swingV += -this.swing * 0.0022;
    this.swingV *= 0.995;
    this.swing += this.swingV;
    if (this.swing > 0.9) { this.swing = 0.9; this.swingV = -abs(this.swingV) * 0.9; }
    if (this.swing < -0.9) { this.swing = -0.9; this.swingV = abs(this.swingV) * 0.9; }
  },

  drawBucketAt(x, y) {
    fillA('#000000', 16); ellipse(x, y + 30, 56, 14);
    fill('#e0715f'); rect(x - 24, y - 10, 48, 40, 8);
    fill('#f2a0b4'); rect(x - 24, y - 14, 48, 10, 5);
    fill('#cfd8db'); arc(x, y - 14, 40, 26, PI, TAU);
    fill('#f7c948'); rect(x + 34, y - 26, 8, 52, 4);
    fill('#e8c877'); rect(x + 28, y + 22, 20, 14, 4);
  },

  drawDuck(x, y, inPond, t) {
    const bob = inPond ? sin(t * 3 + x) * 1.6 : 0;
    push(); translate(x, y + bob);
    if (!inPond) { fillA('#000000', 14); ellipse(0, 20, 40, 10); }
    fill('#f7e9c8'); ellipse(0, 4, 46, 26);
    fill('#f2d79a'); ellipse(-16, 0, 20, 14);
    fill('#f7e9c8'); ellipse(12, -14, 24, 22);
    fill('#f7c948'); triangle(22, -14, 34, -10, 22, -6);
    fill('#4a3f39'); ellipse(16, -18, 4, 5);
    fillA('#f2a0b4', 170); ellipse(11, -11, 8, 4);
    pop();
  },

  down(p) {
    // gunga
    const seat = this.seat();
    if (!this.swingDone && dist(p.x, p.y, seat.x + 17, seat.y + 4) < 58) {
      this.drag = { id: 'swing', x: p.x, y: p.y };
      G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
    }
    // hink
    const b = this.bucket();
    if (!this.sandDone && dist(p.x, p.y, b.x, b.y) < b.r + 12) {
      this.drag = { id: 'bucket', x: p.x, y: p.y };
      G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
    }
    // ankor
    if (!this.duckDone) {
      for (let i = 0; i < this.ducks.length; i++) {
        const d = this.ducks[i];
        if (d.inPond) continue;
        if (dist(p.x, p.y, d.x, d.y) < 42) {
          this.drag = { id: 'duck', i: i, x: p.x, y: p.y };
          G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
        }
      }
    }
  },

  move(p) {
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.id === 'swing') {
      const k = constrain((p.x - 184) / 60, -0.95, 1.2);
      this.swing = k;
    }
  },

  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.id === 'swing') {
      this.swingV = constrain((p.x - 184) / 60, -0.9, 0.9) * 0.045;
      if (abs(this.swingV) > 0.012) {
        sfx.whoosh();
        if (!this.swingDone) {
          this.swingDone = true; gainStar(1); sfx.giggle(); toast('Högt, högt!', 1300);
          addHearts(184, 360, 2);
        }
      }
      return;
    }
    if (d.id === 'bucket') {
      const sb = this.sandbox();
      if (p.x > sb.x - 20 && p.x < sb.x + sb.w + 20 && p.y > sb.y - 30 && p.y < sb.y + sb.h + 30) {
        this.sand = min(3, this.sand + 1);
        sfx.splash(); sfx.pop();
        burst(sb.x + 96, sb.y + 60, ['#eddcb6', '#e8cf9a'], 10, 0.9);
        if (this.sand >= 3 && !this.sandDone) {
          this.sandDone = true; gainStar(1); sfx.good(); toast('Ett slott!', 1300);
        }
      } else { sfx.drop(); toast('Häll sanden i sandlådan', 1300); }
      return;
    }
    if (d.id === 'duck') {
      const pd = this.pond();
      const dx = (p.x - pd.x) / pd.rx, dy = (p.y - pd.y) / pd.ry;
      if (dx * dx + dy * dy < 1.05) {
        const duck = this.ducks[d.i];
        duck.inPond = true;
        duck.x = pd.x + (d.i - 1) * 52 + random(-10, 10);
        duck.y = pd.y + 10 + (d.i % 2) * 8;
        sfx.splash(); sfx.giggle();
        if (this.ducks.every(function (x) { return x.inPond; }) && !this.duckDone) {
          this.duckDone = true; gainStar(1); sfx.good(); toast('Alla i dammen!', 1300);
        }
      } else {
        const duck = this.ducks[d.i];
        duck.x = p.x; duck.y = p.y;
        sfx.drop();
      }
    }
  },

  update(t) { this.step(); },
};

SCENE_META.push({
  id: 'park', label: 'Parken', icon: 'tree',
  desc: 'Ankor, sand och gunga', say: 'Sätt ankorna i dammen, bygg ett slott och gunga.',
  steps: ['Dra ankorna till dammen.', 'Dra hinken till sandlådan tre gånger.', 'Dra gungan åt sidan och släpp.'],
});
DEMOS.park = function () {
  const sc = SCENES.park;
  if (!sc.ducks) return null;
  const d = sc.ducks.filter(function (x) { return !x.inPond; })[0];
  if (d) return { from: { x: d.x, y: d.y }, to: { x: 448, y: 452 }, r: 34 };
  if (!sc.sandDone) return { from: { x: 636, y: 612 }, to: { x: 810, y: 560 }, r: 36 };
  if (!sc.swingDone) return { from: { x: 184, y: 406 }, to: { x: 250, y: 406 }, r: 36 };
  return null;
};
HINTS.park = function () {
  const sc = SCENES.park;
  if (!sc.ducks) return null;
  const d = sc.ducks.filter(function (x) { return !x.inPond; })[0];
  if (d) return { x: d.x, y: d.y, r: 44 };
  if (!sc.sandDone) return { x: 636, y: 612, r: 48 };
  if (!sc.swingDone) return { x: 184, y: 406, r: 50 };
  return null;
};