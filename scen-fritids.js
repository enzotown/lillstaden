// ============================================================
//  FRITIDS — bygg ett torn, och rusa in i det med bollen
// ============================================================

SCENES.fritids = {
  reset() {
    this.tower = [];
    this.bin = [
      { col: '#ef8064' }, { col: '#8fd8c6' }, { col: '#f7c948' }, { col: '#b79ce0' },
    ];
    this.next = 0;
    this.drag = null; this.ball = { x: 838, y: 560 }; this.ballDrag = null;
    this.shake = 0; this.result = 0; this.said = false; this.done = 0;
    this.towerX = 452; this.baseY = 604;
    this.spin = 0;
  },
  mascot() { return { x: 690, y: 528, s: 0.58, hat: 'cap' }; },

  blockPos(i) {
    return { x: this.towerX, y: this.baseY - i * 48 - 24 };
  },

  draw(t) {
    drawRoom({ wall: '#f2e8f7', wall2: '#e6d8f0', floor: '#e8cdb0', floorY: 486 });
    // fönster + hylla
    drawWindow(60, 150, 180, 140, { sky: '#cdeaf7' });
    // vimplar
    for (let i = 0; i < 7; i++) {
      const vx = 290 + i * 96;
      fill(['#ef8064', '#f7c948', '#8fd8c6', '#b79ce0'][i % 4]);
      triangle(vx - 22, 104, vx + 22, 104, vx, 140);
    }
    strokeA('#a08e80', 90); strokeWeight(2); noFill();
    beginShape(); vertex(268, 104); bezierVertex(500, 84, 760, 124, 980, 100); endShape(); noStroke();
    drawPlant(352, 486, 0.75);
    fill('#d8c3a8'); rect(700, 130, 240, 12, 5);
    fill('#ef8064'); rect(724, 96, 26, 34, 5);
    fill('#8fd8c6'); rect(764, 104, 22, 26, 5);
    fill('#f7c948'); ellipse(830, 112, 24, 26);
    fill('#b79ce0'); rect(866, 98, 26, 32, 5);

    // matta
    fillA('#000000', 18); ellipse(470, 630, 430, 70);
    fill('#f7cfe0'); ellipse(470, 616, 420, 120);
    fillA('#ffffff', 130);
    for (let i = 0; i < 8; i++) ellipse(300 + i * 48, 616, 12, 12);
    fillA('#f2a0b4', 90); ellipse(470, 616, 330, 84);

    // lådan med klossar
    fill('#c99a6a'); rect(120, 492, 200, 116, 12);
    fill('#b9895c'); rect(132, 504, 176, 92, 8);
    fillA('#000000', 26); rect(132, 504, 176, 92, 8);
    for (let i = 0; i < 4; i++) {
      push(); translate(168 + i * 44, 566); rotate(-0.12 + i * 0.09);
      fill(this.bin[i].col); rect(-19, -14, 38, 28, 6);
      fillA('#ffffff', 110); rect(-19, -14, 38, 8, 4);
      pop();
    }

    // boll
    push(); translate(this.ball.x, this.ball.y); rotate(this.spin);
    fillA('#000000', 24); ellipse(2, 28, 48, 12);
    fill('#7fa8c9'); ellipse(0, 0, 58, 58);
    fill('#ffffff'); arc(0, 0, 58, 58, -PI / 2, 0.4);
    fill('#ef8064'); ellipse(-10, 8, 14, 14);
    fillA('#ffffff', 170); ellipse(-14, -14, 12, 9);
    pop();
    this.spin += 0.01;

    // tornet
    for (let i = 0; i < this.tower.length; i++) {
      const p = this.blockPos(i);
      const b = this.tower[i];
      push(); translate(p.x + (this.shake > 0 ? sin(millis() / 30) * this.shake : 0), p.y);
      fillA('#000000', 20); rect(-40, -18, 80, 46, 8);
      fill(b.col); rect(-40, -24, 80, 46, 8);
      fillA('#ffffff', 120); rect(-40, -24, 80, 10, 5);
      fillA('#000000', 16); rect(-40, 14, 80, 8, 4);
      // klossmönster
      fillA('#ffffff', 90); ellipse(-16, -4, 12, 12); ellipse(16, -4, 12, 12);
      pop();
    }
    // dragen kloss
    if (this.drag) {
      push(); translate(this.drag.x, this.drag.y); rotate(this.drag.rot || 0);
      fillA('#000000', 26); rect(-40, 6, 80, 46, 8);
      fill(this.drag.col); rect(-40, -24, 80, 46, 8);
      fillA('#ffffff', 120); rect(-40, -24, 80, 10, 5);
      fillA('#ffffff', 90); ellipse(-16, -4, 12, 12); ellipse(16, -4, 12, 12);
      pop();
    }
    // boll dragen
    if (this.ballDrag) {
      push(); translate(this.ballDrag.x, this.ballDrag.y);
      fill('#7fa8c9'); ellipse(0, 0, 62, 62);
      fill('#ffffff'); arc(0, 0, 62, 62, -PI / 2, 0.4);
      fill('#ef8064'); ellipse(-10, 8, 14, 14);
      pop();
    }

    if (this.shake > 0) this.shake = max(0, this.shake - deltaTime / 60);

    // räknare nära tornet
    fillA('#ffffff', 230); rect(340, 300, 230, 44, 22);
    fill(PAL.ink); textAlign(CENTER, CENTER); textSize(13);
    text('TORN: ' + this.tower.length + ' av 5', 455, 322);

    this.done = min(5, this.tower.length);
    if (this.tower.length >= 5 && !this.said) {
      this.said = true; this.result = 2800;
      setMood('happy', 3400); sfx.pling(); speak('Vilket högt torn!');
      burst(452, 300, ['#f7c948', '#8fd8c6', '#f2a0b4', '#ffffff'], 30, 1.5);
      addHearts(452, 280, 5);
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 400, 0, 1);
      fillA('#ffffff', 240 * a); rect(W / 2 - 150, 200, 300, 92, 24);
      fillA('#4a3f39', 255 * a); textAlign(CENTER, CENTER); textSize(20);
      text('HÖGT TORN!', W / 2, 246);
      if (this.result <= 0) this.result = 0;
    }
  },

  down(p) {
    // boll
    if (dist(p.x, p.y, this.ball.x, this.ball.y) < 40) {
      this.ballDrag = { x: p.x, y: p.y }; G.dragAny = true; sfx.pickup(); return;
    }
    // kloss från lådan
    if (p.x > 120 && p.x < 320 && p.y > 492 && p.y < 610) {
      const col = this.bin[this.next % this.bin.length].col;
      this.next++;
      this.drag = { x: p.x, y: p.y, col: col, rot: -0.1 };
      G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
    }
  },
  move(p) {
    if (this.drag) { this.drag.x = p.x; this.drag.y = p.y; }
    if (this.ballDrag) { this.ballDrag.x = p.x; this.ballDrag.y = p.y; }
  },
  up(p) {
    if (this.drag) {
      const near = abs(p.x - this.towerX) < 86 && p.y < this.baseY + 30;
      if (near && this.tower.length < 5) {
        this.tower.push({ col: this.drag.col });
        this.drag = null; G.dragAny = false;
        sfx.drop(); sfx.pop(); gainStar(1);
        this.shake = 3;
        return;
      }
      this.drag = null; G.dragAny = false;
      sfx.drop(); return;
    }
    if (this.ballDrag) {
      const d = this.ballDrag;
      this.ballDrag = null; G.dragAny = false;
      const hit = this.tower.length > 0 && abs(d.x - this.towerX) < 110 && d.y < this.baseY - 10;
      if (hit) {
        for (const b of this.tower) {
          const i = this.tower.indexOf(b);
          const pp = this.blockPos(i);
          burst(pp.x, pp.y, [b.col, '#ffffff'], 8, 1.4);
        }
        this.tower = [];
        this.shake = 10;
        sfx.bad(); sfx.drop();
        toast('Oj då! Bygg igen', 1500);
        setMood('yuck', 900);
        this.ball.x = 838; this.ball.y = 560;
      } else {
        this.ball.x = constrain(d.x, 60, W - 60);
        this.ball.y = constrain(d.y, 120, 640);
        if (this.ball.y > 600) { this.ball.x = 838; this.ball.y = 560; }
      }
      return;
    }
  },
};

SCENE_META.push({
  id: 'fritids', label: 'Fritids', icon: 'block',
  desc: 'Bygg ett högt torn', say: 'Bygg ett torn av klossarna.',
  steps: ['Dra en kloss från lådan.', 'Släpp den ovanpå tornet.', 'Bygg fem klossar högt.'],
});
DEMOS.fritids = function () {
  return { from: { x: 190, y: 566 }, to: { x: 452, y: 560 }, r: 40 };
};
HINTS.fritids = function () {
  if (!SCENES.fritids.tower) return null;
  if (SCENES.fritids.tower.length >= 5) return null;
  return { x: 190, y: 566, r: 44 };
};