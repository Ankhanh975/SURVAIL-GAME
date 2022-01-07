let Players_img = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];
addFunction("preload", () => {
  Players_img[0][0] = loadImage("Resources/Animation_0.png");
  Players_img[0][1] = loadImage("Resources/Animation_1.png");
  Players_img[0][2] = loadImage("Resources/Animation_2.png");
  Players_img[0][3] = loadImage("Resources/Animation_3.png");
  Players_img[0][4] = loadImage("Resources/Animation_4.png");
  Players_img[0][5] = loadImage("Resources/Animation_5.png");
});

class Players {
  constructor(system) {
    this.img = Players_img;
    this.initAnimation();
    this.players = [];
    this.system = system;

    setTimeout(() => {
      for (let index = 0; index < 10; index++) {
        this.createAIPlayer();
      }
    }, 100);

    // gameTick
    setInterval(() => {
      if (this.players.length < 20) {
        // while (this.AIs.length < 35) {
        let pos = p5.Vector.random2D().setMag(random(300, 1000));
        for (let index = 0; index < Prob.normal(10, 2)(); index++) {
          // setTimeout(() => {
          this.createAIPlayer(
            pos.add(p5.Vector.random2D().setMag(random(0, 100)))
          );
          // }, Prob.normal(16, 16 * 40)());
        }
      }
    }, 2000);

    // setInterval(() => {
    //   this.AIs.shuffle();
    //   this.players.shuffle();
    // }, 125);
  }
  update(mouse, grid) {
    this.players.forEach((e) => {
      if (e.AIPlayer) {
        e.update(grid);
      } else if (e === player) {
        e.update(mouse);
      } else {
        e.update(p5.Vector.add(e.pos, createVector(0, -1)));
      }
    });
  }
  draw() {
    this.players.forEach((e, i) => {
      e.drawPlayer();
      e.drawHeightBar();
      if (!e.AIPlayer || i <= 1) {
        e.drawNameTag();
      }
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
