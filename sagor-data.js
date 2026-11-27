// ============================================================
//  SAGOHÖRNAN — rithjälpare och sagor (del 1)
// ============================================================

function sagaWall(wall, floorY, floor) {
  noStroke(); fill(wall || '#f8e7d6'); rect(0, 0, W, H);
  fillA('#000000', 8); rect(0, 0, W, 90);
  fill(floor || '#e3c49f'); rect(0, floorY || 470, W, H - (floorY || 470));
  fillA('#000000', 16); rect(0, (floorY || 470) - 8, W, 12);
}
function sagaOutdoor(top, bottom, sunX, sunY) {
  noStroke();
  for (let i = 0; i < 26; i++) {
    fill(lerpColor(color(top || '#bfe3f2'), color(bottom || '#e8f6e6'), i / 25));
    rect(0, i * 19, W, 20);
  }
  if (sunX !== null && sunX !== undefined) {
    fillA('#f7c948', 55); ellipse(sunX, sunY, 150, 150);
    fill('#f7c948'); ellipse(sunX, sunY, 96, 96);
  }
  fill('#a8d8b0'); ellipse(200, 510, 780, 300);
  fill('#8ecf9c'); ellipse(830, 530, 820, 330);
  fill('#7fc48e'); rect(0, 540, W, 160);
}
function sagaNight() {
  noStroke();
  for (let i = 0; i < 26; i++) {
    fill(lerpColor(color('#233252'), color('#5b5680'), i / 25));
    rect(0, i * 19, W, 20);
  }
  for (let i = 0; i < 30; i++) {
    const x = (i * 173) % W, y = 30 + (i * 97) % 380;
    fillA('#fff8d8', 140 + 90 * sin(millis() / 700 + i)); ellipse(x, y, 5, 5);
  }
  fillA('#fff8d8', 55); ellipse(800, 130, 150, 150);
  fill('#fff8d8'); ellipse(800, 130, 100, 100);
  fill('#233252'); ellipse(834, 108, 92, 92);
}
function sagaTree(x, y, s) {
  push(); translate(x, y); scale(s || 1);
  noStroke(); fill('#9a6b45'); rect(-15, -80, 30, 110, 9);
  fill('#7fbf8f'); ellipse(0, -140, 200, 160); ellipse(-82, -100, 130, 120); ellipse(82, -100, 130, 120);
  fillA('#ffffff', 40); ellipse(-30, -170, 70, 42);
  pop();
}
function sagaCat(x, y, s, awake) {
  push(); translate(x, y); scale(s || 1);
  noStroke();
  fillA('#000000', 20); ellipse(0, 26, 116, 18);
  fill('#c9b8a6'); ellipse(0, 6, 100, 54);
  fill('#d8c9b8'); ellipse(2, -4, 68, 30);
  fill('#c9b8a6'); ellipse(-40, 2, 46, 42);
  triangle(-58, -10, -50, -34, -36, -8);
  triangle(-28, -8, -20, -32, -14, -6);
  if (awake) {
    fill('#ffffff'); ellipse(-50, 2, 14, 14); ellipse(-30, 2, 14, 14);
    fill('#4a3f39'); ellipse(-50, 2, 7, 9); ellipse(-30, 2, 7, 9);
  } else {
    stroke('#6b5b4c'); strokeWeight(2.6); noFill();
    arc(-50, 2, 14, 9, PI * 0.1, PI * 0.9); arc(-30, 2, 14, 9, PI * 0.1, PI * 0.9);
    noStroke();
  }
  fill('#f2a0b4'); ellipse(-40, 12, 8, 6);
  fill('#ffffff'); triangle(-54, 12, -46, 12, -50, 17); triangle(-34, 12, -26, 12, -30, 17);
  noFill(); stroke('#c9b8a6'); strokeWeight(9);
  arc(44, 2, 52, 48, -PI * 0.6, PI * 0.7); noStroke();
  if (!awake) {
    fillA('#8fa8bd', 210); textAlign(LEFT, CENTER); textSize(20);
    text('z', 8, -48 - (millis() / 90 % 22));
    textSize(13); text('z', 28, -70 - (millis() / 120 % 18));
  }
  pop();
}
function sagaMarre(x, y, s, hat) {
  drawMascot(x, y, s || 1, millis() / 1000, { hat: hat === undefined ? 'cap' : hat });
}
function sagaDuck(x, y, s, flip) {
  push(); translate(x, y); scale((s || 1) * (flip ? -1 : 1));
  noStroke();
  fillA('#ffffff', 24); ellipse(0, 16, 66, 14);
  fill('#f7c948'); ellipse(0, 0, 62, 40);
  fill('#ffe08a'); ellipse(-6, -4, 42, 24);
  fill('#f7c948'); ellipse(-26, -16, 28, 26);
  fill('#ef9c3c'); triangle(-38, -14, -58, -7, -38, -4);
  fill('#4a3f39'); ellipse(-31, -20, 5, 5);
  fillA('#ef9c3c', 200); ellipse(10, 4, 24, 10);
  pop();
}
function sagaBubble(x, y, txt) {
  noStroke();
  fillA('#ffffff', 240); ellipse(x, y, 118, 82);
  triangle(x - 26, y + 30, x + 4, y + 30, x - 34, y + 66);
  fill('#4a3f39'); textAlign(CENTER, CENTER); textSize(17);
  text(txt, x, y - 2);
}
function sagaHeart(x, y, s, col) {
  fill(col || '#f2a0b4'); heartShape(x, y, s || 16);
}

