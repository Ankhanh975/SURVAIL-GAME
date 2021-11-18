class Players {
  constructor(system, img) {
    this.img = img;
    this.initAnimation();
    this.players = [];
    this.AIs = [];
    this.system = system;

    for (let index = 0; index < 70; index++) {
      this.createAIPlayer();
    }
    // gameTick
    setInterval(() => {
      if (this.AIs.length < 70) {
        this.createAIPlayer();
      }
      }, 1250);
  }
  update(mouse) {
    this.AIs.forEach((e) => {
      e.update(this.AIs, this.players);
      e.drawPlayer();
      //   e.drawNameTag();
      e.drawHeightBar();
    });
    this.players.forEach((player) => {
      player.update(mouse, true);
      player.drawPlayer();
      player.drawNameTag();
      // player.drawHeiaghtBar();
    });

  }
  createAIPlayer() {
    let pos = p5.Vector.random2D().setMag(170 + random(0, 500));
    if (this.players[0]) {
      pos.add(this.players[0].pos);
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
