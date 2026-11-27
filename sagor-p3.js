// SAGOHÖRNAN — saga 3: Marre i parken
SAGOR.push({
  titel: 'Marre i parken', farg: '#8fd8c6',
  sidor: [
    { text: 'Marre går till parken med sin röda boll.',
      art: function () {
        sagaOutdoor('#bfe3f2', '#e8f6e6', 810, 130);
        sagaTree(200, 520, 1.15);
        sagaTree(720, 500, 0.85);
        fill('#ffffff'); ellipse(300, 120, 90, 40); ellipse(350, 110, 70, 34);
        fill('#ef8064'); ellipse(650, 480, 62, 62);
        fillA('#ffffff', 170); ellipse(630, 462, 18, 12);
        sagaMarre(440, 540, 1.05);
      } },
    { text: 'Han kastar bollen högt upp i luften.',
      art: function () {
        sagaOutdoor('#a9d8ef', '#eaf7ea', 180, 110);
        sagaTree(820, 540, 1.2);
        const bob = sin(millis() / 300) * 6;
        fill('#ef8064'); ellipse(520, 150 + bob, 66, 66);
        fillA('#ffffff', 180); ellipse(500, 132 + bob, 20, 14);
        strokeA('#ffffff', 110); strokeWeight(5); noFill();
        arc(520, 240, 100, 80, PI * 1.05, PI * 1.95); noStroke();
        sagaMarre(500, 580, 1.0, null);
      } },
    { text: 'Bollen landar i dammen. Plums!',
      art: function () {
        sagaOutdoor('#bfe3f2', '#e8f6e6', 840, 100);
        sagaTree(150, 500, 0.95);
        fill('#a9cfe0'); ellipse(520, 610, 800, 250);
        fillA('#ffffff', 150); ellipse(560, 520, 260, 60);
        fill('#ef8064'); ellipse(560, 520, 54, 54);
        fillA('#ffffff', 120); noFill(); strokeA('#ffffff', 160); strokeWeight(4);
        ellipse(560, 524, 150, 46); ellipse(560, 524, 230, 70); noStroke();
        sagaDuck(300, 520, 0.9, false);
        sagaDuck(820, 500, 0.8, true);
        sagaMarre(160, 600, 0.85);
      } },
    { text: 'Ankorna puttar bollen tillbaka. Alla är glada!',
      art: function () {
        sagaOutdoor('#bfe3f2', '#f2fbe8', 780, 120);
        sagaTree(200, 520, 1.0);
        fill('#a9cfe0'); ellipse(760, 620, 560, 220);
        fill('#ef8064'); ellipse(700, 600, 52, 52);
        sagaDuck(620, 606, 0.9, true);
        sagaDuck(780, 620, 0.85, true);
        sagaHeart(360, 280, 16); sagaHeart(430, 240, 11);
        fill('#ef8064'); ellipse(460, 520, 56, 56);
        sagaMarre(360, 580, 1.0);
      } },
  ],
});