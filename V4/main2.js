let system;
let backgroundIMG;
var myFont;
let canva;
let tower;

let Players_img;
function preload() {
  backgroundIMG = loadImage("Assets/BackGround4.png");
  myFont = loadFont("Assets/Minecraft.ttf");

  Players_img = [
    [
      loadImage("Assets/Animation_0.png"),
      loadImage("Assets/Animation_1.png"),
      loadImage("Assets/Animation_2.png"),
      loadImage("Assets/Animation_3.png"),
      loadImage("Assets/Animation_4.png"),
      loadImage("Assets/Animation_5.png"),
    ],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ];
}
let player;
let chunks;
let alpha_mask;

function setup() {
  canva = createCanvas(windowWidth, windowHeight);
  const defaultCanvas = document.querySelector("canvas");
  ctx = defaultCanvas.getContext("2d");

  system = new System();
  console.log(backgroundIMG);

  // tower = new Tower();
  player = new OnControllerPlayer({ color: 5 }, system);
  chunks = new Chunks([0, 0], system);

  function create_alpha_mask() {
    function getPixel(image) {
      let list = [];
      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          list.push([x, y]);
        }
      }
      return list;
    }
    let mask = createGraphics(1000, 1000);

    mask.loadPixels();

    const centerX = mask.width / 2;
    const centerY = mask.height / 2;
    getPixel(mask).forEach((point) => {
      const [x, y] = point;
      const index = (x + y * mask.width) * 4;
      let dist = p5.Vector.dist(
        createVector(centerX, centerY),
        createVector(x, y)
      );
      dist = constrain(dist - 195, 1, 10000) / 0.8;
      dist = constrain(dist, 1, 250);
      mask.pixels[index + 3] = int(dist);
    });
    

    mask.updatePixels();
    // mask.stroke(...c, 30);
    // mask.fill(...c, 5);
    // mask.arc(
    //   0,
    //   0,
    //   this.size - 14 + size,
    //   this.size - 14 + size,
    //   0,
    //   constrain(speed / 300, radians(50), radians(50))
    // );
    // mask.push();
    // mask.pop();
    return mask;
  }
  alpha_mask = create_alpha_mask();
  console.log(alpha_mask);
  (function () {
    // Setup the animation of 6*6 frames of player punching animations Players_img
    function change(image, pixelFrom, pixelTo) {
      image.loadPixels();

      // Replace pixelFrom with pixelTo in a image
      for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
          let index = (x + y * image.width) * 4;
          if (
            image.pixels[index + 0] === pixelFrom[0] &&
            image.pixels[index + 1] === pixelFrom[1] &&
            image.pixels[index + 2] === pixelFrom[2]
          ) {
            if (pixelFrom.length === 4) {
              if (!(image.pixels[index + 3] === pixelFrom[3])) {
                continue;
              }
            }
            image.pixels[index] = pixelTo[0];
            image.pixels[index + 1] = pixelTo[1];
            image.pixels[index + 2] = pixelTo[2];
            if (pixelTo[3]) {
              image.pixels[index + 3] = pixelTo[3];
            }
          }
        }
      }
      image.updatePixels();
    }
    function getAll(exclusive) {
      if (exclusive) {
        return [].concat(
          Players_img[0],
          Players_img[1],
          Players_img[2],
          Players_img[3],
          Players_img[4]
        );
      }
      return [].concat(
        Players_img[0],
        Players_img[1],
        Players_img[2],
        Players_img[3],
        Players_img[4],
        Players_img[5]
      );
    }
    function requestColor(image, color) {
      const n = clone(image);
      change(n, [255, 255, 255], color);
      return n;
    }
    const img = Players_img;
    [
      [255, 255, 255, 150],
      [255, 255, 0, 150],
      [0, 0, 255, 50],
      [248, 147, 29, 150],
      [0, 255, 0, 150],
      [255, 0, 0, 250],
    ];
    [
      [255, 255, 255, 200],
      [255, 255, 0, 200],
      [0, 0, 255, 75],
      [248, 147, 29, 200],
      [0, 255, 0, 200],
      [255, 0, 0, 255],
    ].forEach((color, ii) => {
      for (let i = 0; i < img[0].length; i++) {
        img[ii][i] = requestColor(img[0][i], color);
      }
    });

    getAll().forEach((img) => {
      // Change black color on the edges to be partly transparent.
      change(img, [0, 0, 0, 255], [0, 0, 0, 245]);
    });
    getAll().forEach((image) => {
      function getPixel(image) {
        let list = [];
        for (let y = 0; y < image.height; y++) {
          for (let x = 0; x < image.width; x++) {
            list.push([x, y]);
          }
        }
        return list;
      }
      image.loadPixels();
      const centerX = image.width / 2;
      const centerY = image.height / 2 - 10;
      getPixel(image).forEach((point) => {
        const x = point[0];
        const y = point[1];

        let dist = p5.Vector.dist(
          createVector(centerX, centerY),
          createVector(x, y)
        );
        dist = constrain(dist, 27.5, 100) - 25;
        let index = (x + y * image.width) * 4;
        if (
          !(
            image.pixels[index + 0] === 0 &&
            image.pixels[index + 1] === 0 &&
            image.pixels[index + 2] === 0
          )
        ) {
          image.pixels[index + 3] -= Math.round(dist * 3.25);
          image.pixels[index + 3] = constrain(image.pixels[index + 3], 0, 255);
        }
      });

      image.updatePixels();
    });
    function clone(image) {
      const width = image.width;
      const height = image.height;
      const img2 = createImage(width, height);
      img2.copy(image, 0, 0, width, height, 0, 0, width, height);
      return img2;
    }
  })();
}
function draw() {
  system.update();
  player.update();
  chunks.update(player.physic.pos.x, player.physic.pos.y);
  // tower.update();
  push();
  translate(-player.physic.pos.x, -player.physic.pos.y);
  system.draw();
  player.draw();
  // tower.draw();
  chunks.draw();
  pop();

  push();
  system.drawMenu(
    `\
Testing, ${frameCount}
    `
  );
  scale(5.5);

  image(alpha_mask, 0, 0);
  pop();
}

