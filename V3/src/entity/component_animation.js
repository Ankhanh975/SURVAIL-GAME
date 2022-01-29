(function () {
  let Players_img = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  addFunction("preload", () => {
    const img = Players_img;
    img[0][0] = loadImage("Assets/Animation_0.png");
    img[0][1] = loadImage("Assets/Animation_1.png");
    img[0][2] = loadImage("Assets/Animation_2.png");
    img[0][3] = loadImage("Assets/Animation_3.png");
    img[0][4] = loadImage("Assets/Animation_4.png");
    img[0][5] = loadImage("Assets/Animation_5.png");

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
      [255, 255, 0],
      [0, 0, 255],
      [248, 147, 29],
      [0, 255, 0],
      [255, 0, 0],
    ].forEach((color, ii) => {
      for (let i = 0; i < img[0].length; i++) {
        img[ii + 1][i] = createImage(img[0][i].width, img[0][i].height);
        img[ii + 1][i].copy(
          img[0][i],
          0,
          0,
          img[0][i].width,
          img[0][i].height,
          0,
          0,
          img[0][i].width,
          img[0][i].height
        );

        change(img[ii + 1][i], [255, 255, 255], color);
      }
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
          image.pixels[index] = pixelTo[0];
          image.pixels[index + 1] = pixelTo[1];
          image.pixels[index + 2] = pixelTo[2];
        }
      }
    }
    image.updatePixels();
  }
  component.animation = class {
    name = "animation";
    constructor() {
      console.log(this.parent);
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
  };
})();
