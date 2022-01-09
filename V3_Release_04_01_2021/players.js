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

Array.prototype.shuffle = function () {
  var i = this.length,
    j,
    temp;
  if (i == 0) return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};

class Players {
  constructor(system) {
    this.img = Players_img;
    this.initAnimation();
    this.players = [];
    this.AIs = [];
    this.system = system;

    for (let index = 0; index < 20; index++) {
      this.createAIPlayer();
    }
    // gameTick
    setInterval(() => {
      if (this.AIs.length < 15) {
        let pos = p5.Vector.random2D().setMag(random(900, 1000));
        for (let index = 0; index < 15; index++) {
          this.createAIPlayer(
            pos.add(p5.Vector.random2D().setMag(random(0, 75)))
          );
        }
      }
    }, 1250);
  }
  update(mouse, grid) {
    this.AIs.forEach((e) => {
      e.update(this.AIs, this.players, grid);
    });
    this.players.forEach((player) => {
      player.update(mouse, true);
    });
  }
  draw() {
    this.AIs.forEach((e) => {
      e.drawPlayer();
      //   e.drawNameTag();
      e.drawHeightBar();
    });
    this.players.forEach((player) => {
      player.drawPlayer();
      player.drawNameTag();
      // player.drawHeiaghtBar();
    });
  }
  createAIPlayer(pos) {
    pos = pos || p5.Vector.random2D().setMag(random(200, 300));
    if (this.players[0]) {
      // pos.add(this.players[0].pos);
      // pos.add(this.AIs[int(random(0, this.AIs.length))].pos);
    }

    this.AIs.push(new AIPlayer(this.img[int(random(0, 5))], [pos.x, pos.y]));
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
          this.img[0][0].width,
          this.img[0][0].height
        );
        this.img[ii + 1][i].copy(
          this.img[0][i],
          0,
          0,
          this.img[0][0].width,
          this.img[0][0].height,
          0,
          0,
          this.img[0][0].width,
          this.img[0][0].height
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
