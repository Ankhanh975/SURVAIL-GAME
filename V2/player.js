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
    this.velocity = createVector(0, 0);
    this.angle = 0;

    this.lookAt = createVector(0, 0);
    this.animation = animation;
    this.animateFrames = 0;

    this.name = name;
    this.punchHand = "right";
    this.health = 20;

    // physics circle for collision detection
    this.circle = new DetectCollisions.Circle(
      { x: this.pos.x, y: this.pos.y },
      65 / 2
    );
    this.circle.parent = this;
    system.insert(this.circle);
  }
  setPos(pos) {
    this.pos = pos;
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
  }
  addPos(pos) {
    this.pos.add(pos);
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
  }
  drawPlayer() {
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
    stroke(0, 0, 0);
    fill(255, 255, 255);
    text(this.name, 0, 0);

    pop();
  }
  update(lookAt, onController = false) {
    if (this.health < 20) {
      this.health += 0.04;
    }
    {
      this.lookAt = lookAt;

      // Limit to max rotate speed of radians(30) per frame
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

        if (change < radians(40)) {
          this.angle = angle;
        } else {
          if (
            degrees(angle - this.angle) < 0 &&
            degrees(angle - this.angle) > -180
          ) {
            this.angle -= radians(40);
          } else {
            this.angle += radians(40);
          }
        }
      }
    }

    if (onController) {
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        this.pos.x -= 7;
        this.circle.pos.x -= 7;
      }
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        this.circle.pos.x += 7;
        this.pos.x += 7;
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        this.circle.pos.y -= 7;
        this.pos.y -= 7;
      }
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        this.circle.pos.y += 7;
        this.pos.y += 7;
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
      }, 16.6 * 5);
    }
    if (hand === null) {
      this.punchHand = ["left", "right"][int(random(0, 2))];
    } else {
      this.punchHand = hand;
    }
  }
  getHit() {
    // animation
    for (let i = 0; i < 4; i++) {
      sparks.create_particle([this.pos.x, this.pos.y], 1, [240, 20, 20], 3);
    }
    this.health -= 13;
  }
}

class AIPlayer extends Player {
  constructor(animation, pos = [0, 0]) {
    super(animation, "n", pos);
    this.name = generateName.__call();
  }

  update(allyls, enemies) {
    let lookAt, dist, toLookAt;
    {
      lookAt = enemies[0].pos;
      dist = this.pos.dist(lookAt);
      toLookAt = p5.Vector.sub(lookAt, this.pos);

      super.update(lookAt);
      if (dist < 120) {
        toLookAt.setMag(3.5);
        toLookAt.rotate(radians(180));
        this.addPos(toLookAt);
      }
      if (dist > 250) {
        toLookAt.setMag(3.5);
        this.addPos(toLookAt);
      }
    }
    // {
    //   allyls.forEach((a) => {
    //     if (a === this) {
    //       return;
    //     }
    //     dist = this.pos.dist(a.pos);
    //     // print("dist", this.pos, a.pos);
    //     // print("dist2", dist);

    //     if (dist < 65) {
    //       let l = p5.Vector.sub(a.pos, this.pos);
    //       // l.mult(0.01);
    //       l.setMag(0.02 / mag(l) ** 2);
    //       a.pos.add(l);
    //       l.rotate(radians(180));
    //       this.pos.add(l);
    //     }
    //   });
    // }
  }
}
