(function () {
  let Players_img;
  addFunction("preload", () => {
    Players_img = [
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
    ];
    const img = Players_img;
    img[0] = [
      loadImage("Assets/Animation_0.png"),
      loadImage("Assets/Animation_1.png"),
      loadImage("Assets/Animation_2.png"),
      loadImage("Assets/Animation_3.png"),
      loadImage("Assets/Animation_4.png"),
      loadImage("Assets/Animation_5.png"),
    ];

    // img[0][6] = loadImage("Assets/Demo/Die0.png");
    // img[0][7] = loadImage("Assets/Demo/Die1.png");
    // img[0][8] = loadImage("Assets/Demo/Die2.png");
    // img[0][9] = loadImage("Assets/Demo/Die3.png");
    // img[0][10] = loadImage("Assets/Demo/Die4.png");
    // img[0][11] = loadImage("Assets/Demo/Die5.png");
    // img[0][12] = loadImage("Assets/Demo/Die6.png");
    // img[0][13] = loadImage("Assets/Demo/Die7.png");
    // img[0][14] = loadImage("Assets/Demo/Die8.png");
  });
  addFunction("setup", () => {
    const img = Players_img;
    [
      [255, 255, 0, 200],
      [0, 0, 255, 50],
      [248, 147, 29, 200],
      [0, 255, 0, 200],
      [255, 0, 0, 255],
    ].forEach((color, ii) => {
      for (let i = 0; i < img[0].length; i++) {
        img[ii + 1][i] = clone(img[0][i]);
        change(img[ii + 1][i], [255, 255, 255], color);
      }
    });
    img[0].forEach((color, ii) => {
      change(img[0][ii], [255, 255, 255], [255, 255, 255, 220]);
    });
    // Change black color on the edges to be partly transparent.
    img.forEach((img0) => {
      img0.forEach((img1) => {
        change(img1, [0, 0, 0, 255], [0, 0, 0, 240]);
      });
    });
  });
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
          if (pixelFrom.length === 4) {
            if (!(image.pixels[index + 3] === pixelFrom[3])) {
              continue;
            }
          }
          image.pixels[index] = pixelTo[0];
          image.pixels[index + 1] = pixelTo[1];
          image.pixels[index + 2] = pixelTo[2];
          image.pixels[index + 3] = pixelTo[3];
        }
      }
    }
    image.updatePixels();
  }
  function clone(image) {
    const width = image.width;
    const height = image.height;
    const img2 = createImage(width, height);
    img2.copy(image, 0, 0, width, height, 0, 0, width, height);
    return img2;
  }
  component.animation = class {
    name = "animation";
    constructor() {
      // this.color = this.parent.color;
      // this.animation = Players_img[color];
      // this.animationLength = this.animation.length;
      this.animateFrames = 0;
      // this.update = () => {};
      this.start = () => {
        this.animateFrames = 1;

        setTimeout(() => {
          this.animateFrames = 2;
        }, 16 * 5 * 1);
        setTimeout(() => {
          this.animateFrames = 3;
        }, 16 * 5 * 2);
        setTimeout(() => {
          this.animateFrames = 4;
        }, 16 * 5 * 3);
        setTimeout(() => {
          this.animateFrames = 5;
        }, 16 * 5 * 4);
        setTimeout(() => {
          this.animateFrames = 0;
        }, 16 * 5 * 5);
      };
      this.getFrames = () => {
        // return this.animation[this.animateFrames];
        return Players_img[this.parent.color][this.animateFrames];
      };
      this.onPunch = () => {
        return this.animateFrames !== 0;
      };
    }
    draw() {
      const angle = this.parent.getAngle();
      const position = [0, 0];
      const color = this.parent.color;
      const health = this.parent.health_percentage;
      const mode = 0;
      const img = this.getFrames();

      push();
      ctx.globalAlpha = health;
      // ctx.globalCompositeOperation = "source-over";
      rotate(angle);
      if (this.parent.punchHand === "left" && this.onPunch()) {
        scale(-1, 1);
        translate(-10, 0);
      }
      image(img, 0, 0);
      pop();
      // ctx.direction: "ltr"
      // ctx.fillStyle: "#ffffff"
      // ctx.filter: "none"
      // ctx.font: "12px sans-serif"
      // ctx.globalAlpha: 1
      // ctx.globalCompositeOperation: "source-over"
      // ctx.imageSmoothingEnabled: false
      // ctx.imageSmoothingQuality: "low"
      // ctx.lineCap: "round"
      // ctx.lineDashOffset: 0
      // ctx.lineJoin: "miter"
      // ctx.lineWidth: 1
      // ctx.miterLimit: 10
      // ctx.shadowBlur: 0
      // ctx.shadowColor: "rgba(0, 0, 0, 0)"
      // ctx.shadowOffsetX: 0
      // ctx.shadowOffsetY: 0
      // ctx.strokeStyle: "#000000"
      // ctx.textAlign: "start"
      // ctx.textBaseline: "alphabetic"
    }
  };
})();
// clear_img() clears
// html canvas use clear_rect()

function clear_surface(canvas, startX, startY, endX, endY) {
  canvas.loadPixels();
  const width = canvas.width;
  for (var x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      // loop over
      const index = 4 * (y * width + x);
      canvas.pixels[index + 3] = 0;
    }
  }
  canvas.updatePixels();
}
function createGrid(n, m) {
  let grid = [];
  let grid0 = [];
  for (let i = 0; i < n; i++) {
    grid.push(null);
  }
  for (let i = 0; i < m; i++) {
    grid0.push(0);
  }
  grid = grid.map(function (grid) {
    return grid0;
  });
  return grid;
}
