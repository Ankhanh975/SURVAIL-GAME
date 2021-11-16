function average(angles) {
  // https://www.youtube.com/watch?v=xHq4UlJiUaE
  let x = 0;
  let y = 0;
  angles.forEach((n) => {
    x += cos(n - 0);
    y += sin(n - 0);
  });
  return atan2(y, x) + 0;
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

class Player {
  constructor(animation, name = "love", pos = [0, 0]) {
    this.normal = createVector(0, -1);

    this.pos = createVector(...pos);
    this.lookAt = createVector(0, 0);
    this.animation = animation;
    this.animateFrames = 0;
    this.name = name;
    this.punchHand = "right";
    if (this.name === null) {
    }
    this.velocity = createVector(0, 0);
    this.angle = 0;
  }
  drawPlayer() {
    // TODO: moving animation
    push();
    noStroke();
    translate(this.pos);
    rotate(this.angle);
    if (this.punchHand === "left") {
      scale(-1, 1);
    }
    image(this.animation[this.animateFrames], 0, 0);
    pop();
  }
  drawNameTag() {
    push();
    translate(this.pos);
    translate(0, -27);

    textFont(myFont);
    textAlign(CENTER);
    textSize(21);
    fill(255, 255, 255);
    text(this.name, 0, 0);

    pop();
  }

  update(lookAt, onController = false) {
    {
      this.lookAt = lookAt;

      // Crop to max rotate speed
      let mouseVec = p5.Vector.sub(this.lookAt, this.pos);
      let angle = this.normal.angleBetween(mouseVec);
      if (angle !== NaN) {
        let a = average([this.angle, angle]);
        let change = min(abs(a - this.angle), abs(a - angle)) * 2;
        // print(
        //   "angle",
        //   degrees(a - this.angle),
        //   degrees(a - angle),
        //   degrees(a - this.angle) -
        //     degrees(a - angle)
        // );

        if (change < radians(30)) {
          this.angle = angle;
        } else {
          if (
            degrees(angle - this.angle) < 0 &&
            degrees(angle - this.angle) > -180
          ) {
            this.angle -= radians(30);
          } else {
            this.angle += radians(30);
          }
        }
      }
    }

    if (onController) {
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        this.pos.x -= 5;
      }
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        this.pos.x += 5;
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        this.pos.y -= 5;
      }
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        this.pos.y += 5;
      }
    }
  }
  onPunch() {
    return this.animateFrames !== 0;
  }
  startPunch(hand = null) {
    // if (this.onPunch()) return;

    {
      // print("startPunch", this.animateFrames, this.animation.length);
      this.animateFrames = 1;

      let id = setInterval(() => {
        // print("in setInterval", this.animateFrames, this.animation.length);
        if (this.animateFrames === this.animation.length - 1) {
          this.animateFrames = 0;
          clearInterval(id);
        } else {
          this.animateFrames += 1;
        }
      }, 16 * 5);
    }
    if (hand === null) {
      this.punchHand = ["left", "right"][int(random(0, 2))];
    } else {
      this.punchHand = hand;
    }
  }
  getHit() {
    // animation
  }
}
class AIPlayer extends Player {
  constructor(animation, pos = [0, 0]) {
    super(animation, "n", pos);
  }
  update(lookAt) {
    super.update(lookAt);
  }
}
