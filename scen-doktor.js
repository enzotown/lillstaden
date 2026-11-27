// ============================================================
//  DOKTORN — lyssna på hjärtat, hamra på knät, sätt på plåster
// ============================================================

SCENES.doctor = {
  reset() {
    this.heartDone = false; this.kneeDone = false; this.plasterDone = false;
    this.hold = 0; this.pulse = 0; this.kick = 0; this.plaster = null;
    this.drag = null; this.tool = null; this.result = 0; this.said = false;
    this.beat = 0; this.done = 0;
  },
  items() {
    return [
      { id: 'stet', x: 620, y: 596, r: 44 },
      { id: 'plaster', x: 730, y: 596, r: 40 },
      { id: 'hammer', x: 840, y: 596, r: 40 },
    ];
  },
  targets() {
    return {
      chest: { x: 348, y: 412, r: 40 },
      knee: { x: 404, y: 512, r: 34 },
      arm: { x: 262, y: 440, r: 38 },
    };
  },
  mascot() { return { x: 930, y: 528, s: 0.58, hat: 'cap' }; },

  draw(t) {
    drawRoom({ wall: '#e4f0f8', wall2: '#cfe4f4', floor: '#e8d6c0', floorY: 486 });
    drawWindow(60, 150, 180, 140, { sky: '#cdeaf7' });
    // hylla
    fill('#d8c3a8'); rect(720, 108, 210, 10, 4);
    fill('#c5ab8c'); rect(760, 70, 34, 38, 4); fill('#8fd8c6'); rect(764, 74, 26, 22, 3);
    fill('#e8b6c4'); rect(820, 78, 26, 30, 4);
    drawPlant(60, 486, 0.8);

    // undersökningsbänk
    fillA('#000000', 22); ellipse(340, 586, 300, 34);
    fill('#dfe9ee'); rect(180, 424, 320, 40, 14);
    fill('#c8d8e0'); rect(206, 462, 20, 110, 8); rect(456, 462, 20, 110, 8);
    fillA('#ffffff', 150); rect(190, 430, 300, 8, 4);

    // ben (under bänken)
    push();
    const kickA = sin(this.kick) * 0.5;
    translate(392, 470);
    for (const sgn of [-1, 1]) {
      push(); translate(sgn * 26, 0); rotate(sgn === 1 ? kickA : 0);
      fill('#f2c19c'); rect(-15, 0, 30, 96, 14);
      fill('#ffffff'); rect(-17, 84, 34, 22, 8);
      fill('#ef8064'); ellipse(0, 106, 34, 16);
      pop();
    }
    pop();

    // barnet: Liam
    const headY = 300 + sin(t * 1.3) * 2;
    // kropp
    fill('#f7c948'); rect(262, 372, 176, 66, 22);
    fillA('#ffffff', 130); rect(342, 380, 26, 50, 6);
    // arm med skråma
    fill('#f2c19c'); rect(244, 380, 38, 96, 18);
    fill('#f2f2f2'); ellipse(263, 478, 36, 28);
    fill('#f2c19c'); ellipse(263, 476, 32, 24);
    if (!this.plasterDone) {
      strokeA('#d96b50', 220); strokeWeight(3);
      line(252, 436, 264, 446); line(258, 436, 250, 448);
      noStroke();
      fillA('#f7c948', 120); ellipse(257, 442, 22, 18);
    }
    // huvud
    drawFace(340, headY, 82, {
      skin: '#f2c19c', hair: 'curly', hairCol: '#3f3128',
      mouth: this.plasterDone ? 'smile' : 'small', eyes: 'open',
      look: { x: 0.3, y: 0.1 }, blushCol: '#ef8f9c',
    });

    // affisch
    fill('#ffffff'); rect(560, 130, 104, 128, 10);
    fill('#f2a0b4'); rect(560, 130, 104, 20, 8);
    fill('#f7c948'); heartShape(612, 208, 26);
    fillA('#4a3f39', 200); textAlign(CENTER, CENTER); textSize(9);
    text('MÅ BRA!', 612, 244);

    // skärm med hjärtljud
    push();
    fill('#8fa9b4'); rect(760, 362, 24, 30, 6);
    fillA('#000000', 20); rect(632, 172, 292, 196, 18);
    fill('#2f4f57'); rect(626, 166, 292, 196, 18);
    fill('#3f6b74'); rect(626, 166, 292, 30, 14);
    fillA('#ffffff', 190); textAlign(LEFT, CENTER); textSize(11);
    text('HJÄRTLJUD', 644, 181);
    strokeA('#8fd8c6', 90); strokeWeight(1);
    for (let i = 0; i < 5; i++) line(644, 214 + i * 28, 900, 214 + i * 28);
    noStroke();
    // EKG
    const amp = this.heartDone ? 34 : 10;
    const spd = t * (this.heartDone ? 2.2 : 1.1);
    stroke('#8fd8c6'); strokeWeight(3.4); noFill();
    beginShape();
    for (let x = 0; x <= 244; x += 4) {
      const ph = ((x / 244 + spd * 0.35) % 1);
      let y = 0;
      if (ph > 0.42 && ph < 0.5) y = -sin((ph - 0.42) / 0.08 * PI) * 12;
      else if (ph > 0.5 && ph < 0.56) y = sin((ph - 0.5) / 0.06 * PI) * amp;
      else if (ph > 0.56 && ph < 0.64) y = -sin((ph - 0.56) / 0.08 * PI) * amp * 0.7;
      vertex(648 + x, 276 + y);
    }
    endShape();
    noStroke();
    if (this.heartDone) {
      fill('#f2a0b4'); heartShape(876, 196, 10 + sin(t * 6) * 2);
    }
    pop();

    // verktygsbricka
    drawToolTray(540, 380, '#eef7fb');
    for (const it of this.items()) {
      const sel = this.tool === it.id;
      if (sel) { noFill(); stroke('#63bda8'); strokeWeight(4); ellipse(it.x, it.y, it.r * 2 + 8, it.r * 2 + 8); noStroke(); }
      fill('#f4fafc'); ellipse(it.x, it.y, it.r * 2 - 6, it.r * 2 - 6);
      if (it.id === 'stet') this.drawStet(it.x, it.y, 0.9);
      else if (it.id === 'plaster') this.drawPlaster(it.x, it.y, 1);
      else this.drawHammer(it.x, it.y, 1);
    }

    // draget verktyg
    if (this.drag) {
      const d = this.drag;
      push(); translate(d.x, d.y - 30); rotate(0.15);
      if (d.id === 'stet') this.drawStet(0, 0, 1.05);
      else if (d.id === 'plaster') this.drawPlaster(0, 0, 1.15);
      else this.drawHammer(0, 0, 1.15);
      pop();
      const tg = this.currentTarget(this.drag);
      if (tg) {
        noFill(); strokeA('#63bda8', 220); strokeWeight(4);
        ellipse(tg.x, tg.y, tg.r * 2 + 8, tg.r * 2 + 8); noStroke();
      }
    }

    // påsatt plåster
    if (this.plasterDone && this.plaster) {
      push(); translate(this.plaster.x, this.plaster.y); rotate(-0.5);
      this.drawPlaster(0, 0, 1.05); pop();
    }

    // hjärtat slår
    if (this.heartDone) {
      this.beat += deltaTime / 1000;
      const k = (this.beat % 0.9);
      const sc = k < 0.16 ? 1 + sin(k / 0.16 * PI) * 0.22 : 1;
      push(); translate(340, 404); scale(sc); fillA('#f2a0b4', 120);
      heartShape(0, 0, 26); pop();
    }

    this.done = (this.heartDone ? 1 : 0) + (this.kneeDone ? 1 : 0) + (this.plasterDone ? 1 : 0);
    if (this.done >= 3 && !this.said) {
      this.said = true; this.result = 2800;
      setMood('happy', 3200); sfx.pling(); addHearts(340, 260, 4);
      burst(340, 300, ['#8fd8c6', '#ffffff', '#f2a0b4'], 20, 1.2);
      speak('Allt ser bra ut!');
    }
    if (this.result > 0) {
      this.result -= deltaTime;
      const a = constrain(this.result / 400, 0, 1);
      push(); translate(W / 2, 250);
      fillA('#ffffff', 245 * a); rect(-150, -46, 300, 92, 24);
      fill('#f2a0b4'); heartShape(-104, 0, 18);
      fillA('#4a3f39', 255 * a); textAlign(CENTER, CENTER); textSize(22);
      text('DU ÄR FRISK!', 18, 0);
      pop();
      if (this.result <= 0) this.result = 0;
    }

    // sparkar
    if (this.kick > 0) this.kick = max(0, this.kick - deltaTime / 600);
  },

  drawStet(x, y, sc) {
    push(); translate(x, y); scale(sc); noFill();
    stroke('#5f8e9c'); strokeWeight(4);
    bezier(-16, -26, -22, 8, -8, 26, 0, 30);
    bezier(16, -26, 22, 8, 8, 26, 0, 30);
    stroke('#7fa8c9'); strokeWeight(3);
    line(-16, -26, -24, -34); line(16, -26, 24, -34);
    noStroke(); fill('#9fb6c2'); ellipse(-25, -36, 8, 12); ellipse(25, -36, 8, 12);
    fill('#c9d6dd'); ellipse(0, 34, 26, 26);
    fill('#8fb6c4'); ellipse(0, 34, 16, 16);
    fillA('#ffffff', 170); ellipse(-4, 30, 6, 6);
    pop();
  },
  drawPlaster(x, y, sc) {
    push(); translate(x, y); scale(sc); rotate(-0.3); noStroke();
    fill('#f2d7b8'); rect(-24, -9, 48, 18, 6);
    fillA('#e0bd94', 255); rect(-8, -9, 16, 18, 3);
    fillA('#d9a97d', 200);
    for (let i = 0; i < 4; i++) ellipse(-5 + (i % 2) * 8, -3 + floor(i / 2) * 6, 2, 2);
    pop();
  },
  drawHammer(x, y, sc) {
    push(); translate(x, y); scale(sc); noStroke();
    fill('#c9a06a'); rect(-4, -24, 8, 46, 4);
    fill('#898f96'); ellipse(2, -26, 26, 14);
    fill('#f2c19c'); ellipse(-2, -26, 10, 10);
    pop();
  },

  currentTarget(d) {
    const tg = this.targets();
    if (d.id === 'stet' && !this.heartDone && dist(d.x, d.y, tg.chest.x, tg.chest.y) < tg.chest.r + 14) return tg.chest;
    if (d.id === 'hammer' && !this.kneeDone && dist(d.x, d.y, tg.knee.x, tg.knee.y) < tg.knee.r + 16) return tg.knee;
    if (d.id === 'plaster' && !this.plasterDone && dist(d.x, d.y, tg.arm.x, tg.arm.y) < tg.arm.r + 16) return tg.arm;
    return null;
  },

  update(t) {
    const d = this.drag;
    if (d && d.id === 'stet') {
      const tg = this.targets().chest;
      if (dist(d.x, d.y, tg.x, tg.y) < tg.r + 14 && !this.heartDone) {
        this.hold += deltaTime;
        if (this.hold % 700 < 40) { sfx.heartbeat(); this.pulse = 1; }
        if (this.hold > 1100) {
          this.heartDone = true; this.hold = 0; this.drag = null;
          sfx.heartbeat(); gainStar(1); toast('Hjärtat låter fint', 1600);
        }
      } else this.hold = max(0, this.hold - deltaTime * 1.5);
    }
    if (this.pulse > 0) this.pulse -= 0.05;
  },

  down(p) {
    for (const it of this.items()) {
      if (dist(p.x, p.y, it.x, it.y) < it.r + 12) {
        if (it.id === 'plaster' && this.plasterDone) continue;
        if (it.id === 'stet' && this.heartDone) continue;
        if (it.id === 'hammer' && this.kneeDone) continue;
        this.tool = it.id; this.drag = { x: p.x, y: p.y, id: it.id };
        this.hold = 0;
        G.dragAny = true; sfx.pickup(); G.lastAct = millis(); return;
      }
    }
  },
  move(p) {
    if (this.drag) { this.drag.x = p.x; this.drag.y = p.y; }
  },
  up(p) {
    const d = this.drag;
    if (!d) return;
    this.drag = null; G.dragAny = false; this.hold = 0;
    const tg = this.targets();
    if (d.id === 'stet') {
      if (dist(p.x, p.y, tg.chest.x, tg.chest.y) < tg.chest.r + 14 && !this.heartDone) {
        this.heartDone = true; sfx.heartbeat(); gainStar(1); toast('Hjärtat låter fint', 1500);
      } else sfx.drop();
    } else if (d.id === 'hammer') {
      if (dist(p.x, p.y, tg.knee.x, tg.knee.y) < tg.knee.r + 16 && !this.kneeDone) {
        this.kneeDone = true; this.kick = PI * 1.2; sfx.pop(); sfx.good();
        gainStar(1); toast('Knät sparkar!', 1500);
        burst(tg.knee.x, tg.knee.y, ['#8fd8c6', '#ffffff'], 10, 1);
      } else sfx.drop();
    } else if (d.id === 'plaster') {
      if (dist(p.x, p.y, tg.arm.x, tg.arm.y) < tg.arm.r + 16 && !this.plasterDone) {
        this.plasterDone = true; this.plaster = { x: p.x, y: p.y };
        sfx.pop(); gainStar(1); toast('Plåster på!', 1400);
      } else sfx.drop();
    }
  },
};

SCENE_META.push({
  id: 'doctor', label: 'Doktorn', icon: 'heart',
  desc: 'Lyssna och plåstra om', say: 'Lyssna på hjärtat och sätt på ett plåster.',
  steps: ['Dra stetoskopet till bröstet.', 'Hamra försiktigt på knät.', 'Sätt plåster på skråman.'],
});
DEMOS.doctor = function () {
  const sc = SCENES.doctor;
  const st = sc.items()[0], tg = sc.targets().chest;
  return { from: { x: st.x, y: st.y }, to: { x: tg.x, y: tg.y }, r: 40 };
};
HINTS.doctor = function () {
  const sc = SCENES.doctor;
  if (!sc.heartDone) return { x: sc.items()[0].x, y: sc.items()[0].y, r: 40 };
  if (!sc.kneeDone) return { x: sc.items()[2].x, y: sc.items()[2].y, r: 36 };
  if (!sc.plasterDone) return { x: sc.items()[1].x, y: sc.items()[1].y, r: 36 };
  return null;
};