// --- sagorna --------------------------------------------------
const SAGOR = [];
SAGOR.push({
  titel: 'Marre och katten', farg: '#f2a0b4',
  sidor: [
    { text: 'Marre hör ett litet jamande i köket.',
      art: function (t) {
        sagaWall('#f8e7d6', 470, '#e3c49f');
        drawWindow(640, 140, 220, 170, { sky: '#b9d9ea' });
        fill('#c98a5a'); rect(110, 330, 400, 150, 16);
        fill('#e0a96d'); rect(110, 322, 400, 20, 10);
        fill('#8a9aa0'); rect(180, 236, 118, 80, 10);
        fill('#5f6d72'); rect(194, 250, 90, 52, 6);
        fill('#b9c6ca'); rect(520, 380, 96, 96, 12);
        fill('#93a2a7'); ellipse(568, 380, 96, 22);
        fill('#7d8b90'); rect(520, 420, 96, 8);
        sagaBubble(600, 270, 'jam!');
        sagaMarre(790, 552, 1.1);
      } },
    { text: 'Bakom tunnan sitter en liten katt. Den är rädd.',
      art: function (t) {
        sagaWall('#f2e3d2', 460, '#dfc099');
        fillA('#ffe9b8', 150); ellipse(520, 120, 540, 250);
        fill('#b9c6ca'); rect(400, 230, 270, 250, 14);
        fill('#93a2a7'); ellipse(535, 230, 270, 42);
        fill('#7d8b90'); rect(400, 282, 270, 15);
        fillA('#000000', 18); ellipse(535, 486, 310, 38);
        sagaBubble(760, 300, 'mjau');
        sagaCat(740, 424, 1, true);
        sagaMarre(210, 520, 1.02);
      } },
    { text: 'Marre hämtar mjölk och en mjuk filt.',
      art: function (t) {
        sagaWall('#f8e7d6', 470, '#e3c49f');
        for (let i = 0; i < 6; i++) { fillA('#efdcc8', 150); rect(110 + i * 136, 70, 22, 400); }
        fill('#ffffff'); ellipse(360, 578, 150, 50);
        fill('#e8eef1'); ellipse(360, 562, 132, 40);
        fill('#ffffff'); ellipse(360, 552, 104, 24);
        fillA('#cfe2ea', 210); ellipse(360, 552, 74, 15);
        fill('#a9c7f5'); rect(640, 468, 230, 112, 22);
        fillA('#ffffff', 110); rect(654, 482, 74, 18, 9); rect(654, 512, 120, 14, 7);
        sagaCat(680, 410, 0.9, true);
        sagaMarre(190, 520, 1.05);
      } },
    { text: 'Katten kurrar och somnar. God natt, katten!',
      art: function (t) {
        sagaNight();
        fill('#5b4a63'); rect(0, 500, W, 200);
        fill('#6b5a72'); rect(70, 260, 350, 240, 16);
        fillA('#f7c948', 95); rect(96, 288, 296, 186, 10);
        fill('#4a3f63'); rect(720, 200, 210, 170, 12);
        fill('#233252'); rect(732, 212, 186, 146, 8);
        fill('#fff8d8'); ellipse(830, 250, 42, 42);
        fill('#a9c7f5'); ellipse(300, 520, 250, 54);
        fillA('#ffffff', 120); ellipse(274, 514, 120, 16);
        sagaCat(320, 486, 1.2, false);
      } },
  ],
});
SAGOR.push({
  titel: 'Marre bakar', farg: '#f7c948',
  sidor: [
    { text: 'Marre vill baka en kaka. Han letar i skåpen.',
      art: function (t) {
        sagaWall('#fdf1e2', 470, '#e3c49f');
        fill('#c98a5a'); rect(120, 150, 560, 300, 16);
        fill('#e0a96d'); rect(140, 178, 240, 250, 10);
        fill('#f6e3c4'); rect(152, 196, 216, 214, 8);
        fill('#ffffff'); ellipse(260, 300, 120, 110);
        fill('#e8d8c4'); ellipse(260, 288, 100, 88);
        fill('#f6e3c4'); rect(420, 196, 150, 150, 8);
        fill('#ffffff'); rect(440, 224, 46, 96, 8);
        fill('#d8c0a4'); rect(440, 260, 46, 24, 4);
        fill('#f7c948'); ellipse(536, 280, 54, 54);
        sagaMarre(790, 548, 1.05);
      } },
    { text: 'Mjöl, socker och ägg. Nu rör han om i bunken.',
      art: function (t) {
        sagaWall('#fdf1e2', 470, '#e3c49f');
        fill('#c98a5a'); rect(90, 360, 820, 150, 16);
        fill('#e0a96d'); rect(90, 350, 820, 22, 11);
        fill('#ffffff'); ellipse(420, 330, 210, 130);
        fill('#f1e6d8'); ellipse(420, 322, 210, 118);
        fill('#f6e3c4'); ellipse(420, 316, 180, 94);
        fill('#ffffff'); ellipse(640, 340, 96, 74);
        fill('#fdf1dc'); ellipse(640, 334, 84, 62);
        fill('#f7c948'); ellipse(740, 344, 40, 40);
        fill('#ffffff'); ellipse(820, 344, 34, 44);
        fill('#f7c948'); ellipse(820, 344, 20, 24);
        fill('#a9c7f5'); rect(160, 300, 70, 50, 8);
        fill('#ffffff'); rect(166, 292, 58, 12, 6);
        sagaMarre(210, 540, 0.95);
      } },
    { text: 'Kakan åker in i ugnen. Det doftar varmt och gott!',
      art: function (t) {
        sagaWall('#f6e2cb', 490, '#dfc099');
        fill('#8a9aa0'); rect(220, 210, 560, 280, 18);
        fill('#a8b6bb'); rect(236, 226, 528, 248, 14);
        fill('#38464b'); rect(270, 262, 460, 176, 12);
        const g = 0.55 + 0.25 * sin(millis() / 200);
        fillA('#ff9d4d', 200 * g); rect(278, 270, 444, 160, 10);
        fillA('#ffd27a', 120 * g); ellipse(500, 350, 300, 110);
        fill('#c9873f'); ellipse(500, 360, 190, 62);
        fill('#e8b168'); ellipse(500, 348, 170, 52);
        strokeA('#ffffff', 120); strokeWeight(3); line(300, 240, 760, 240); noStroke();
        fill('#e8c877'); ellipse(320, 232, 18, 18); ellipse(360, 232, 18, 18);
        sagaMarre(830, 600, 0.85);
      } },
    { text: 'Kakan är klar. Marre bjuder alla på fika.',
      art: function (t) {
        sagaWall('#fdf3e7', 470, '#e3c49f');
        fill('#f2a0b4'); rect(0, 0, W, 96);
        fill('#ffffff'); ellipse(500, 470, 470, 70);
        fill('#e8eef1'); ellipse(500, 458, 430, 52);
        fill('#c9873f'); rect(370, 330, 260, 120, 18);
        fill('#e8b168'); rect(370, 316, 260, 40, 14);
        fill('#f6cf90'); rect(370, 306, 260, 22, 10);
        fill('#f2a0b4'); for (let i = 0; i < 4; i++) ellipse(400 + i * 62, 316, 26, 16);
        fillA('#ffffff', 170); ellipse(420, 312, 40, 12);
        fill('#ffffff'); ellipse(250, 452, 90, 34); ellipse(750, 452, 90, 34);
        fill('#c9873f'); ellipse(250, 442, 70, 20); ellipse(750, 442, 70, 20);
        sagaMarre(160, 540, 0.95);
        sagaCat(860, 560, 0.85, true);
        sagaHeart(300, 300, 12); sagaHeart(700, 280, 15);
      } },
  ],
});