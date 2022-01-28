let Players_img = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];
addFunction("preload", () => {
  Players_img[0][0] = loadImage("Assets/Animation_0.png");
  Players_img[0][1] = loadImage("Assets/Animation_1.png");
  Players_img[0][2] = loadImage("Assets/Animation_2.png");
  Players_img[0][3] = loadImage("Assets/Animation_3.png");
  Players_img[0][4] = loadImage("Assets/Animation_4.png");
  Players_img[0][5] = loadImage("Assets/Animation_5.png");

  // Players_img[0][6] = loadImage("Assets/Demo/Die0.png");
  // Players_img[0][7] = loadImage("Assets/Demo/Die1.png");
  // Players_img[0][8] = loadImage("Assets/Demo/Die2.png");
  // Players_img[0][9] = loadImage("Assets/Demo/Die3.png");
  // Players_img[0][10] = loadImage("Assets/Demo/Die4.png");
  // Players_img[0][11] = loadImage("Assets/Demo/Die5.png");
  // Players_img[0][12] = loadImage("Assets/Demo/Die6.png");
  // Players_img[0][13] = loadImage("Assets/Demo/Die7.png");
  // Players_img[0][14] = loadImage("Assets/Demo/Die8.png");
});

class Players {
  constructor() {
    this.img = Players_img;
    this.initAnimation();
    this.parent = globalThis
    this.players = [];
    this.realPlayers = [];

    // while (this.players.length < 1) {
    //   let pos = p5.Vector.random2D().setMag(random(950, 1100));
    //   for (let index = 0; index < Prob.normal(10, 2)(); index++) {
    //     // setTimeout(() => {
    //     this.createAIPlayer(
    //       pos.add(p5.Vector.random2D().setMag(random(0, 100)))
    //     );
    //     // }, Prob.normal(16, 16 * 40)());
    //   }
    // }

    // gameTick
    // setInterval(() => {
    //   if (this.players.length < 100) {
    //     // while (this.AIs.length < 35) {
    //     let pos = p5.Vector.random2D().setMag(random(300, 1000));
    //     for (let index = 0; index < Prob.normal(10, 2)(); index++) {
    //       // setTimeout(() => {
    //       this.createAIPlayer(
    //         pos.add(p5.Vector.random2D().setMag(random(0, 100)))
    //       );
    //       // }, Prob.normal(16, 16 * 40)());
    //     }
    //   }
    // }, 3 * 1000);

    // // setInterval(() => {
    // // this.players.shuffle();
    // // }, 125);
  }
  update() {
    this.players.forEach((e) => {
      if (e.AIPlayer) {
        e.update();
      } else if (e === player) {
        e.update();
      } else {
        // e.update(p5.Vector.add(e.pos, createVector(0, -1)));
        e.update();
      }
    });
  }
  draw() {
    this.players.forEach((e, i) => {
      e.draw({ healthBar: true, nameTag: !e.AIPlayer || i <= 1, body: true });
    });
  }
  createAIPlayer(pos, color) {
    pos = pos || p5.Vector.random2D().setMag(random(200, 500));
    color = int(((color % 5) + 5) % 5) || int(random(0, 5));

    if (this.players[0]) {
      // pos.add(this.players[0].pos);
      // pos.add(this.AIs[int(random(0, this.AIs.length))].pos);
    }

    this.players.push(new AIPlayer(this.img[color], this, [pos.x, pos.y]));
  }
  initAnimation() {
    [
      [255, 255, 0],
      [0, 0, 255],
      [248, 147, 29],
      [0, 255, 0],
      [255, 0, 0],
    ].forEach((color, ii) => {
      for (let i = 0; i < this.img[0].length; i++) {
        this.img[ii + 1][i] = createImage(
          this.img[0][i].width,
          this.img[0][i].height
        );
        this.img[ii + 1][i].copy(
          this.img[0][i],
          0,
          0,
          this.img[0][i].width,
          this.img[0][i].height,
          0,
          0,
          this.img[0][i].width,
          this.img[0][i].height
        );
        change(this.img[ii + 1][i], [255, 255, 255], color);
      }
    });
  }
}

function change(image, pixelFrom, pixelTo) {
  image.loadPixels();

  // Replace pixelFrom with pixelTo in a image
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      let index = (x + y * image.width) * 4;
      if (
        image.pixels[index] === pixelFrom[0] &&
        image.pixels[index + 1] === pixelFrom[1] &&
        image.pixels[index + 2] === pixelFrom[2]
      ) {
        image.pixels[index] = pixelTo[0];
        image.pixels[index + 1] = pixelTo[1];
        image.pixels[index + 2] = pixelTo[2];
      }
    }
  }
  image.updatePixels();
}
