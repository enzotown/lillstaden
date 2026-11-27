// ============================================================
//  SAGOHÖRNAN — bokhylla, sidor och röst
// ============================================================

// koppla varje sidtext till en inläst mp3
for (let i = 0; i < SAGOR.length; i++) {
  for (let j = 0; j < SAGOR[i].sidor.length; j++) {
    SAY_FILES[SAGOR[i].sidor[j].text] = 'roster/saga-' + (i + 1) + '-' + (j + 1) + '.mp3';
  }
}

SAY_FILES['Välj en saga. Tryck på den gröna pilen för nästa sida.'] = 'roster/say-saga.mp3';

SCENES.saga = {
  ownHud: true,
  reset() {
    this.bok = null; this.sida = 0; this.turn = 1; this.spoken = '';
    this.pulse = 0;
  },

  mascot() { return null; },

  draw(t) {
    if (this.bok === null) this.drawShelf(t);
    else this.drawStory(t);
  },

  // --- bokhyllan ---
  bokRutor() {
    const out = [];
    const cw = 250, ch = 172, gap = 26;
    for (let i = 0; i < SAGOR.length; i++) {
      const row = i < 3 ? 0 : 1;
      const inRow = row === 0 ? 3 : SAGOR.length - 3;
      const idx = row === 0 ? i : i - 3;
      const totW = inRow * cw + (inRow - 1) * gap;
      const x = (W - totW) / 2 + idx * (cw + gap);
      const y = 172 + row * (ch + 34);
      out.push({ i: i, x: x, y: y, w: cw, h: ch });
    }
    return out;
  },

  drawShelf(t) {
    noStroke(); fill('#f6e8d8'); rect(0, 0, W, H);
    for (let i = 0; i < 12; i++) { fillA('#efdcc4', 130); rect(i * 88, 0, 34, 470); }
    fill('#e2c9a8'); rect(0, 470, W, H - 470);
    fillA('#ffffff', 210); rect(0, 90, W, 60);
    fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(26);
    text('SAGOHÖRNAN', W / 2, 120);
    fillA('#a08e80', 255); textSize(11);
    text('fem små sagor', W / 2, 138);

    const rutor = this.bokRutor();
    for (const r of rutor) {
      const s = SAGOR[r.i];
      fillA('#000000', 18); rect(r.x + 5, r.y + 7, r.w, r.h, 18);
      fill(s.farg); rect(r.x, r.y, r.w, r.h, 18);
      fillA('#ffffff', 225); rect(r.x + 10, r.y + 10, r.w - 20, r.h - 20, 12);
      fill(s.farg); ellipse(r.x + 54, r.y + 54, 62, 62);
      fill('#ffffff'); ellipse(r.x + 54, r.y + 54, 34, 34);
      drawIcon('book', r.x + 54, r.y + 54, s.farg, 0.72);
      fill('#4a3f39'); textAlign(LEFT, CENTER); textSize(16);
      text(s.titel, r.x + 92, r.y + 46, r.w - 106, 46);
      fillA('#a08e80', 255); textSize(10);
      text('TRYCK FÖR ATT LÄSA', r.x + 92, r.y + 96);
      fillA('#ffffff', 190); rect(r.x + 22, r.y + r.h - 44, 76, 26, 13);
      fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(10);
      text(s.sidor.length + ' sidor', r.x + 60, r.y + r.h - 31);
    }

    // liten Marre i hörnet
    sagaMarre(880, 618, 0.62);
    fillA('#f2a0b4', 60); ellipse(250, 640, 220, 54);
    fill('#b79ce0'); rect(200, 614, 110, 40, 10);
    fill('#d8cbf0'); rect(206, 606, 98, 18, 8);
  },

  // --- en sida ---
  drawStory(t) {
    const s = SAGOR[this.bok], sd = s.sidor[this.sida];
    push();
    sd.art(t);
    pop();
    // textkort högst upp
    fillA('#000000', 22); rect(76, 106, 848, 112, 24);
    fillA('#fffaf3', 248); rect(72, 100, 848, 112, 24);
    fill('#f1e0cf'); rect(94, 202, 804, 3, 2);
    fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(23); textLeading(28);
    text(sd.text, 108, 112, W - 216, 92);

    // sidprickar
    for (let i = 0; i < s.sidor.length; i++) {
      fill(i === this.sida ? '#4a3f39' : '#e0d3c4');
      ellipse(W / 2 - (s.sidor.length - 1) * 12 + i * 24, 668, i === this.sida ? 12 : 9, i === this.sida ? 12 : 9);
    }

    // pilar
    fillA('#000000', 20); ellipse(74, 622, 84, 84);
    fill('#ffffff'); ellipse(72, 618, 80, 80);
    fill(this.sida > 0 ? '#63bda8' : '#e8ded1');
    triangle(84, 618, 62, 602, 62, 634);

    const sist = this.sida >= s.sidor.length - 1;
    const r = 56 + sin(t * 3) * 2;
    fillA('#000000', 22); ellipse(926, 626, r * 2, r * 2);
    fill(sist ? '#f7c948' : '#63bda8'); ellipse(924, 622, r * 2, r * 2);
    fill(sist ? '#5b4a2a' : '#ffffff');
    if (sist) {
      heartShape(924, 616, 16);
    } else {
      triangle(908, 622, 930, 602, 930, 642);
    }
  },

  hud(t) {
    // bakåtknapp
    fillA('#000000', 18); ellipse(58, 54, 76, 76);
    fillA('#ffffff', 235); ellipse(56, 51, 72, 72);
    strokeA('#4a3f39', 220); strokeWeight(4); noFill();
    line(74, 51, 42, 51); noStroke();
    fill('#4a3f39'); triangle(34, 51, 52, 38, 52, 64);
    // stjärnor
    fillA('#ffffff', 225); rect(W - 150, 24, 126, 44, 22);
    fill('#f7c948'); starShape(W - 122, 46, 12, 5);
    fill('#4a3f39'); textAlign(LEFT, CENTER); textSize(17);
    text('× ' + G.stars, W - 102, 47);
  },

  down(p) {
    // bakåt / meny
    if (dist(p.x, p.y, 58, 54) < 44) {
      if (this.bok !== null) { this.bok = null; this.sida = 0; sfx.whoosh(); }
      else { G.menu = true; sfx.pop(); }
      return;
    }
    if (this.bok === null) {
      for (const r of this.bokRutor()) {
        if (inRect(p, r)) {
          this.bok = r.i; this.sida = 0; this.spoken = ''; this.turn = 0;
          sfx.pling(); G.lastAct = millis();
          return;
        }
      }
      return;
    }
    const s = SAGOR[this.bok];
    if (dist(p.x, p.y, 924, 622) < 62) {
      if (this.sida >= s.sidor.length - 1) { this.bok = null; this.sida = 0; sfx.good(); }
      else { this.sida++; this.turn = 0; sfx.whoosh(); }
      return;
    }
    if (dist(p.x, p.y, 72, 618) < 52 && this.sida > 0) {
      this.sida--; this.turn = 0; sfx.pop(); return;
    }
    // tryck på bilden: berättarrösten igen
    if (p.y < 460) { this.spoken = ''; }
  },

  update(t) {
    this.turn = min(1, this.turn + deltaTime / 260);
    if (this.bok !== null) {
      const txt = SAGOR[this.bok].sidor[this.sida].text;
      if (this.spoken !== txt) {
        this.spoken = txt;
        speak(txt);
      }
    }
  },
};

SCENE_META.push({
  id: 'saga', label: 'Sagohörnan', icon: 'book',
  desc: 'Fem små sagor med röst',
  say: 'Välj en saga. Tryck på den gröna pilen för nästa sida.',
  steps: ['Tryck på en bok.', 'Lyssna på sagan.', 'Tryck på pilen för nästa sida.'],
});
HINTS.saga = null;
DEMOS.saga = null;