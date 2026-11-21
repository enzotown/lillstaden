// ============================================================
//  LILLA STADEN — gemensamma bilder (ansikten, rum, ikoner)
// ============================================================

function drawRoom(o) {
  // o: {wall, wall2, floor, floorY, tile}
  noStroke();
  fill(o.wall || '#f8e7d6'); rect(0, 0, W, H);
  if (o.wall2) { fillA(o.wall2, 255); rect(0, 0, W, 150); }
  const fy = o.floorY || 470;
  fill(o.floor || '#e8cdb0'); rect(0, fy, W, H - fy);
  strokeA('#000000', 26); strokeWeight(2);
  for (let i = 0; i < 9; i++) {
    const y = fy + 22 + i * 26;
    line(0, y, W, y);
  }
  noStroke();
  // golvskugga längs väggen
  fillA('#000000', 16); rect(0, fy - 6, W, 14);
}

function drawWindow(x, y, w, h, o) {
  o = o || {};
  noStroke();
  fillA('#000000', 20); rect(x + 6, y + 8, w, h, 12);
  fill('#ffffff'); rect(x - 8, y - 8, w + 16, h + 16, 12);
  fill(o.sky || '#bfe3f2'); rect(x, y, w, h, 8);
  fill('#ffffff');
  ellipse(x + w * 0.3, y + h * 0.36, w * 0.36, h * 0.24);
  ellipse(x + w * 0.62, y + h * 0.3, w * 0.28, h * 0.2);
  fill(o.hill || '#a8d8b0');
  ellipse(x + w * 0.25, y + h * 1.02, w * 0.8, h * 0.42);
  ellipse(x + w * 0.8, y + h * 1.06, w * 0.9, h * 0.46);
  stroke('#ffffff'); strokeWeight(6);
  line(x + w / 2, y, x + w / 2, y + h);
  line(x, y + h / 2, x + w, y + h / 2);
  noStroke();
  fill('#ffffff'); rect(x - 12, y + h + 6, w + 24, 10, 5);
}

function drawPlant(x, y, s) {
  push(); translate(x, y); scale(s || 1); noStroke();
  fillA('#000000', 22); ellipse(0, 2, 74, 16);
  fill('#d98f6a'); beginShape();
  vertex(-26, -46); vertex(26, -46); vertex(20, 0); vertex(-20, 0); endShape(CLOSE);
  fill('#e8a887'); rect(-28, -50, 56, 12, 5);
  for (let i = 0; i < 5; i++) {
    push(); rotate(-PI / 2 + (i - 2) * 0.34);
    fill(i % 2 ? '#7fc4a0' : '#93d3b0');
    ellipse(0, -74, 26, 62); pop();
  }
  pop();
}

