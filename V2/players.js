class Players {
  constructor(system) {
    this.img = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    this.initAnimation();
    this.players = [];
    this.AIs = [];
    this.system = system;

    for (let index = 0; index < 45; index++) {
      this.createAIPlayer();
    }
    // gameTick
    setInterval(() => {
      if (this.AIs.length < 45) {
        this.createAIPlayer();
      }
    }, 1250);
  }
  update(mouse) {
    print(this.players[0]);
    this.players.forEach((player) => {
      player.update(mouse, true);
      player.drawPlayer();
      player.drawNameTag();
    });

    this.AIs.forEach((e) => {
      e.update(this.AIs, this.players);
      e.drawPlayer();
      // e.drawNameTag();
    });

    this.system.update();
    this.system.checkAll(({ a, overlapV }) => {
      let b = this.system.response.b.pos;
      let l = createVector(a.pos.x - b.x, a.pos.y - b.y);
      // console.log(overlapV);
      // l.scale(0.0001 / l.len() ** 2);
      l.setMag(150 / l.mag() ** 2);
      // l.scale(1 / mal.len());
      a.pos.x += l.x;
      a.pos.y += l.y;
      a.parent.pos.add(l);
      // console.log("2", a);
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
    this.img[0][0] = loadImage("Resources/Animation_0.png");
    this.img[0][1] = loadImage("Resources/Animation_1.png");
    this.img[0][2] = loadImage("Resources/Animation_2.png");
    this.img[0][3] = loadImage("Resources/Animation_3.png");
    this.img[0][4] = loadImage("Resources/Animation_4.png");
    this.img[0][5] = loadImage("Resources/Animation_5.png");
    [
      [255, 255, 0],
      [0, 0, 255],
      [248, 147, 29],
      [0, 255, 0],
      [255, 0, 0],
    ].forEach((color, ii) => {
      for (let i = 0; i < this.img[0].length; i++) {
        this.img[ii + 1].push(
          createImage(this.img[0][0].width, this.img[0][0].height)
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
