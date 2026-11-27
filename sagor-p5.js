// SAGOHÖRNAN — saga 5: Marre sover borta
SAGOR.push({
  titel: 'Marre sover borta', farg: '#b79ce0',
  sidor: [
    { text: 'Marre ska sova hos mormor. Han packar sin väska.',
      art: function () {
        sagaWall('#f6e8f2', 470, '#e0c8b4');
        fill('#c98a5a'); rect(620, 150, 260, 300, 14);
        fill('#e0a96d'); rect(636, 172, 228, 120, 10);
        fill('#a9c7f5'); rect(210, 380, 260, 150, 18);
        fill('#8fb0e0'); rect(210, 380, 260, 30, 12);
        fill('#7d9ccb'); rect(330, 360, 30, 40, 8);
        fill('#ffffff'); rect(250, 300, 20, 80, 8);
        fill('#8fd8c6'); rect(250, 300, 20, 24, 8);
        fill('#c9873f'); ellipse(410, 330, 70, 70);
        fill('#e8b168'); ellipse(392, 310, 30, 26); ellipse(428, 310, 30, 26);
        fill('#4a3f39'); ellipse(400, 330, 6, 6); ellipse(422, 330, 6, 6);
        sagaMarre(730, 570, 0.9);
      } },
    { text: 'Mormor öppnar dörren och ger Marre en stor kram.',
      art: function () {
        sagaOutdoor('#f7d9c4', '#f6e6d2', 170, 120);
        fill('#e8d8c4'); rect(300, 180, 400, 400, 14);
        fill('#f2e6d8'); rect(300, 180, 400, 40, 10);
        fill('#c9873f'); rect(430, 330, 140, 250, 10);
        fill('#e8c877'); ellipse(548, 460, 16, 16);
        fill('#f2a0b4'); rect(320, 250, 90, 70, 8);
        fill('#b79ce0'); rect(590, 250, 90, 70, 8);
        fill('#b79ce0'); ellipse(760, 470, 150, 170);
        fill('#f3e1cf'); ellipse(760, 380, 110, 110);
        fill('#d8d2e8'); ellipse(760, 340, 100, 50);
        fill('#4a3f39'); ellipse(738, 378, 9, 11); ellipse(782, 378, 9, 11);
        fill('#f2a0b4'); ellipse(760, 404, 26, 14);
        sagaHeart(660, 300, 16);
        sagaMarre(560, 600, 0.6);
      } },
    { text: 'Mormor läser en bok. Marre lyssnar och gäspar.',
      art: function (t) {
        sagaWall('#f3e6d6', 470, '#dcc0a0');
        fill('#c98a5a'); rect(120, 250, 300, 220, 12);
        fill('#f6e3c4'); rect(140, 270, 260, 160, 8);
        fill('#f2a0b4'); rect(140, 330, 260, 40, 4);
        fill('#ffffff'); rect(560, 300, 330, 200, 16);
        fill('#e8eef1'); rect(574, 314, 302, 172, 10);
        fill('#a9c7f5'); rect(600, 330, 240, 60, 8);
        fill('#ffffff'); ellipse(650, 470, 90, 40); ellipse(790, 470, 90, 40);
        fillA('#f7c948', 70); ellipse(700, 210, 260, 130);
        fill('#8a6a54'); textAlign(CENTER, CENTER); textSize(18);
        text('... och så levde de lyckliga.', 720, 400);
        sagaCat(420, 300, 0.8, true);
      } },
    { text: 'Marre blundar. Stjärnorna lyser utanför fönstret.',
      art: function () {
        sagaNight();
        fill('#5b4a63'); rect(0, 520, W, 180);
        fill('#7d6a86'); rect(160, 330, 520, 190, 16);
        fill('#f2e6f6'); rect(180, 350, 480, 60, 12);
        fill('#e8dcf2'); rect(190, 410, 460, 90, 12);
        fill('#f3e1cf'); ellipse(300, 410, 110, 80);
        fill('#4a3f39'); arc(300, 400, 30, 16, PI, TAU);
        fill('#7bcbb6'); ellipse(600, 420, 130, 60);
        fill('#f3e1cf'); ellipse(646, 404, 66, 56);
        fill('#4a3f39'); arc(646, 400, 18, 10, PI, TAU);
        fill('#ffffff'); rect(720, 230, 180, 150, 10);
        fill('#233252'); rect(732, 242, 156, 126, 6);
        fill('#fff8d8'); ellipse(800, 280, 34, 34);
        for (let i = 0; i < 6; i++) { fillA('#ffffff', 200); ellipse(760 + i * 20, 320 - (i % 3) * 12, 4, 4); }
      } },
  ],
});