// ------------------------------------------------------------
//  ansikten
// ------------------------------------------------------------
function drawFace(x, y, r, o) {
  o = o || {};
  const skin = o.skin || '#f6c9a4';
  const hairCol = o.hairCol || '#5a4237';
  const look = o.look || { x: 0, y: 0 };
  push();
  translate(x, y);
  // hals
  noStroke(); fill(shadeCol(skin, -18)); rect(-r * 0.22, r * 0.72, r * 0.44, r * 0.5, r * 0.1);
  // öron
  fill(skin);
  ellipse(-r * 0.98, 0, r * 0.28, r * 0.36);
  ellipse(r * 0.98, 0, r * 0.28, r * 0.36);
  // huvud
  fill(skin); ellipse(0, 0, r * 2, r * 2.06);
  fillA(shadeCol(skin, -12), 120); ellipse(0, r * 0.52, r * 1.5, r * 0.7);
  // kinder
  fillA(o.blushCol || '#f08a90', 110);
  ellipse(-r * 0.6, r * 0.24, r * 0.42, r * 0.26);
  ellipse(r * 0.6, r * 0.24, r * 0.42, r * 0.26);
  // fräknar
  if (o.freckles) {
    fillA('#c98a5e', 190);
    for (let i = 0; i < 6; i++) {
      ellipse(-r * 0.42 + (i % 3) * r * 0.16, r * 0.12 + floor(i / 3) * r * 0.1, r * 0.05, r * 0.05);
      ellipse(r * 0.24 + (i % 3) * r * 0.16, r * 0.12 + floor(i / 3) * r * 0.1, r * 0.05, r * 0.05);
    }
  }
  // ögon
  const eyeY = -r * 0.16, eyeX = r * 0.38;
  if (o.eyes === 'closed' || o.eyes === 'happy') {
    noFill(); stroke('#4a3f39'); strokeWeight(max(2, r * 0.055));
    if (o.eyes === 'happy') {
      arc(-eyeX, eyeY, r * 0.34, r * 0.26, PI * 1.12, PI * 1.88);
      arc(eyeX, eyeY, r * 0.34, r * 0.26, PI * 1.12, PI * 1.88);
    } else {
      arc(-eyeX, eyeY, r * 0.32, r * 0.2, PI * 0.1, PI * 0.9);
      arc(eyeX, eyeY, r * 0.32, r * 0.2, PI * 0.1, PI * 0.9);
    }
    noStroke();
  } else {
    fill('#ffffff'); ellipse(-eyeX, eyeY, r * 0.4, r * 0.44); ellipse(eyeX, eyeY, r * 0.4, r * 0.44);
    fill(o.iris || '#6b4a33');
    ellipse(-eyeX + look.x * r * 0.06, eyeY + look.y * r * 0.06, r * 0.23, r * 0.26);
    ellipse(eyeX + look.x * r * 0.06, eyeY + look.y * r * 0.06, r * 0.23, r * 0.26);
    fill('#2f2723');
    ellipse(-eyeX + look.x * r * 0.06, eyeY + look.y * r * 0.06, r * 0.11, r * 0.13);
    ellipse(eyeX + look.x * r * 0.06, eyeY + look.y * r * 0.06, r * 0.11, r * 0.13);
    fillA('#ffffff', 235);
    ellipse(-eyeX - r * 0.06, eyeY - r * 0.08, r * 0.07, r * 0.07);
    ellipse(eyeX - r * 0.06, eyeY - r * 0.08, r * 0.07, r * 0.07);
  }
  // bryn
  if (o.brows !== false) {
    stroke(shadeCol(hairCol, -10)); strokeWeight(max(2, r * 0.05)); noFill();
    const lift = o.browLift || 0;
    arc(-eyeX, eyeY - r * 0.28 - lift, r * 0.34, r * 0.18, PI * 1.12, PI * 1.88);
    arc(eyeX, eyeY - r * 0.28 - lift, r * 0.34, r * 0.18, PI * 1.12, PI * 1.88);
    noStroke();
  }
  // näsa
  if (o.nose !== false) {
    fillA(shadeCol(skin, -22), 170);
    ellipse(0, r * 0.08, r * 0.14, r * 0.1);
  }
  // mun
  const mo = o.mouth || 'smile';
  if (mo === 'open') {
    const open = o.open === undefined ? 0.5 : o.open;
    const mw = r * 0.62, mh = r * (0.24 + open * 0.6);
    fill('#7d3f3f'); ellipse(0, r * 0.46 + mh * 0.1, mw, mh);
    fill('#ed8f96'); ellipse(0, r * 0.46 + mh * 0.34, mw * 1.02, mh * 0.42);
    fill('#ffffff');
    const teeth = o.teeth === undefined ? 6 : o.teeth;
    for (let i = 0; i < teeth; i++) {
      const tw = (mw * 0.94) / teeth;
      rect(-mw * 0.47 + i * tw + 1, r * 0.46 - mh * 0.42, tw - 2, mh * 0.2, 2);
    }
    strokeA('#ffffff', 90); strokeWeight(2); noFill();
    ellipse(0, r * 0.46 + mh * 0.1, mw, mh); noStroke();
  } else if (mo === 'o') {
    fill('#7d3f3f'); ellipse(0, r * 0.46, r * 0.22, r * 0.26);
  } else if (mo === 'small') {
    noFill(); stroke('#4a3f39'); strokeWeight(max(2, r * 0.05));
    arc(0, r * 0.36, r * 0.3, r * 0.2, PI * 0.15, PI * 0.85); noStroke();
  } else {
    fill('#7d3f3f');
    arc(0, r * 0.34, r * 0.54, r * 0.4, 0, PI);
    fill('#ffffff'); rect(-r * 0.2, r * 0.34, r * 0.4, r * 0.06, 2);
    fillA('#e9828b', 200); ellipse(0, r * 0.44, r * 0.2, r * 0.1);
  }
  // hår
  drawHair(r, o.hair || 'short', hairCol, o.hairLen === undefined ? 1 : o.hairLen, o.hairCol2);
  pop();
}

