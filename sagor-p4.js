// SAGOHÖRNAN — saga 4: Marre och brandbilen
SAGOR.push({
  titel: 'Marre och brandbilen', farg: '#ef8064',
  sidor: [
    { text: 'Det ringer på brandstationen. Marre tar på hjälmen.',
      art: function () {
        sagaWall('#e9eef2', 470, '#cfcfd6');
        fill('#d94f4f'); rect(90, 210, 420, 260, 14);
        fill('#b83c3c'); rect(90, 210, 420, 24, 10);
        fill('#f7f2e8'); rect(140, 250, 320, 220, 10);
        fill('#8f9aa2'); for (let i = 0; i < 6; i++) rect(150 + i * 52, 250, 44, 220, 4);
        const on = sin(millis() / 160) > 0;
        fill(on ? '#ffd24d' : '#e8e0c8'); ellipse(560, 250, 54, 54);
        fillA(on ? '#ffd24d' : '#ffffff', 60); ellipse(560, 250, 86, 86);
        fill('#d94f4f'); rect(620, 300, 240, 150, 16);
        fill('#f7f2e8'); rect(640, 320, 200, 40, 8);
        fill('#4a3f39'); ellipse(670, 460, 46, 46); ellipse(810, 460, 46, 46);
        fill('#a8b6bb'); ellipse(670, 460, 20, 20); ellipse(810, 460, 20, 20);
        sagaMarre(220, 610, 0.8, null);
      } },
    { text: 'En katt sitter högt uppe i ett träd.',
      art: function () {
        sagaOutdoor('#cfe6f5', '#eef8ec', 170, 110);
        sagaTree(560, 640, 1.7);
        sagaCat(568, 300, 0.85, true);
        sagaBubble(760, 250, 'mjau!');
        sagaMarre(230, 600, 0.95);
      } },
    { text: 'Marre klättrar upp med stegen. Försiktigt, försiktigt.',
      art: function () {
        sagaOutdoor('#cfe6f5', '#eef8ec', 840, 110);
        sagaTree(620, 650, 1.65);
        sagaCat(628, 300, 0.8, true);
        stroke('#c9d4d8'); strokeWeight(12);
        line(470, 650, 600, 300); line(540, 650, 668, 300);
        strokeWeight(7);
        for (let i = 0; i < 6; i++) line(474 + i * 20, 640 - i * 56, 548 + i * 20, 640 - i * 56);
        noStroke();
        sagaMarre(560, 400, 0.62, null);
      } },
    { text: 'Katten är räddad! Alla applåderar.',
      art: function () {
        sagaOutdoor('#bfe3f2', '#f2fbe8', 790, 120);
        sagaTree(220, 520, 1.0);
        sagaMarre(520, 560, 1.0);
        sagaCat(600, 470, 0.62, true);
        for (let i = 0; i < 8; i++) {
          const a = i * 0.8 + millis() / 900;
          fillA('#f7c948', 210 - i * 12);
          starShape(760 + cos(a) * 90, 300 + sin(a) * 60, 12, 5);
        }
        sagaHeart(430, 300, 16); sagaHeart(610, 280, 12);
      } },
  ],
});