function mouseClicked() {
  for (let i = 0; i < 14 * 2; i++) {
    system
      .createSparks(
        [mouseX - width / 2, mouseY - height / 2],
        [255, 0, 0],
        random(3, 3.75)
      )
      .move(0, 5);
  }
  player.startPunch();
}
class Tower {
  constructor(size = 600) {
    this.size = size;
    this.pg = createGraphics(this.size, this.size);
    this.pg.background(0, 0);
    this.pg.push();
    this.pg.fill(255, 255, 255, 255);
    this.pg.circle(this.size / 2, this.size / 2, 100);
    this.pg.pop();
    this.frameCount = 0;
  }
  update() {
    this.frameCount += 6;
    if (this.frameCount > 3000) {
      return;
    }
    let c = this.#HSVtoRGB(sin(this.frameCount / 1000) / 3 + 0.1, 0.99, 0.99);

    let speed = (this.frameCount / 7 / 100) * constrain(this.frameCount, 1, 15);
    this.pg.push();
    this.pg.stroke(...c, 30);
    this.pg.fill(...c, 5);
    this.pg.translate(this.size / 2, this.size / 2);
    this.pg.rotate(speed);

    let size = 0;
    this.pg.arc(
      0,
      0,
      this.size - 14 + size,
      this.size - 14 + size,
      0,
      constrain(speed / 300, radians(50), radians(50))
    );
    this.pg.pop();
  }
  draw() {
    push();
    if (this.frameCount < 3000) {
      rotate(-this.frameCount / 200);
    } else {
      rotate(-3100 / 200);
      rotate(this.frameCount / 5000);
    }

    tint(200, 100);
    image(this.pg, 0, 0);
    pop();
  }

  #HSVtoRGB(h, s, v) {
    /* accepts parameters
     * h  Object = {h:x, s:y, v:z}
     * OR
     * h, s, v
     */
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
      (s = h.s), (v = h.v), (h = h.h);
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}
