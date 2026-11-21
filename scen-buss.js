// ============================================================
//  BUSSEN — öppna dörren, ta med passageraren, kör vidare
// ============================================================

SCENES.bus = {
  reset() {
    this.stop = 0;
    this.who = 0;
    this.phase = 'wait';     // wait | boarding | ready | driving
    this.tp = 0;             // passagerarens gång 0 → 1
    this.driveT = 0;
    this.bg = 0;
    this.door = 0;
    this.bounce = 0;
    this.stars = 0;
    this.riders = [];
    this.talk = 0;
    this.wheel = 0;
    this.arriveT = 0;
  },
  passengers() {
    return [
      { col: '#ef8064', hat: '#f7c948', skin: '#f3d3b6' },
      { col: '#8fd8c6', hat: '#a9c7f5', skin: '#d9a97f' },
      { col: '#a9c7f5', hat: '#f2a0b4', skin: '#f6ddc6' },
    ];
  },
  mascot() { return null; },

  draw(t) {
    const sky = ['#dff1fb', '#ffeccd', '#e7e0f7'][this.stop % 3];
    noStroke(); fill(sky); rect(0, 0, W, 470);
    // sol
    fillA('#f7c948', 210); ellipse(840 - this.bg * 0.15, 110, 76, 76);
    fillA('#fff3c4', 90); ellipse(840 - this.bg * 0.15, 110, 112, 112);

    // moln
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 300 + 120 - this.bg * 0.25) % 1300 + 1300) % 1300 - 150;
      fillA('#ffffff', 220);
      ellipse(cx, 96 + (i % 2) * 34, 92, 44);
      ellipse(cx + 40, 84 + (i % 2) * 34, 70, 40);
      ellipse(cx - 38, 92 + (i % 2) * 34, 58, 34);
    }

    // hus
    const houses = [
      { x: 40, w: 150, h: 190, col: '#f0b8a8' },
      { x: 210, w: 120, h: 140, col: '#a9d9cc' },
      { x: 350, w: 170, h: 210, col: '#f5d79b' },
      { x: 540, w: 130, h: 160, col: '#c7c8ef' },
      { x: 700, w: 160, h: 200, col: '#efc3d2' },
      { x: 880, w: 140, h: 150, col: '#b8dff0' },
      { x: 1040, w: 150, h: 180, col: '#e2c9a8' },
    ];
    for (const h of houses) {
      const hx = ((h.x - this.bg * 0.6) % 1240 + 1240) % 1240 - 120;
      fill(h.col); rect(hx, 470 - h.h, h.w, h.h, 6);
      fillA('#ffffff', 90); rect(hx + 8, 470 - h.h + 8, h.w - 16, 10, 4);
      fillA('#4a3f39', 60);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        rect(hx + 16 + c * (h.w - 40) / 3, 470 - h.h + 34 + r * 46, 20, 26, 3);
      }
      fillA('#8a6a52', 120); rect(hx + h.w / 2 - 14, 428, 28, 42, 3);
    }

    // träd och bänk till vänster
    fill('#8f6a44'); rect(66, 386, 14, 70, 5);
    fill('#7fbf8f'); ellipse(73, 360, 96, 88); ellipse(46, 380, 62, 60); ellipse(102, 378, 66, 62);
    fillA('#ffffff', 55); ellipse(58, 342, 34, 26);
    fill('#c9a97f'); rect(20, 428, 104, 12, 5);
    fill('#b08e63'); rect(26, 440, 8, 14, 3); rect(110, 440, 8, 14, 3);
    fill('#b08e63'); rect(20, 404, 8, 26, 3); rect(116, 404, 8, 26, 3);

    // trottoar + väg
    fill('#e9e2d4'); rect(0, 452, W, 52);
    fillA('#000000', 18); rect(0, 452, W, 6);
    fill('#7f8b90'); rect(0, 504, W, 196);
    fill('#6e797e'); rect(0, 504, W, 10);
    // väglinje
    for (let i = -1; i < 12; i++) {
      const lx = ((i * 110 - this.bg) % 1100 + 1100) % 1100 - 100;
      fill('#f6f1e3'); rect(lx, 622, 56, 9, 4);
    }
    fillA('#000000', 20); rect(0, 664, W, 36);

    // hållplats
    const stopX = 800;
    if (this.phase !== 'driving') {
      fill('#9aa8ae'); rect(stopX - 5, 330, 10, 130, 4);
      fill('#7f8b90'); ellipse(stopX, 456, 26, 8);
      fill('#f7c948'); rect(stopX - 44, 292, 88, 46, 10);
      fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(12);
      text('BUSS', stopX, 306);
      fill('#6d6259'); textSize(9);
      text((this.stop + 1) + ' av 3', stopX, 322);
      fill('#9ec7b8'); rect(stopX + 42, 424, 104, 15, 7);
      fill('#8fb6a8'); rect(stopX + 54, 436, 8, 22, 3); rect(stopX + 126, 436, 8, 22, 3);
    }

    // passagerare som väntar
    if (this.phase === 'wait' || this.phase === 'boarding') {
      const p = this.passengers()[this.who % 3];
      const bob = sin(t * 3) * 3;
      let px = 762, py = 448 + bob;
      if (this.phase === 'boarding') {
        const k = this.tp;
        px = 762 - k * 92;
        py = 448 + sin(k * PI) * -24 + bob * (1 - k);
      } else {
        // vinkar
        push(); translate(px + 26, py - 42); rotate(sin(t * 8) * 0.5 - 0.4);
        fill(p.skin); ellipse(0, 0, 12, 12); pop();
      }
      this.drawKid(px, py, p, 1);
      // pratbubbla
      if (this.phase === 'wait' && Math.floor(t * 0.7) % 4 === 0) {
        fill('#ffffff'); rect(px - 66, py - 96, 54, 40, 12);
        triangle(px - 44, py - 56, px - 32, py - 56, px - 44, py - 44);
        fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(16);
        text('hej!', px - 39, py - 76);
      }
    }

    // buss
    const bobY = this.phase === 'driving' ? sin(t * 26) * 1.6 : sin(t * 2) * 0.8;
    push(); translate(0, 34 + bobY);
    const bx = 250;
    fillA('#000000', 24); ellipse(bx + 230, 528, 460, 26);
    // kaross
    fill('#f7c948'); rect(bx, 286, 470, 196, 26);
    fill('#f2c14e'); rect(bx, 286, 470, 40, 20);
    fillA('#ffffff', 120); rect(bx + 12, 294, 446, 12, 6);
    // fönster
    fill('#bfe2f0');
    for (let i = 0; i < 4; i++) rect(bx + 24 + i * 86, 332, 70, 62, 10);
    // passagerare i fönstren
    for (let i = 0; i < this.riders.length && i < 4; i++) {
      const r = this.riders[i];
      fill(r.skin); ellipse(bx + 145 + i * 86, 372, 26, 26);
      fill(r.col); rect(bx + 130 + i * 86, 384, 30, 14, 6);
      fill('#4a3f39'); ellipse(bx + 139 + i * 86, 370, 3, 4); ellipse(bx + 151 + i * 86, 370, 3, 4);
    }
    // mitt på bussen
    fillA('#ffffff', 150); rect(bx + 4, 402, 462, 6, 3);
    // dörr
    const dx = bx + 396;
    fill('#e8b23f'); rect(dx, 322, 62, 148, 8);
    if (this.door > 0.03) {
      fill('#5f8e9c');
      rect(dx + 4, 326, 54 * (1 - this.door), 140, 6);
      fillA('#bfe2f0', 200); rect(dx + 4, 326, 54 * (1 - this.door), 58, 6);
    } else {
      fillA('#5f8e9c', 200); rect(dx + 6, 330, 50, 58, 6); rect(dx + 6, 400, 50, 62, 6);
    }
    fill('#4a3f39'); ellipse(dx + 10, 396, 6, 6);
    // hjul
    this.wheel += this.phase === 'driving' ? 34 : 0;
    for (const wx of [bx + 106, bx + 366]) {
      fill('#3f4a4f'); ellipse(wx, 482, 74, 74);
      fill('#8f9ba0'); ellipse(wx, 482, 44, 44);
      fill('#cfd8db');
      push(); translate(wx, 482); rotate(this.wheel / 100);
      rect(-4, -18, 8, 36, 3); rect(-18, -4, 36, 8, 3); pop();
    }
    // Enzo kör (i första fönstret)
    const dxw = bx + 58, dyw = 366;
    fill('#7bcbb6'); ellipse(dxw, dyw, 44, 44);
    fill('#4a3f39'); ellipse(dxw - 10, dyw - 2, 5, 6); ellipse(dxw + 10, dyw - 2, 5, 6);
    fill('#5b8fa8'); arc(dxw, dyw - 13, 48, 26, PI, TAU); rect(dxw - 24, dyw - 15, 48, 5, 2);
    fill('#e0707a'); arc(dxw, dyw + 9, 16, 10, 0, PI);
    fill('#cfd8db'); ellipse(dxw + 30, dyw + 8, 26, 26);
    fill('#8f9ba0'); ellipse(dxw + 30, dyw + 8, 18, 18);

    // destinationsskylt
    fill('#4a3f39'); rect(bx + 122, 412, 214, 24, 7);
    fill('#f7c948'); textAlign(CENTER, CENTER); textSize(12);
    text('LILLA STADEN', bx + 229, 424);
    pop();

    // körknapp
    if (this.phase === 'ready') {
      const pulse = 1 + sin(t * 5) * 0.05;
      push(); translate(886, 606); scale(pulse);
      fillA('#000000', 24); ellipse(4, 6, 108, 108);
      fill('#63bda8'); ellipse(0, 0, 104, 104);
      fill('#ffffff'); triangle(-16, -20, 30, 0, -16, 20);
      noStroke(); pop();
      fillA('#1f6b58', 200); textAlign(CENTER, CENTER); textSize(11);
      text('KÖR', 886, 664);
    }

    // avgångsflagga
    if (this.phase === 'boarding') {
      fillA('#ffffff', 200); rect(44, 26, 176, 40, 12);
      fill('#1f6b58'); textAlign(CENTER, CENTER); textSize(13);
      text('Välkommen ombord!', 132, 46);
    }


  },

  drawKid(x, y, p, s) {
    push(); translate(x, y); scale(s);
    fillA('#000000', 16); ellipse(0, 4, 44, 12);
    fill(p.col); rect(-16, -44, 32, 44, 10);
    fill(p.skin); rect(-6, -6, 12, 8, 3);
    fill('#ffffff'); ellipse(-5, -40, 5, 5); ellipse(5, -40, 5, 5);
    fill('#4a3f39'); ellipse(-5, -40, 2.4, 2.8); ellipse(5, -40, 2.4, 2.8);
    fill(p.skin); ellipse(0, -52, 34, 34);
    fill(p.hat); arc(0, -62, 36, 26, PI, TAU); rect(-19, -63, 38, 5, 2);
    fillA('#f2a0b4', 160); ellipse(-10, -46, 7, 4); ellipse(10, -46, 7, 4);
    fill('#4a3f39'); ellipse(0, -44, 4, 3);
    pop();
  },

  tap(p) {
    if (this.phase === 'wait' && dist(p.x, p.y, 762, 430) < 110) {
      this.phase = 'boarding'; this.tp = 0; this.door = 1;
      sfx.pop(); G.lastAct = millis();
      return true;
    }
    if (this.phase === 'ready' && dist(p.x, p.y, 886, 606) < 72) {
      this.phase = 'driving'; this.driveT = 0; sfx.whoosh();
      G.lastAct = millis(); return true;
    }
    return false;
  },

  down(p) { this.tap(p); },
  move() {},
  up() {},

  update(t) {
    if (this.phase === 'boarding') {
      this.tp = min(1, this.tp + 0.022);
      if (this.tp >= 0.98) {
        this.riders.push(this.passengers()[this.who % 3]);
        this.phase = 'ready'; this.door = 0;
        gainStar(1); sfx.good(); toast('Tack för skjutsen!', 1300);
        addHearts(742, 350, 2);
        this.stars++;
        this.who++;
        if (this.stars >= 3) { setMood('happy', 3000); sfx.pling(); speak('Vilken bra busschaufför du är!'); }
        this.arriveT = 0;
      }
    } else if (this.phase === 'driving') {
      this.driveT += 0.02;
      this.bg += 16;
      this.door = 0;
      if (this.driveT >= 1) {
        this.stop++;
        if (this.stop >= 4) this.stop = 3;
        this.riders = [];
        this.phase = 'wait';
        this.driveT = 0;
        sfx.pling(); toast('Nästa hållplats!', 1200);
      }
    } else if (this.phase === 'ready') {
      this.arriveT += 1;
    }
    // dörren glider
    const target = this.phase === 'boarding' ? 1 : 0;
    this.door += (target - this.door) * 0.18;
  },
};

SCENE_META.push({
  id: 'bus', label: 'Bussen', icon: 'bus',
  desc: 'Kör en runda', say: 'Öppna dörren och kör till nästa hållplats.',
  steps: ['Tryck på den som väntar.', 'Tryck på den gröna knappen.', 'Kör fyra hållplatser.'],
});
DEMOS.bus = function () {
  const sc = SCENES.bus;
  if (!sc.phase) return null;
  if (sc.phase === 'wait') return { from: { x: 762, y: 430 }, to: { x: 762, y: 430 }, r: 46, tapOnly: true };
  if (sc.phase === 'ready') return { from: { x: 886, y: 606 }, to: { x: 886, y: 606 }, r: 48, tapOnly: true };
  return null;
};
HINTS.bus = function () {
  const sc = SCENES.bus;
  if (!sc.phase) return null;
  if (sc.phase === 'wait') return { x: 762, y: 420, r: 60 };
  if (sc.phase === 'ready') return { x: 886, y: 606, r: 62 };
  return null;
};