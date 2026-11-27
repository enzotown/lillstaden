// ============================================================
//  SKOLAN — lägg formerna rätt och rita på tavlan
// ============================================================

const SKOLA_SHAPES = [
  { id: 'cirkel', col: '#ef8064' },
  { id: 'triangel', col: '#f7c948' },
  { id: 'kvadrat', col: '#8fd8c6' },
  { id: 'stjarna', col: '#b79ce0' },
];

SCENES.school = {
  reset() {
    this.slots = [
      { id: 'cirkel', x: 736, y: 244 },
      { id: 'triangel', x: 872, y: 244 },
      { id: 'kvadrat', x: 736, y: 356 },
      { id: 'stjarna', x: 872, y: 356 },
    ];
    this.pieces = SKOLA_SHAPES.map(function (s, i) {
      return { id: s.id, col: s.col, home: { x: 706 + i * 68, y: 596 }, x: 706 + i * 68, y: 596, placed: false, wob: 0 };
    });
    this.drag = null; this.strokes = []; this.cur = null;
    this.chalk = '#ffffff'; this.drew = false; this.erasing = false;
    this.result = 0; this.said = false; this.done = 0;
  },
  mascot() { return { x: 596, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    drawRoom({ wall: '#f5ecd6', wall2: '#efe0c2', floor: '#d9b48c', floorY: 486 });

    // klocka
    fill('#ffffff'); ellipse(560, 104, 62, 62);
    stroke('#8fa9b4'); strokeWeight(3); noFill(); ellipse(560, 104, 57, 57); noStroke();
    stroke('#4a3f39'); strokeWeight(3);
    line(560, 104, 560, 84); line(560, 104, 574, 108); noStroke();
    fill('#ef8064'); ellipse(560, 104, 7, 7);

    // teckningar på väggen
    for (let i = 0; i < 3; i++) {
      const dx = 180 + i * 96;
      push(); translate(dx, 100); rotate(-0.06 + i * 0.05);
      fill('#ffffff'); rect(-30, -26, 60, 52, 4);
      fill(['#f7c948', '#8fd8c6', '#f2a0b4'][i]); rect(-24, -20, 48, 26, 3);
      fill(['#ef8064', '#7fa8c9', '#b79ce0'][i]); ellipse(-8 + i * 4, 12, 16, 12);
      pop();
    }

    // tavla
    fillA('#000000', 20); rect(94, 152, 566, 286, 12);
    fill('#86a381'); rect(86, 144, 566, 286, 10);
    fillA('#ffffff', 16); rect(96, 154, 546, 130, 8);
    fillA('#000000', 18); rect(96, 290, 546, 130, 8);
    // träram
    fill('#c99a6a'); rect(80, 138, 578, 10, 5); rect(80, 414, 578, 10, 5);
    fill('#c99a6a'); rect(80, 138, 10, 286, 5); rect(648, 138, 10, 286, 5);
    // kritbricka
    fill('#c99a6a'); rect(96, 424, 534, 14, 5);
    fillA('#000000', 20); rect(96, 438, 534, 6, 3);
    noStroke();

    // ritade streck
    for (const s of this.strokes) {
      stroke(s.col); strokeWeight(7); noFill();
      beginShape();
      for (const p of s.pts) vertex(p.x, p.y);
      endShape();
    }
    if (this.cur) {
      stroke(this.cur.col); strokeWeight(7); noFill();
      beginShape();
      for (const p of this.cur.pts) vertex(p.x, p.y);
      endShape();
    }
    noStroke();

    // kritor
    const chalkCols = ['#ffffff', '#f7c948', '#f2a0b4'];
    for (let i = 0; i < 3; i++) {
      const cx = 130 + i * 58, cy = 466;
      const sel = this.chalk === chalkCols[i];
      fill(sel ? '#ffffff' : '#f0e8d8');
      ellipse(cx, cy, 40, 40);
      fill(chalkCols[i]);
      push(); translate(cx, cy); rotate(-0.4); rect(-5, -14, 10, 28, 4); pop();
      if (sel) { noFill(); stroke('#4a3f39'); strokeWeight(2.4); ellipse(cx, cy, 46, 46); noStroke(); }
    }
    // sudd
    fill('#e8ded1'); ellipse(330, 466, 44, 40);
    fill('#b79ce0'); rect(314, 456, 34, 14, 4);
    fillA('#4a3f39', 200); textAlign(CENTER, CENTER); textSize(9);
    text('SUDD', 330, 484);

    // formtavla
    fillA('#000000', 20); rect(690, 158, 300, 296, 22);
    fill('#ffffff'); rect(684, 152, 300, 296, 22);
    fillA('#eef7f3', 255); rect(694, 162, 280, 276, 16);
    fillA('#a08e80', 220); textAlign(CENTER, CENTER); textSize(10);
    text('LÄGG FORMERNA RÄTT', 834, 178);

    for (const s of this.slots) {
      const piece = this.pieces.filter(function (p) { return p.id === s.id; })[0];
      push(); translate(s.x, s.y);
      if (piece && piece.placed) {
        fill(piece.col); this.shapePath(s.id, 34);
        fillA('#ffffff', 90); this.shapePath(s.id, 22);
      } else {
        fillA('#d9d2c6', 255); this.shapePath(s.id, 34);
        fillA('#f4efe6', 255); this.shapePath(s.id, 27);
      }
      pop();
    }


    // låda
    fillA('#000000', 16); rect(664, 556, 316, 92, 18);
    fill('#ffffff'); rect(662, 552, 316, 92, 18);
    fillA('#f7f0e4', 255); rect(670, 560, 300, 76, 14);

    // former i lådan
    for (const p of this.pieces) {
      if (p.placed || (this.drag && this.drag.p === p)) continue;
      push(); translate(p.x, p.y + sin(t * 3 + p.x) * 1.5); rotate(p.wob);
      fillA('#000000', 24); ellipse(2, 30, 46, 12);
      fill(p.col); this.shapePath(p.id, 27);
      fillA('#ffffff', 110); this.shapePath(p.id, 17);
      pop();
      if (p.wob !== 0) p.wob *= 0.9;
    }

    this.done = this.pieces.filter(function (p) { return p.placed; }).length + (this.drew ? 1 : 0);
    if (this.done >= 5 && !this.said) {
      this.said = true; this.result = 2800;
      setMood('happy', 3200); sfx.pling(); addHearts(834, 244, 4);
      speak('Vad duktig du är!');
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 400, 0, 1);
      fillA('#ffffff', 240 * a); rect(300, 200, 300, 92, 24);
      fillA('#4a3f39', 255 * a); textAlign(CENTER, CENTER); textSize(20);
      text('JÄTTEBRA!', 450, 246);
      if (this.result <= 0) this.result = 0;
    }

    if (this.drag) {
      const pc = this.drag.p;
      const sl = this.slots.filter(function (x) { return x.id === pc.id; })[0];
      if (sl && dist(this.drag.x, this.drag.y, sl.x, sl.y) < 90) hoverRing(sl.x, sl.y, 46);
      push(); translate(this.drag.x, this.drag.y); rotate(this.drag.rot || 0);
      fill(this.drag.p.col); this.shapePath(this.drag.p.id, 34);
      pop();
    }
  },

  shapePath(id, r) {
    if (id === 'cirkel') ellipse(0, 0, r * 2, r * 2);
    else if (id === 'kvadrat') rect(-r, -r, r * 2, r * 2, 6);
    else if (id === 'triangel') triangle(0, -r * 1.15, r * 1.1, r * 0.85, -r * 1.1, r * 0.85);
    else starShape(0, 0, r * 1.25, r * 0.55);
  },

  onBoard(p) { return p.x > 100 && p.x < 640 && p.y > 158 && p.y < 408; },

  down(p) {
    // krita
    if (p.y > 444 && p.y < 492) {
      const chalkCols = ['#ffffff', '#f7c948', '#f2a0b4'];
      for (let i = 0; i < 3; i++) {
        if (dist(p.x, p.y, 130 + i * 58, 466) < 26) {
          this.chalk = chalkCols[i]; sfx.pop(); return;
        }
      }
      if (dist(p.x, p.y, 330, 466) < 26) {
        this.strokes = []; this.drew = false; sfx.whoosh(); return;
      }
    }
    if (this.onBoard(p)) {
      this.cur = { col: this.chalk, pts: [{ x: p.x, y: p.y }] };
      G.dragAny = true; G.lastAct = millis();
      if (!this.drew) { this.drew = true; gainStar(1); sfx.chalk(); }
      return;
    }
    for (const pc of this.pieces) {
      if (pc.placed) continue;
      if (dist(p.x, p.y, pc.x, pc.y) < 40) {
        this.drag = { p: pc, x: p.x, y: p.y, rot: 0 };
        pc.wob = -0.2;
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },
  move(p) {
    if (this.cur) {
      const last = this.cur.pts[this.cur.pts.length - 1];
      if (dist(p.x, p.y, last.x, last.y) > 4) this.cur.pts.push({ x: p.x, y: p.y });
      if (this.cur.pts.length % 8 === 0) sfx.chalk();
      return;
    }
    if (this.drag) { this.drag.x = p.x; this.drag.y = p.y; }
  },
  up(p) {
    if (this.cur) {
      if (this.cur.pts.length > 2) this.strokes.push(this.cur);
      this.cur = null; G.dragAny = false; return;
    }
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    const pc = d.p;
    const slot = this.slots.filter(function (s) { return s.id === pc.id; })[0];
    if (slot && dist(p.x, p.y, slot.x, slot.y) < 58) {
      pc.placed = true; pc.x = slot.x; pc.y = slot.y;
      burst(slot.x, slot.y, [pc.col, '#ffffff'], 12, 1);
      sfx.good(); gainStar(1); toast('Rätt form!', 1300);
    } else {
      pc.x = pc.home.x; pc.y = pc.home.y; pc.wob = 0.3;
      sfx.bad();
      if (slot) toast('Prova en annan form', 1200);
    }
  },
};

SCENE_META.push({
  id: 'school', label: 'Skolan', icon: 'pencil',
  desc: 'Former och kritor', say: 'Lägg formerna på rätt plats.',
  steps: ['Dra formerna till rätt hål.', 'Ta en krita och rita på tavlan.', 'Sudda med suddet om du vill.'],
});
DEMOS.school = function () {
  const sc = SCENES.school;
  if (!sc.pieces) return null;
  const pc = sc.pieces[0];
  const slot = sc.slots[0];
  return { from: { x: pc.home.x, y: pc.home.y }, to: { x: slot.x, y: slot.y }, r: 34 };
};
HINTS.school = function () {
  const sc = SCENES.school;
  if (!sc.pieces) return null;
  const pc = sc.pieces.filter(function (p) { return !p.placed; })[0];
  if (pc) return { x: pc.home.x, y: pc.home.y, r: 36 };
  if (!sc.drew) return { x: 130, y: 466, r: 24 };
  return null;
};