function drawHair(r, style, col, len, col2) {
  push();
  noStroke();
  const dark = shadeCol(col, -22);
  if (style === 'bun') {
    fill(col); ellipse(0, -r * 0.62, r * 1.92, r * 1.2);
    fill(col); ellipse(0, -r * 1.34, r * 0.7, r * 0.62);
    fill(dark); ellipse(0, -r * 1.34, r * 0.28, r * 0.24);
    fill(col); ellipse(-r * 0.86, -r * 0.1, r * 0.3, r * 0.62);
    ellipse(r * 0.86, -r * 0.1, r * 0.3, r * 0.62);
  } else if (style === 'long') {
    fill(col);
    ellipse(0, -r * 0.58, r * 2.0, r * 1.26);
    rect(-r * 1.0, -r * 0.6, r * 0.42, r * (0.9 + len * 0.5), r * 0.2);
    rect(r * 0.58, -r * 0.6, r * 0.42, r * (0.9 + len * 0.5), r * 0.2);
    fill(col2 || dark); ellipse(0, -r * 0.42, r * 1.5, r * 0.6);
  } else if (style === 'curly') {
    fill(col);
    for (let i = 0; i < 9; i++) {
      const a = PI + (i / 8) * PI;
      ellipse(cos(a) * r * 0.82, sin(a) * r * 0.7 - r * 0.12, r * 0.62, r * 0.62);
    }
    ellipse(0, -r * 0.7, r * 1.72, r * 0.86);
  } else if (style === 'pigtails') {
    fill(col);
    ellipse(0, -r * 0.6, r * 1.9, r * 1.16);
    ellipse(-r * 1.16, -r * 0.28, r * 0.62, r * 0.66);
    ellipse(r * 1.16, -r * 0.28, r * 0.62, r * 0.66);
    fill(col2 || '#f7c948'); ellipse(-r * 0.92, -r * 0.5, r * 0.16, r * 0.16); ellipse(r * 0.92, -r * 0.5, r * 0.16, r * 0.16);
  } else if (style === 'bald') {
    // inget hår
  } else if (style === 'cap') {
    fill(col); ellipse(0, -r * 0.58, r * 1.9, r * 1.1);
    fill('#ef8064'); arc(0, -r * 0.72, r * 1.9, r * 1.05, PI, TAU);
    fill('#d96b50'); rect(-r * 0.98, -r * 0.74, r * 1.96, r * 0.14, r * 0.06);
  } else {
    fill(col); ellipse(0, -r * 0.56, r * 1.94, r * 1.2);
    fill(dark); ellipse(0, -r * 0.2, r * 0.34, r * 0.18);
  }
  pop();
}

// ------------------------------------------------------------
//  verktygsbricka — samma höjd och samma kant överallt
// ------------------------------------------------------------
const TRAY_Y = 544, TRAY_H = 104;
function drawToolTray(x, w, tint) {
  fillA('#000000', 16); rect(x + 2, TRAY_Y + 4, w, TRAY_H, 20);
  fill('#ffffff'); rect(x, TRAY_Y, w, TRAY_H, 20);
  fillA(tint || '#eef7f3', 255); rect(x + 6, TRAY_Y + 6, w - 12, TRAY_H - 12, 15);
  // mjuk innerkant så brickan känns rundad
  noFill(); strokeA('#000000', 12); strokeWeight(2);
  rect(x + 6, TRAY_Y + 6, w - 12, TRAY_H - 12, 15); noStroke();
}

// mjuk ring som visar var man kan släppa
function hoverRing(x, y, r) {
  noFill();
  fillA('#63bda8', 26); ellipse(x, y, r * 2 - 4, r * 2 - 4);
  noFill(); strokeA('#63bda8', 210); strokeWeight(4);
  ellipse(x, y, r * 2, r * 2);
  noStroke();
}

function shadeCol(hexStr, amt) {
  const c = color(hexStr);
  const r = constrain(c.levels[0] + amt, 0, 255);
  const g = constrain(c.levels[1] + amt, 0, 255);
  const b = constrain(c.levels[2] + amt, 0, 255);
  return '#' + hex(r, 2) + hex(g, 2) + hex(b, 2);
}

