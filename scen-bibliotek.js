// ============================================================
//  BIBLIOTEKET — sortera böckerna och läs en bilderbok
// ============================================================

SCENES.library = {
  reset() {
    this.books = [
      { id: 0, col: '#ef8064', shelf: 0, x: 340, y: 560, done: false },
      { id: 1, col: '#63bda8', shelf: 1, x: 448, y: 560, done: false },
      { id: 2, col: '#f7c948', shelf: 2, x: 556, y: 560, done: false },
    ];
    this.drag = null;
    this.story = false;     // bilderboken har dykt upp
    this.read = -1;         // -1 stängd, 0..2 sidor
    this.pageT = 0;
    this.shelved = 0;
    this.readDone = false;
    this.sparkle = 0;
  },
  shelves() {
    return [
      { x: 176, y: 178, w: 196, h: 214, col: '#ef8064', light: '#f7b3a2' },
      { x: 402, y: 178, w: 196, h: 214, col: '#63bda8', light: '#a9e0d4' },
      { x: 628, y: 178, w: 196, h: 214, col: '#f7c948', light: '#fbe29a' },
    ];
  },
  slotPos(i) {
    const s = this.shelves()[i];
    const n = this.books.filter(function (b) { return b.done && b.shelf === i; }).length;
    return { x: s.x + 28 + (n % 3) * 52, y: s.y + 106 + floor(n / 3) * 62 };
  },
  mascot() { return { x: 934, y: 528, s: 0.58, hat: 'cap', outfit: 'librarian' }; },

  draw(t) {
    drawRoom({ wall: '#f6eee2', wall2: '#e9dcc9', floor: '#d8b98f', floorY: 486 });

    // matta
    fillA('#000000', 14); ellipse(820, 580, 340, 60);
    fill('#e8d3ee'); ellipse(820, 570, 330, 52);
    fill('#dcc0e6'); ellipse(820, 570, 240, 34);

    // hyllor
    for (let i = 0; i < 3; i++) {
      const s = this.shelves()[i];
      fillA('#000000', 16); rect(s.x + 4, s.y + 6, s.w, s.h, 12);
      fill(s.col); rect(s.x, s.y, s.w, s.h, 12);
      fill(s.light); rect(s.x + 6, s.y + 6, s.w - 12, s.h - 12, 9);
      // hyllplan
      fill(s.col);
      for (let r = 0; r < 3; r++) rect(s.x + 8, s.y + 78 + r * 62, s.w - 16, 9, 4);
      // böcker som redan står där (dekoration)
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          if ((i + r + c) % 3 === 0) continue;
          fillA(i === 0 ? '#c86450' : i === 1 ? '#3f8d7c' : '#c9a13a', 190);
          rect(s.x + 20 + c * 44, s.y + 36 + r * 62, 18, 42, 3);
        }
      }
      // skylt
      fill('#fffaf3'); rect(s.x + s.w / 2 - 34, s.y - 14, 68, 24, 10);
      fill(s.col); textAlign(CENTER, CENTER); textSize(10);
      text(['RÖD', 'GRÖN', 'GUL'][i], s.x + s.w / 2, s.y - 2);
    }

    // fönster + läshörna
    drawWindow(52, 150, 108, 132, { sky: '#d6ecf7' });
    fill('#c9a97f'); rect(700, 470, 280, 12, 4);

    // böcker på vagn
    fill('#b98f60'); rect(300, 558, 300, 10, 4);
    fill('#8f6a44'); rect(310, 568, 10, 46, 4); rect(580, 568, 10, 46, 4);
    fill('#8f6a44'); ellipse(318, 618, 16, 12); ellipse(582, 618, 16, 12);
    for (const b of this.books) {
      if (b.done) continue;
      if (this.drag && this.drag.id === b.id) continue;
      fillA('#000000', 14); rect(b.x - 22, b.y - 52, 46, 56, 6);
      fill(b.col); rect(b.x - 26, b.y - 58, 48, 54, 6);
      fillA('#ffffff', 85); rect(b.x - 21, b.y - 52, 38, 34, 4);
      fillA('#ffffff', 150); rect(b.x - 22, b.y - 58, 8, 54, 4);
      fillA('#000000', 40); rect(b.x - 16, b.y - 20, 28, 3, 2);
      rect(b.x - 16, b.y - 13, 22, 3, 2);
    }

    // boken som följer fingret
    if (this.drag) {
      const db = this.books[this.drag.id];
      const sh = this.shelves()[db.shelf];
      noFill(); strokeA('#63bda8', 220); strokeWeight(5);
      rect(sh.x - 5, sh.y - 5, sh.w + 10, sh.h + 10, 16); noStroke();
      push(); translate(this.drag.x, this.drag.y - 26); rotate(-0.12);
      fillA('#000000', 22); rect(-24, -26, 50, 58, 6);
      fill(db.col); rect(-26, -32, 48, 54, 6);
      fillA('#ffffff', 85); rect(-21, -26, 38, 34, 4);
      pop();
    }

    // bilderboken
    if (this.story && !this.readDone) {
      const pulse = 1 + sin(t * 3.4) * 0.04;
      fillA('#f7c948', 70); ellipse(820, 556, 150 + sin(t * 3) * 10, 150 + sin(t * 3) * 10);
      push(); translate(820, 548); scale(pulse);
      fill('#fffaf3'); rect(-56, -46, 112, 92, 8);
      fill('#8fd8c6'); rect(-56, -46, 22, 92, 6);
      fill('#f7c948'); ellipse(14, -8, 54, 54);
      fill('#a9c7f5'); ellipse(6, 26, 70, 26);
      pop();
      fill('#1f6b58'); textAlign(CENTER, CENTER); textSize(10);
      text('LÄS MIG', 820, 622);
    }

    // hyllbok animeras
    for (const b of this.books) {
      if (!b.done) continue;
      const sp = this.slotPos(b.shelf);
      fillA('#000000', 12); rect(sp.x - 20, sp.y - 38, 42, 44, 5);
      fill(b.col); rect(sp.x - 24, sp.y - 48, 44, 48, 5);
      fillA('#ffffff', 120); rect(sp.x - 20, sp.y - 44, 7, 40, 3);
    }

    // läshörna: pall och bok
    fill('#c98a5a'); rect(700, 470, 280, 12, 4);

    // stjärngnistra när allt är klart
    if (this.story && !this.readDone) {
      for (let i = 0; i < 5; i++) {
        fillA('#f7c948', 150 + sin(t * 3 + i) * 90);
        starShape(760 + i * 32, 470 + sin(t * 2 + i * 1.7) * 18, 6, 3);
      }
    }


    // den öppna boken
    if (this.read >= 0) this.drawBook(t);
  },

  drawBook(t) {
    fillA('#3a332e', 170); rect(0, 0, W, H);
    const bw = 700, bh = 470;
    const bx = (W - bw) / 2, by = (H - bh) / 2;
    fillA('#000000', 26); rect(bx + 8, by + 10, bw, bh, 18);
    fill('#fffaf3'); rect(bx, by, bw, bh, 18);
    // sidor
    fill('#fdf3e3'); rect(bx + 26, by + 26, bw / 2 - 34, bh - 52, 10);
    rect(bx + bw / 2 + 8, by + 26, bw / 2 - 34, bh - 52, 10);
    fillA('#000000', 18); rect(bx + bw / 2 - 5, by + 26, 10, bh - 52, 4);
    // bindning
    fill('#dcc7ab'); rect(bx + 8, by + 26, 12, bh - 52, 5);

    const page = this.read;
    push();
    // vänster sida: text
    fill('#6d6259'); textAlign(LEFT, TOP); textSize(16);
    const texts = [
      'En liten katt gick ut\nnär solen värmde.',
      'Katten hittade en båt\nvid vattnet.',
      'Och seglade hem\ninnan det blev kväll.',
    ];
    text(texts[page], bx + 48, by + 62);
    fillA('#a99a86', 220); textSize(12);
    text('sida ' + (page + 1) + ' av 3', bx + 48, by + bh - 74);

    // höger sida: bild
    const px = bx + bw / 2 + 26, py = by + 40, pw = bw / 2 - 52, ph = bh - 90;
    fill('#dff1fb'); rect(px, py, pw, ph, 10);
    if (page === 0) {
      fill('#f7c948'); ellipse(px + pw - 56, py + 56, 62, 62);
      fill('#a9d9a0'); ellipse(px + pw / 2, py + ph + 20, pw * 1.3, ph * 0.9);
      // katt
      fill('#e8a86a'); ellipse(px + pw / 2, py + ph - 86, 76, 54);
      fill('#e8a86a'); ellipse(px + pw / 2, py + ph - 118, 52, 48);
      triangle(px + pw / 2 - 24, py + ph - 132, px + pw / 2 - 10, py + ph - 154, px + pw / 2 - 4, py + ph - 128);
      triangle(px + pw / 2 + 24, py + ph - 132, px + pw / 2 + 10, py + ph - 154, px + pw / 2 + 4, py + ph - 128);
      fill('#4a3f39'); ellipse(px + pw / 2 - 12, py + ph - 120, 6, 8); ellipse(px + pw / 2 + 12, py + ph - 120, 6, 8);
      fill('#e0707a'); triangle(px + pw / 2 - 4, py + ph - 106, px + pw / 2 + 4, py + ph - 106, px + pw / 2, py + ph - 100);
      stroke('#4a3f39'); strokeWeight(2); noFill();
      line(px + pw / 2 + 26, py + ph - 96, px + pw / 2 + 54, py + ph - 106);
      line(px + pw / 2 + 26, py + ph - 90, px + pw / 2 + 56, py + ph - 92);
      noStroke();
    } else if (page === 1) {
      fill('#a9c7f5'); rect(px, py + ph * 0.55, pw, ph * 0.45);
      fill('#8fb6e8');
      for (let i = 0; i < 3; i++) ellipse(px + 30 + i * 70, py + ph * 0.7 + (i % 2) * 12, 60, 12);
      // båt
      fill('#c98a5a'); beginShape();
      vertex(px + pw / 2 - 70, py + ph * 0.62); vertex(px + pw / 2 + 70, py + ph * 0.62);
      vertex(px + pw / 2 + 46, py + ph * 0.74); vertex(px + pw / 2 - 46, py + ph * 0.74);
      endShape(CLOSE);
      fill('#ffffff'); triangle(px + pw / 2, py + ph * 0.58, px + pw / 2, py + ph * 0.24, px + pw / 2 + 56, py + ph * 0.56);
      fill('#e8a86a'); ellipse(px + pw / 2 - 12, py + ph * 0.56, 30, 22);
      fill('#4a3f39'); ellipse(px + pw / 2 - 18, py + ph * 0.55, 3, 4); ellipse(px + pw / 2 - 6, py + ph * 0.55, 3, 4);
    } else {
      fill('#f7d6a8'); rect(px, py, pw, ph, 10);
      fill('#ef9d6a'); ellipse(px + pw / 2, py + ph * 0.72, pw * 1.2, ph * 0.5);
      fill('#f7c948'); ellipse(px + pw / 2, py + ph * 0.72, 70, 70);
      fill('#8fb6e8'); rect(px, py + ph * 0.78, pw, ph * 0.22);
      fill('#e8a86a'); ellipse(px + pw * 0.32, py + ph * 0.7, 44, 32);
      fill('#e8a86a'); ellipse(px + pw * 0.32, py + ph * 0.6, 30, 28);
      triangle(px + pw * 0.32 - 14, py + ph * 0.57, px + pw * 0.32 - 6, py + ph * 0.45, px + pw * 0.32 - 2, py + ph * 0.57);
      triangle(px + pw * 0.32 + 14, py + ph * 0.57, px + pw * 0.32 + 6, py + ph * 0.45, px + pw * 0.32 + 2, py + ph * 0.57);
      fill('#4a3f39'); ellipse(px + pw * 0.32 - 6, py + ph * 0.6, 4, 5); ellipse(px + pw * 0.32 + 6, py + ph * 0.6, 4, 5);
    }
    pop();

    // bläddra-knapp
    const bwid = 190, bhei = 50;
    const bxx = W / 2 - bwid / 2, byy = by + bh - 62;
    fill('#63bda8'); rect(bxx, byy, bwid, bhei, 25);
    fill('#ffffff'); textAlign(CENTER, CENTER); textSize(15);
    text(page < 2 ? 'NÄSTA SIDA' : 'KLART!', bxx + bwid / 2, byy + bhei / 2);
    G.libNext = { x: bxx, y: byy, w: bwid, h: bhei };
  },

  down(p) {
    if (this.read >= 0) {
      if (G.libNext && inRect(p, G.libNext)) {
        sfx.snip();
        if (this.read < 2) { this.read++; }
        else {
          this.read = -1; this.readDone = true;
          gainStar(1); sfx.good(); toast('Vilken bra bok!', 1500);
          setMood('happy', 2600); sfx.pling(); speak('Vilken bra bok!');
          burst(820, 548, ['#f7c948', '#8fd8c6', '#ffffff'], 16, 1.1);
          addHearts(820, 500, 2);
        }
        G.lastAct = millis();
      }
      return;
    }
    if (this.story && dist(p.x, p.y, 820, 548) < 96) {
      this.read = 0; sfx.pling(); G.lastAct = millis(); return;
    }
    for (const b of this.books) {
      if (b.done) continue;
      if (abs(p.x - b.x) < 40 && abs(p.y - b.y) < 58) {
        this.drag = { id: b.id, x: p.x, y: p.y };
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
    this.drag = null; G.dragAny = false;
    const b = this.books[d.id];
    const inShelf = this.shelves().map(function (s, i) {
      return { i: i, hit: p.x > s.x && p.x < s.x + s.w && p.y > s.y && p.y < s.y + s.h + 40 };
    }).filter(function (s) { return s.hit; })[0];
    if (!inShelf) { sfx.drop(); return; }
    if (inShelf.i !== b.shelf) {
      sfx.bad(); setMood('yuck', 900);
      toast(['Den hör till den röda', 'Den hör till den gröna', 'Den hör till den gula'][b.shelf] + ' hyllan', 1500);
      return;
    }
    b.done = true; b.doneT = 1; this.shelved++;
    gainStar(1); sfx.pop(); sfx.good();
    const sp = this.slotPos(b.shelf);
    burst(sp.x, sp.y - 20, ['#ffffff', b.col], 10, 0.9);
    toast('Rätt hylla!', 1200);
    if (this.books.every(function (x) { return x.done; })) {
      this.story = true; this.sparkle = 1;
      setTimeout(function () { toast('En bok till dig!', 1600); }, 500);
      sfx.sparkle();
    }
  },
};

SCENE_META.push({
  id: 'library', label: 'Biblioteket', icon: 'book',
  desc: 'Sortera och läs', say: 'Sätt böckerna på rätt hylla och läs en bok.',
  steps: ['Dra varje bok till hyllan med samma färg.', 'Tryck på boken som lyser.', 'Bläddra genom sagan.'],
});
DEMOS.library = function () {
  const sc = SCENES.library;
  if (!sc.books) return null;
  const b = sc.books.filter(function (x) { return !x.done; })[0];
  if (!b) return null;
  const s = sc.shelves()[b.shelf];
  return { from: { x: b.x, y: b.y }, to: { x: s.x + s.w / 2, y: s.y + 100 }, r: 34 };
};
HINTS.library = function () {
  const sc = SCENES.library;
  if (!sc.books) return null;
  if (sc.read >= 0) return null;
  if (sc.story && !sc.readDone) return { x: 820, y: 548, r: 70 };
  const b = sc.books.filter(function (x) { return !x.done; })[0];
  return b ? { x: b.x, y: b.y, r: 46 } : null;
};