// ============================================================
//  TANDLÄKAREN — välj borr, borra bort socker, se resultatet
// ============================================================

const TOOTH_X = [606, 704, 802, 900];

SCENES.dentist = {
  reset() {
    this.spots = [
      { tooth: 0, x: TOOTH_X[0] - 8, y: 272, size: 1, clean: 0, done: false },
      { tooth: 1, x: TOOTH_X[1] + 10, y: 300, size: 3, clean: 0, done: false },
      { tooth: 3, x: TOOTH_X[3] - 6, y: 284, size: 2, clean: 0, done: false },
    ];
    this.tool = null; this.drag = null; this.drilling = null;
    this.polished = 0; this.result = 0; this.done = 0;
    this.smile = 0; this.said = false;
    this.bits = 0;
  },
  tools() {
    return [
      { id: 1, x: 540, y: 596, r: 42, label: 'liten' },
      { id: 2, x: 654, y: 596, r: 47, label: 'mellan' },
      { id: 3, x: 768, y: 596, r: 52, label: 'stor' },
    ];
  },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    drawRoom({ wall: '#e6f3ee', wall2: '#cfe9e2', floor: '#efd9c0', floorY: 486 });
    drawWindow(58, 156, 210, 156, { sky: '#cdeaf7' });
    drawPlant(64, 486, 0.8);

    // tvättställ under fönstret
    fill('#e8f5f0'); rect(96, 330, 168, 24, 8);
    fill('#ffffff'); rect(104, 306, 152, 26, 10);
    fill('#cfe4dd'); rect(114, 312, 132, 14, 7);
    fill('#9fb9b2'); rect(170, 296, 8, 14, 3);
    fill('#9fb9b2'); rect(176, 292, 18, 6, 3);
    fill('#e8f5f0'); rect(96, 354, 168, 132, 10);
    fillA('#ffffff', 150); rect(120, 372, 120, 8, 4);
    fill('#b9cfd8'); ellipse(150, 420, 12, 12); ellipse(210, 420, 12, 12);

    // tandläkarlampa
    push();
    stroke('#8fa9b4'); strokeWeight(9); noFill();
    line(470, 96, 470, 150);
    line(470, 150, 330, 176);
    noStroke();
    fill('#9fb9c4'); ellipse(470, 96, 26, 14);
    push(); translate(322, 196); rotate(0.3);
    fill('#dde9ee'); ellipse(0, 0, 122, 92);
    fill('#f4fbfd'); ellipse(0, 8, 106, 76);
    fillA('#ffffff', 90); ellipse(-16, 6, 50, 34);
    fill('#b9cfd8'); ellipse(0, 0, 26, 22);
    pop();
    fillA('#fff6d8', 26); triangle(276, 224, 372, 224, 330, 420);
    pop();

    // affisch med tand
    fill('#ffffff'); rect(858, 150, 96, 118, 8);
    fill('#8fd8c6'); rect(858, 150, 96, 16, 6);
    drawIcon('tooth', 906, 214, '#4a3f39', 1.05);

    // tandläkarstol
    push();
    noStroke();
    fillA('#000000', 26); ellipse(300, 626, 300, 46);
    // fot + pelare
    fill('#a9c6d1'); rect(288, 540, 24, 78, 8);
    fill('#8fb2bf'); rect(240, 612, 120, 18, 9);
    // ryggstöd bakom patienten
    fill('#b9cfd8');
    push(); translate(258, 392); rotate(-0.12); rect(-96, -120, 190, 150, 26); pop();
    fillA('#ffffff', 120); rect(180, 300, 44, 120, 20);
    // sits
    fill('#cfdde3'); rect(196, 392, 232, 74, 26);
    fillA('#000000', 20); rect(196, 450, 232, 12, 6);
    // armstöd
    fill('#b9cfd8'); rect(176, 404, 52, 20, 10); rect(400, 404, 52, 20, 10);
    // huvudstöd
    fill('#e9f3f6'); ellipse(258, 322, 34, 44);
    pop();

    // patient: Maja
    const headY = 320 + sin(t * 1.4) * 2;
    drawFace(300, headY, 84, {
      skin: '#f7cba8', hair: 'long', hairCol: '#8a5a3b', hairLen: 0.7,
      mouth: 'open', open: 0.62, teeth: 7, eyes: 'open',
      look: { x: 0.6, y: 0.2 }, blushCol: '#f08a90', freckles: true,
    });
    // haklapp
    fill('#9fd8e6'); beginShape();
    vertex(258, 400); vertex(342, 400); vertex(360, 470); vertex(240, 470);
    endShape(CLOSE);
    fillA('#ffffff', 120); ellipse(300, 436, 26, 26);

    // mun-panel (förstoring)
    fillA('#000000', 22); rect(548, 138, 404, 318, 24);
    fill('#fff6f4'); rect(544, 132, 404, 318, 24);
    fillA('#f6b3b8', 255); rect(560, 210, 372, 196, 46);
    // tandkött
    fill('#e98f96'); rect(560, 210, 372, 40, 20); rect(560, 366, 372, 40, 20);
    // tänder
    for (let i = 0; i < 4; i++) {
      const tx = TOOTH_X[i];
      fill('#ffffff');
      stroke('#e2d6c8'); strokeWeight(2);
      beginShape();
      vertex(tx - 40, 262); vertex(tx - 34, 246); vertex(tx - 16, 240);
      vertex(tx + 16, 240); vertex(tx + 34, 246); vertex(tx + 40, 262);
      vertex(tx + 38, 330); vertex(tx + 22, 356); vertex(tx + 8, 340);
      vertex(tx - 8, 340); vertex(tx - 22, 356); vertex(tx - 38, 330);
      endShape(CLOSE);
      noStroke();
      fillA('#dcefff', 120); rect(tx - 32, 258, 18, 38, 9);
      if (this.smile > 0.6) {
        fillA('#ffffff', 200 * this.smile);
        ellipse(tx + 12, 286, 14, 14);
      }
    }
    // sockerfläckar
    for (const s of this.spots) {
      if (s.done && s.clean >= 1) continue;
      const k = 1 - s.clean;
      const r = (7 + s.size * 4.4) * k;
      if (r < 0.7) continue;
      push(); translate(s.x, s.y + sin(t * 2 + s.x) * 1.2);
      fillA('#d9c26a', 235); ellipse(0, 0, r * 2.2, r * 1.9);
      fillA('#c2a84e', 200); ellipse(-r * 0.3, -r * 0.2, r * 0.9, r * 0.8);
      fillA('#efe0a0', 220); ellipse(r * 0.3, r * 0.25, r * 0.6, r * 0.5);
      if (!s.done) { fillA('#8a7a3a', 200); ellipse(r * 0.1, -r * 0.1, r * 0.35, r * 0.3); }
      pop();
    }
    // tandborste-glans när klart
    if (this.smile > 0) {
      for (let i = 0; i < 4; i++) {
        const tw = this.smile;
        push(); translate(TOOTH_X[i] + 18, 262); rotate(-0.4);
        fillA('#ffffff', 220 * (0.5 + 0.5 * sin(t * 5 + i)));
        starShape(0, 0, 12 * tw, 4 * tw, 4); pop();
      }
    }
    // förstoringslinje mot munnen
    strokeA('#a9c6d1', 160); strokeWeight(3); noFill();
    line(388, 356, 548, 300); noStroke();
    fillA('#a9c6d1', 200); ellipse(548, 300, 9, 9);

    // verktygsbricka
    drawToolTray(436, 436, '#e8f5f0');
    for (const b of this.tools()) {
      const sel = this.tool === b.id;
      fill(sel ? '#8fd8c6' : '#eef4f2');
      ellipse(b.x, b.y, b.r * 2, b.r * 2);
      if (sel) { noFill(); stroke('#63bda8'); strokeWeight(4); ellipse(b.x, b.y, b.r * 2 + 6, b.r * 2 + 6); noStroke(); }
      this.drawDrill(b.x, b.y + 2, b.id, 1.0);
    }

    // borrandes verktyg / draget verktyg
    const d = this.drag;
    if (d) {
      push(); translate(d.x, d.y - 34); rotate(0.5);
      this.drawDrill(0, 0, d.id, 1.25);
      pop();
      const ns = this.nearSpot(d);
      if (ns) hoverRing(ns.x, ns.y, 39);
    }

    // patientens humör
    if (this.spots.every(function (s) { return s.done; })) {
      this.smile = min(1, this.smile + deltaTime / 500);
    }
    if (this.smile > 0.9 && !this.said) {
      this.said = true; setMood('happy', 3000); addHearts(300, 250, 3);
    }

    // resultatkort
    if (this.result > 0) {
      const a = constrain(this.result / 300, 0, 1);
      push(); translate(W / 2, 300 + (1 - a) * 40);
      fillA('#ffffff', 250 * a); rect(-176, -108, 352, 216, 24);
      fillA('#8fd8c6', 255 * a); rect(-176, -108, 352, 42, 24);
      fillA('#1f6b58', 255 * a); textAlign(CENTER, CENTER); textSize(17);
      text('RESULTAT', 0, -87);
      fillA('#f6b3b8', 255 * a); rect(-146, -50, 292, 74, 18);
      for (let i = 0; i < 4; i++) {
        fillA('#ffffff', 255 * a); rect(-126 + i * 66, -44, 48, 62, 10);
        fillA('#ffffff', 230 * a); starShape(-102 + i * 66, -30, 9, 5, 4);
      }
      fillA('#4a3f39', 255 * a); textSize(15);
      text('Rent och fint!', 0, 62);
      pop();
      this.result -= deltaTime;
      if (this.result <= 0) this.result = 0;
    }
  },

  drawDrill(x, y, size, sc) {
    push(); translate(x, y); scale(sc);
    // handtag
    fill('#9fd8e6'); rect(-9, -34, 18, 34, 8);
    fillA('#ffffff', 150); rect(-6, -31, 6, 24, 3);
    fill('#5f8e9c'); rect(-11, -38, 22, 8, 4);
    // borr
    fill('#8b8f96');
    const w = 4 + size * 1.8;
    beginShape();
    vertex(-w / 2, 0); vertex(w / 2, 0);
    vertex(w / 2, 18 + size * 4); vertex(0, 26 + size * 5); vertex(-w / 2, 18 + size * 4);
    endShape(CLOSE);
    fill('#c9ced4'); rect(-w / 2 + 1, 0, w * 0.35, 16 + size * 3, 1);
    strokeA('#6f757c', 220); strokeWeight(1.4);
    for (let i = 0; i < 3; i++) line(-w / 2, 6 + i * 6, w / 2, 3 + i * 6);
    noStroke();
    // ring som visar storlek
    fillA('#4a3f39', 210);
    for (let i = 0; i < size; i++) ellipse(-8 + i * 8, 36 + size * 5, 5, 5);
    pop();
  },

  nearSpot(d) {
    let best = null, bd = 1e9;
    for (const s of this.spots) {
      if (s.done) continue;
      const dd = dist(d.x, d.y, s.x, s.y);
      if (dd < 52 && dd < bd) { bd = dd; best = s; }
    }
    return best;
  },

  update(t) {
    if (this.drilling) {
      const dr = this.drilling;
      dr.t += deltaTime;
      if (dr.t % 120 < 18) sfx.drill();
      dr.s.clean = constrain(dr.t / 900, 0, 1);
      if (dr.t > 900 && !dr.s.done) {
        dr.s.done = true; dr.s.clean = 1;
        this.done++;
        this.bits = 18;
        burst(dr.x, dr.y, ['#f7c948', '#ffffff', '#8fd8c6'], 12, 1.1);
        sfx.good(); gainStar(1);
        this.drilling = null;
        if (this.done >= 3) { this.result = 2600; sfx.pling(); speak('Rent och fint!'); }
      }
    }
    if (this.bits > 0) this.bits -= deltaTime / 40;
  },

  down(p) {
    if (this.drilling) return;
    for (const b of this.tools()) {
      if (dist(p.x, p.y, b.x, b.y) < b.r + 10) {
        this.tool = b.id; this.drag = { x: p.x, y: p.y, id: b.id };
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },
  move(p) {
    if (this.drag) { this.drag.x = p.x; this.drag.y = p.y; }
  },
  up(p) {
    if (!this.drag) return;
    const d = this.drag; this.drag = null; G.dragAny = false;
    const s = this.nearSpot(d);
    if (!s) { sfx.drop(); return; }
    if (s.size === d.id) {
      this.drilling = { s: s, t: 0, x: s.x, y: s.y };
    } else {
      sfx.bad(); setMood('yuck', 1200); toast('Prova en annan borr', 1400);
      addHearts(s.x, s.y, 1);
    }
  },
};

SCENE_META.push({
  id: 'dentist', label: 'Tandläkaren', icon: 'tooth',
  desc: 'Borra bort socker', say: 'Välj borr och borra bort sockerfläckarna.',
  steps: ['Välj en borr som passar fläcken.', 'Dra borren till fläcken.', 'Borra tills tanden är ren.'],
});
DEMOS.dentist = function () {
  const sc = SCENES.dentist;
  if (!sc.spots) return null;
  const spot = sc.spots.filter(function (s) { return !s.done; })[0] || sc.spots[0];
  const b = sc.tools().filter(function (x) { return x.id === spot.size; })[0] || sc.tools()[0];
  return { from: { x: b.x, y: b.y }, to: { x: spot.x, y: spot.y }, r: 34 };
};
HINTS.dentist = function () {
  const sc = SCENES.dentist;
  if (!sc.spots) return null;
  if (sc.drilling) return null;
  const spot = sc.spots.filter(function (s) { return !s.done; })[0];
  if (!spot) return null;
  const b = sc.tools().filter(function (x) { return x.id === spot.size; })[0];
  return { x: b.x, y: b.y, r: b.r };
};