// ------------------------------------------------------------
//  ikoner (används i meny, intro, hjälpkort)
// ------------------------------------------------------------
function drawIcon(kind, x, y, col, sc) {
  push(); translate(x, y); scale(sc || 1);
  const c = col || '#4a3f39';
  noStroke();
  if (kind === 'tooth') {
    fill('#ffffff'); stroke(c); strokeWeight(2.4);
    beginShape();
    vertex(-17, -20); vertex(-6, -25); vertex(6, -25); vertex(17, -20);
    vertex(15, 2); vertex(10, 22); vertex(2, 13); vertex(-2, 13); vertex(-10, 22); vertex(-15, 2);
    endShape(CLOSE);
    noStroke(); fill(c); ellipse(-6, -10, 4, 4); ellipse(6, -10, 4, 4);
    fillA(c, 120); arc(0, -2, 16, 12, 0, PI);
  } else if (kind === 'scissors') {
    push(); rotate(-0.28);
    noStroke();
    fill('#c9d4d8');
    beginShape(); vertex(-2, -6); vertex(-11, -20); vertex(-4, -22); vertex(3, -6); endShape(CLOSE);
    beginShape(); vertex(2, -6); vertex(11, -20); vertex(4, -22); vertex(-3, -6); endShape(CLOSE);
    fill('#eef4f6'); rect(-1.6, -22, 3.2, 18, 1.5);
    fill('#f2a0b4'); ellipse(-8, 12, 15, 15); ellipse(8, 12, 15, 15);
    fill('#ffffff'); ellipse(-8, 12, 7, 7); ellipse(8, 12, 7, 7);
    fill('#5f8e9c'); ellipse(0, 0, 5, 5);
    pop();
  } else if (kind === 'heart') {
    fill(c); heartShape(0, 1, 17);
  } else if (kind === 'pencil') {
    fill('#f7c948'); rect(-7, -19, 14, 28, 3);
    fill(c); triangle(-7, 9, 7, 9, 0, 22);
    fill('#f2a0b4'); rect(-7, -19, 14, 7, 3);
  } else if (kind === 'block') {
    fill('#8fd8c6'); rect(-19, 4, 38, 16, 5);
    fill('#f7c948'); rect(-13, -10, 30, 15, 5);
    fill('#ef8064'); rect(-7, -23, 22, 14, 5);
    fillA('#ffffff', 150); rect(-19, 4, 38, 5, 2); rect(-13, -10, 30, 5, 2); rect(-7, -23, 22, 5, 2);
  } else if (kind === 'paw') {
    fill(c); ellipse(0, 5, 24, 20);
    ellipse(-11, -8, 8, 10); ellipse(-4, -13, 8, 10);
    ellipse(4, -13, 8, 10); ellipse(11, -8, 8, 10);
  } else if (kind === 'star') {
    fill(c); starShape(0, 0, 20, 9);
  } else if (kind === 'bread') {
    fill('#e8b168'); ellipse(0, 2, 40, 28);
    fill('#c9873f'); ellipse(0, 8, 40, 14);
    fillA('#fff3d8', 200); ellipse(-8, -4, 14, 7);
    fill('#a5642f');
    for (let i = -1; i <= 1; i++) { push(); translate(i * 10, -2); rotate(0.5); rect(-1.6, -7, 3.2, 12, 1.6); pop(); }
  } else if (kind === 'bus') {
    fill('#f7c948'); rect(-22, -14, 44, 26, 6);
    fill('#ffffff'); rect(-16, -9, 12, 9, 2); rect(-2, -9, 12, 9, 2);
    fill(c); rect(-22, 4, 44, 4, 2);
    fill('#4a3f39'); ellipse(-12, 14, 10, 10); ellipse(12, 14, 10, 10);
    fill('#a9c7f5'); rect(16, -14, 6, 10, 2);
  } else if (kind === 'pizza') {
    fill('#e8b168'); triangle(-22, 14, 22, 14, 0, -22);
    fill('#f6cf90'); triangle(-16, 11, 16, 11, 0, -15);
    fill('#cf5f45'); ellipse(0, 3, 20, 10);
    fill('#f8d98a'); ellipse(-5, 6, 7, 5); ellipse(6, 7, 8, 5); ellipse(0, -4, 6, 5);
    fill('#8fbf8f'); ellipse(-6, -6, 6, 5);
    fill('#d8a463'); rect(-24, 12, 48, 7, 3);
  } else if (kind === 'tree') {
    fill('#8f6a44'); rect(-4, -2, 8, 24, 3);
    fill('#7fbf8f'); ellipse(0, -8, 34, 30); ellipse(-11, 2, 20, 18); ellipse(11, 2, 20, 18);
    fillA('#ffffff', 60); ellipse(-6, -16, 12, 8);
  } else if (kind === 'fish') {
    fill('#f2a15f'); ellipse(0, 0, 40, 26);
    triangle(-18, 0, -32, -13, -32, 13);
    fill('#e08a45'); ellipse(-4, 6, 30, 10);
    fill('#ffffff'); ellipse(8, -5, 10, 9);
    fill('#3a332e'); ellipse(9, -5, 5, 5);
    fillA('#ffffff', 220); ellipse(7, -7, 2, 2);
    fillA('#ffffff', 120); ellipse(0, -8, 16, 5);
  } else if (kind === 'cow') {
    // koansikte
    fill('#fdfaf3'); ellipse(0, 2, 44, 40);
    fill('#4a3f39'); ellipse(-14, -8, 16, 13); ellipse(10, 6, 12, 9);
    fill('#fdfaf3'); ellipse(0, 6, 30, 22);
    fill('#f2b3b8'); ellipse(-19, -14, 12, 9); ellipse(19, -14, 12, 9);
    fill('#f6c9c4'); ellipse(0, 16, 22, 14);
    fill('#d98f92'); ellipse(-4, 15, 3, 3); ellipse(4, 15, 3, 3);
    fill('#3a332e'); ellipse(-9, -2, 5, 6); ellipse(9, -2, 5, 6);
    fillA('#ffffff', 220); ellipse(-10, -4, 2, 2); ellipse(8, -4, 2, 2);
  } else if (kind === 'flame') {
    fill('#f7a03c');
    beginShape();
    vertex(0, -26); bezierVertex(16, -12, 20, 0, 16, 8);
    bezierVertex(12, 20, 4, 24, 0, 24);
    bezierVertex(-4, 24, -12, 20, -16, 8);
    bezierVertex(-20, 0, -12, -10, 0, -26);
    endShape(CLOSE);
    fill('#f7c948');
    beginShape();
    vertex(1, -6); bezierVertex(9, 2, 8, 12, 0, 16);
    bezierVertex(-8, 12, -7, 3, 1, -6);
    endShape(CLOSE);
    fillA('#ffffff', 120); ellipse(-6, 6, 6, 10);
  } else if (kind === 'house') {
    fillA('#000000', 16); rect(-22, 14, 46, 12, 5);
    fill('#f6cf90'); rect(-22, -8, 44, 30, 4);
    fill('#ef8064'); triangle(-29, -6, 29, -6, 0, -31);
    fill('#8b5a34'); rect(-7, 6, 14, 22, 3);
    fill('#a9c7f5'); rect(-17, 0, 11, 11, 2); rect(6, 0, 11, 11, 2);
    fillA('#ffffff', 110); rect(-22, -8, 44, 5, 2);
  } else if (kind === 'count') {
    fill('#c98a5a'); rect(-22, -22, 44, 6, 3); rect(-22, 0, 44, 6, 3); rect(-22, 22, 44, 6, 3);
    fill('#8b5a34'); rect(-19, -25, 5, 46, 2); rect(14, -25, 5, 46, 2);
    fill('#f2a0b4'); ellipse(-8, -19, 12, 12); ellipse(4, -19, 12, 12);
    fill('#8fd8c6'); ellipse(-12, 3, 12, 12); ellipse(2, 3, 12, 12); ellipse(9, 3, 12, 12);
    fill('#f7c948'); ellipse(-6, 25, 12, 12); ellipse(6, 25, 12, 12);
  } else if (kind === 'book') {
    fill('#8fd8c6'); rect(-20, -16, 38, 32, 4);
    fill('#ffffff'); rect(-14, -12, 30, 24, 3);
    fill('#f7c948'); rect(-19, -16, 5, 32, 2);
    fillA('#a9c7f5', 180); rect(-9, -7, 18, 3, 1.5); rect(-9, 0, 18, 3, 1.5); rect(-9, 7, 12, 3, 1.5);
  }
  pop();
}