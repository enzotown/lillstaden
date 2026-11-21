// ============================================================
//  FRISÖREN — klipp, färga, sätt på en rosett. Spegeln visar结果.
// ============================================================

const FRIS_COLS = [
  { id: 'pink', col: '#f2a0b4' },
  { id: 'blue', col: '#8fc4e8' },
  { id: 'mint', col: '#8fd8c6' },
  { id: 'lilac', col: '#b79ce0' },
];

SCENES.hairdresser = {
  reset() {
    this.head = { x: 392, y: 312, r: 92 };
    this.len = 1;
    this.col = '#8a5a3b';
    this.targetCol = null;
    this.cutDone = false; this.colDone = false; this.accDone = false;
    this.acc = null;
    this.tool = null; this.drag = null;
    this.cutAcc = 0; this.snipFlash = 0;
    this.result = 0; this.said = false;
    this.done = 0;
    this.sparkle = 0;
  },
  items() {
    const it = [{ id: 'scissors', kind: 'tool', x: 148, y: 342, r: 44 }];
    for (let i = 0; i < 4; i++) it.push({ id: 'c' + i, kind: 'color', x: 196 + i * 96, y: 598, r: 40, col: FRIS_COLS[i].col });
    it.push({ id: 'bow', kind: 'acc', x: 690, y: 598, r: 40 });
    it.push({ id: 'cap', kind: 'acc', x: 790, y: 598, r: 40 });
    it.push({ id: 'glasses', kind: 'acc', x: 890, y: 598, r: 40 });
    return it;
  },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    drawRoom({ wall: '#fbe9ef', wall2: '#f7d7e2', floor: '#e8cdb0', floorY: 486 });

    // spegel
    push();
    const mx = 720, my = 320, mw = 250, mh = 300;
    fillA('#000000', 22); rect(mx - mw / 2 + 6, my - mh / 2 + 8, mw, mh, mh / 2);
    fill('#ffffff'); rect(mx - mw / 2 - 8, my - mh / 2 - 8, mw + 16, mh + 16, mh / 2);
    fill('#dff0f5'); ellipse(mx, my, mw, mh);
    fillA('#ffffff', 150); ellipse(mx - 40, my - 70, 60, 110);
    // spegelbild
    push();
    translate(mx, my + 4); scale(0.52);
    this.drawPerson(0, 0, 92, true);
    pop();
    fillA('#ffffff', 60); ellipse(mx - 46, my - 60, 34, 92);
    fillA('#8fc4e8', 40); ellipse(mx, my, mw, mh);
    pop();

    // frisörstol
    push();
    fillA('#000000', 22); ellipse(392, 590, 240, 30);
    fill('#e890a8'); rect(276, 288, 232, 218, 26);            // ryggstöd
    fillA('#ffffff', 60); rect(292, 306, 44, 168, 20);
    fill('#d98ba2'); rect(384, 512, 20, 46, 8);               // pelare
    fill('#c47a92'); ellipse(392, 560, 104, 22);
    for (let i = 0; i < 5; i++) {                             // fot
      push(); translate(392, 560); rotate(i * TAU / 5 + 0.3);
      fill('#c47a92'); rect(-8, 0, 16, 38, 7); pop();
    }
    pop();

    // saxhylla
    fill('#c99a6a'); rect(96, 366, 108, 12, 5);
    fillA('#000000', 18); rect(100, 378, 100, 6, 3);

    // sits (bakom förklädet)
    fill('#efb2c4'); rect(262, 458, 260, 54, 24);
    fillA('#ffffff', 80); rect(272, 464, 240, 10, 5);

    // person
    this.drawPerson(392, 312 + sin(t * 1.5) * 2, 92, false);

    // armstöd framför
    fill('#d98ba2'); rect(250, 432, 66, 18, 9); rect(468, 432, 66, 18, 9);
    fillA('#ffffff', 80); rect(250, 432, 66, 6, 3); rect(468, 432, 66, 6, 3);

    // klipp-blixtar
    if (this.snipFlash > 0) {
      this.snipFlash -= deltaTime / 300;
      fillA('#ffffff', 180 * this.snipFlash);
      starShape(392 + random(-60, 60), 250 + random(-40, 40), 14, 6, 4);
    }

    // bricka
    drawToolTray(146, 392, '#fdeef3');
    drawToolTray(640, 296, '#f9eef6');
    for (const it of this.items()) {
      const sel = this.tool === it.id;
      if (sel) { noFill(); stroke('#63bda8'); strokeWeight(4); ellipse(it.x, it.y, it.r * 2 + 10, it.r * 2 + 10); noStroke(); }
      if (it.kind === 'tool') this.drawScissors(it.x, it.y, 1.15);
      else if (it.kind === 'color') {
        fill('#e8ded1'); ellipse(it.x, it.y + 4, it.r * 1.7, it.r * 0.5);
        fill(it.col); rect(it.x - 24, it.y - 22, 48, 46, 8);
        fillA('#ffffff', 110); rect(it.x - 18, it.y - 16, 10, 32, 4);
        fill('#6b5a4d'); rect(it.x - 14, it.y - 30, 28, 10, 3);
      } else {
        this.drawAcc(it.id, it.x, it.y, 0.9);
      }
    }

    // draget föremål
    if (this.drag) {
      const d = this.drag;
      if (d.kind === 'tool' && !this.cutDone && dist(d.x, d.y, 392, 300) < 170) hoverRing(392, 316, 96);
      if (d.kind === 'color' && dist(d.x, d.y, 392, 316) < 130) hoverRing(392, 316, 86);
      if (d.kind === 'acc' && dist(d.x, d.y, 392, 292) < 130) hoverRing(392, 292, 74);
      push(); translate(d.x, d.y - 26);
      if (d.kind === 'tool') this.drawScissors(0, 0, 1.3);
      else if (d.kind === 'color') {
        fill(d.col); rect(-24, -22, 48, 46, 8);
        fillA('#ffffff', 110); rect(-18, -16, 10, 32, 4);
        fill('#6b5a4d'); rect(-14, -30, 28, 10, 3);
      } else this.drawAcc(d.id, 0, 0, 1.1);
      pop();
    }

    // status
    const doneCount = (this.cutDone ? 1 : 0) + (this.colDone ? 1 : 0) + (this.accDone ? 1 : 0);
    this.done = doneCount;
    if (doneCount >= 3 && this.result <= 0 && !this.said) {
      this.said = true; this.result = 2800; this.sparkle = 1;
      setMood('happy', 3000); sfx.pling(); speak('Så fint det blev!');
      addHearts(392, 240, 4);
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 400, 0, 1);
      push(); translate(720, 320);
      fillA('#ffffff', 210 * a); rect(-110, -40, 220, 74, 20);
      fillA('#4a3f39', 235 * a); textAlign(CENTER, CENTER); textSize(18);
      text('SÅ FINT!', 0, -3);
      pop();
      if (this.sparkle > 0) {
        this.sparkle -= 0.01;
        for (let i = 0; i < 3; i++) {
          push(); translate(720 + random(-90, 90), 320 + random(-110, 110));
          fillA('#ffffff', 220 * a); starShape(0, 0, 12, 5, 4); pop();
        }
      }
      if (this.result <= 0) this.result = 0;
    }
  },

  drawPerson(x, y, r, mirror) {
    push(); translate(x, y);
    noStroke();
    // axlar
    fill('#9fd8e6'); ellipse(0, r * 1.05, r * 1.5, r * 0.72);
    // förkläde
    fill('#bfe8dd');
    beginShape();
    vertex(-r * 0.6, r * 0.76); vertex(r * 0.6, r * 0.76);
    vertex(r * 0.84, r * 1.62); vertex(-r * 0.84, r * 1.62);
    endShape(CLOSE);
    fillA('#7fc9b8', 120);
    beginShape();
    vertex(-r * 0.6, r * 0.76); vertex(r * 0.6, r * 0.76);
    vertex(r * 0.66, r * 0.9); vertex(-r * 0.66, r * 0.9);
    endShape(CLOSE);
    fillA('#ffffff', 120);
    beginShape();
    vertex(-r * 0.62, r * 0.78); vertex(r * 0.62, r * 0.78);
    vertex(r * 0.52, r * 1.02); vertex(-r * 0.52, r * 1.02);
    endShape(CLOSE);
    fill('#e8f5f0'); rect(-r * 0.3, r * 0.74, r * 0.6, r * 0.12, r * 0.05);
    // hår bakom
    fill(this.col);
    const fallLen = r * (0.35 + this.len * 1.55);
    ellipse(0, -r * 0.18, r * 2.24, r * (1.3 + this.len * 0.42));
    rect(-r * 1.12, -r * 0.3, r * 0.46, fallLen, r * 0.2);
    rect(r * 0.66, -r * 0.3, r * 0.46, fallLen, r * 0.2);
    // huvud
    drawFace(0, 0, r, {
      skin: '#f7cba8', hair: 'bald', hairCol: this.col,
      mouth: this.result > 0 ? 'open' : 'smile', open: 0.5,
      eyes: this.result > 0 ? 'happy' : 'open',
      look: { x: 0.4, y: 0.3 }, blushCol: '#ef8f9c', freckles: true,
    });
    // lugg
    fill(this.col);
    arc(0, -r * 0.66, r * 2.02, r * 1.0, PI * 1.04, PI * 1.96);
    ellipse(-r * 0.76, -r * 0.44, r * 0.4, r * 0.6);
    ellipse(r * 0.76, -r * 0.44, r * 0.4, r * 0.6);
    fillA('#ffffff', 46); ellipse(-r * 0.26, -r * 0.74, r * 0.66, r * 0.2);
    // hårstrån
    strokeA(shadeCol(this.col, -34), 120); strokeWeight(3); noFill();
    for (let sgn = -1; sgn <= 1; sgn += 2) {
      for (let i = 0; i < 3; i++) {
        const sx2 = sgn * r * (0.80 + i * 0.12);
        beginShape();
        vertex(sx2, -r * 0.44);
        bezierVertex(sx2 + sgn * r * 0.05, r * 0.1, sx2 - sgn * r * 0.03, r * 0.35, sx2 + sgn * r * 0.03, r * (0.38 + this.len * 0.45));
        endShape();
      }
    }
    strokeA('#ffffff', 70); strokeWeight(3);
    arc(0, -r * 0.62, r * 1.5, r * 0.9, PI * 1.15, PI * 1.55);
    noStroke();
    // accessoar
    if (this.acc === 'bow') {
      fill('#f7c948'); ellipse(-r * 0.66, -r * 0.92, r * 0.46, r * 0.34);
      ellipse(-r * 0.2, -r * 0.98, r * 0.46, r * 0.34);
      fill('#f2a0b4'); ellipse(-r * 0.42, -r * 0.95, r * 0.16, r * 0.16);
    } else if (this.acc === 'cap') {
      push(); rotate(0.08);
      fill('#ef8064'); arc(0, -r * 0.5, r * 1.9, r * 1.06, PI, TAU);
      fill('#d96b50'); rect(-r * 0.95, -r * 0.58, r * 1.9, r * 0.16, r * 0.07);
      pop();
    } else if (this.acc === 'glasses') {
      noFill(); stroke('#4a3f39'); strokeWeight(4.4);
      ellipse(-r * 0.36, -r * 0.15, r * 0.44, r * 0.38);
      ellipse(r * 0.36, -r * 0.15, r * 0.44, r * 0.38);
      line(-r * 0.14, -r * 0.15, r * 0.14, -r * 0.15);
      line(-r * 0.58, -r * 0.15, -r * 0.96, -r * 0.24);
      line(r * 0.58, -r * 0.15, r * 0.96, -r * 0.24);
      noStroke();
      fillA('#dff0f5', 90);
      ellipse(-r * 0.36, -r * 0.15, r * 0.4, r * 0.34);
      ellipse(r * 0.36, -r * 0.15, r * 0.4, r * 0.34);
    }
    pop();
  },

  drawScissors(x, y, sc) {
    push(); translate(x, y); scale(sc || 1); rotate(-0.3);
    stroke('#7f8f8a'); strokeWeight(4); noFill();
    line(-13, -16, 10, 14); line(13, -16, -10, 14);
    noStroke(); fill('#f2a0b4');
    ellipse(-16, 16, 13, 13); ellipse(16, 16, 13, 13);
    fill('#ffffff'); ellipse(-16, 16, 5, 5); ellipse(16, 16, 5, 5);
    fillA('#5f8e9c', 200); ellipse(0, 0, 6, 6);
    pop();
  },
  drawAcc(kind, x, y, sc) {
    push(); translate(x, y); scale(sc || 1); noStroke();
    if (kind === 'bow') {
      fill('#f7c948'); ellipse(-13, -2, 24, 18); ellipse(13, -2, 24, 18);
      fill('#f2a0b4'); ellipse(0, -2, 10, 10);
    } else if (kind === 'cap') {
      fill('#ef8064'); arc(0, 2, 46, 34, PI, TAU);
      fill('#d96b50'); rect(-25, 0, 34, 7, 3);
    } else {
      noFill(); stroke('#4a3f39'); strokeWeight(3);
      ellipse(-11, 0, 21, 18); ellipse(11, 0, 21, 18);
      line(-1, 0, 1, 0); line(-21, -2, -26, -5); line(21, -2, 26, -5);
      noStroke();
    }
    pop();
  },

  nearHead(p) {
    const h = this.head;
    return dist(p.x, p.y, h.x, h.y) < h.r * 1.65;
  },

  update(t) {
    if (this.targetCol) {
      this.col = lerpColor(color(this.col), color(this.targetCol), 0.1).toString('#rrggbb');
      this.colT = (this.colT || 0) + 1;
      if (this.colT > 16) { this.col = this.targetCol; this.targetCol = null; this.colT = 0; }
    }
  },

  down(p) {
    for (const it of this.items()) {
      if (dist(p.x, p.y, it.x, it.y) < it.r + 14) {
        this.tool = it.id;
        this.drag = { x: p.x, y: p.y, kind: it.kind, id: it.id, col: it.col };
        this.cutAcc = 0;
        G.dragAny = true; sfx.pickup(); G.lastAct = millis();
        return;
      }
    }
  },
  move(p) {
    const d = this.drag;
    if (!d) return;
    d.x = p.x; d.y = p.y;
    if (d.kind === 'tool' && !this.cutDone && this.nearHead(p)) {
      const dd = dist(p.x, p.y, this.head.x, this.head.y);
      this.cutAcc += dd > 20 ? 12 : 6;
      if (this.cutAcc > 34) {
        this.cutAcc = 0;
        this.len = max(0.28, this.len - 0.075);
        this.snipFlash = 1; sfx.snip();
        for (let i = 0; i < 4; i++) {
          G.parts.push({
            x: this.head.x + random(-90, 90), y: this.head.y + random(-40, 40),
            vx: random(-0.8, 0.8), vy: random(-0.6, 0.4), r: random(3, 6),
            life: 1, col: this.col, spin: random(-0.2, 0.2), square: true,
          });
        }
        if (this.len <= 0.3) {
          this.cutDone = true; this.drag = null;
          burst(this.head.x, this.head.y - 60, ['#f7c948', '#ffffff'], 10, 1);
          sfx.good(); gainStar(1); toast('Fint klippt!', 1400);
        }
      }
    }
  },
  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false;
    if (d.kind === 'tool') { sfx.drop(); return; }
    if (!this.nearHead(p)) { sfx.drop(); return; }
    if (d.kind === 'color' && !this.colDone) {
      this.targetCol = d.col; this.colT = 0; this.colDone = true;
      burst(this.head.x, this.head.y - 70, [d.col, '#ffffff'], 12, 1);
      sfx.splash(); gainStar(1); toast('Ny färg!', 1400);
      return;
    }
    if (d.kind === 'acc' && !this.accDone) {
      this.acc = d.id; this.accDone = true;
      burst(this.head.x, this.head.y - 80, ['#f7c948', '#ffffff'], 10, 1);
      sfx.pop(); gainStar(1); toast('Fint!', 1300);
      return;
    }
    sfx.drop();
  },
};

SCENE_META.push({
  id: 'hairdresser', label: 'Frisören', icon: 'scissors',
  desc: 'Klipp och färga håret', say: 'Klipp håret och välj en färg.',
  steps: ['Dra saxen genom håret.', 'Dra en färgburk till håret.', 'Sätt på en rosett, keps eller glasögon.'],
});
DEMOS.hairdresser = function () {
  const sc = SCENES.hairdresser;
  if (!sc.head) return null;
  const sax = sc.items()[0];
  return { from: { x: sax.x, y: sax.y }, to: { x: sc.head.x, y: sc.head.y - 20 }, r: 46 };
};
HINTS.hairdresser = function () {
  const sc = SCENES.hairdresser;
  if (!sc.head) return null;
  if (!sc.cutDone) { const s = sc.items()[0]; return { x: s.x, y: s.y, r: s.r }; }
  if (!sc.colDone) { const c = sc.items()[1]; return { x: c.x, y: c.y, r: c.r }; }
  if (!sc.accDone) { const a = sc.items()[5]; return { x: a.x, y: a.y, r: a.r }; }
  return null;
};