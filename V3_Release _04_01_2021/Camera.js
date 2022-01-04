// Call to translate or draw any shape is not work inside setTimeout(() => {});
// So we queue the event for the next frame
class Queue {
  constructor() {
    this.queue1 = [];
    this.queue2 = [];
  }
  addDraw(event) {
    this.queue1.push(event);
  }
  addPro(event) {
    this.queue2.push(event);
  }
  updateDraw() {
    this.queue1.forEach((q) => {
      eval(q);
    });
    this.queue1 = [];
  }
  updatePro() {
    this.queue2.forEach((q) => {
      eval(q);
    });
    this.queue2 = [];
  }
}
class Ground {
  // Set background base on player position
  constructor(img) {
    this.img = img;
  }
  draw(playerPos, radius) {
    this.size = [this.img[0].width, this.img[0].height];
    playerPos = [
      round(playerPos[0] / this.size[0]),
      round(playerPos[1] / this.size[1]),
    ];
    // print("this.size", this.size, playerPos);

    for (
      let x = playerPos[0] + radius[0][0];
      x < playerPos[0] + radius[0][1];
      x++
    ) {
      for (
        let y = playerPos[1] + radius[1][0];
        y < playerPos[1] + radius[1][1];
        y++
      ) {
        let x1 = x * this.size[0];
        let y1 = y * this.size[1];
        // img = random.choice(this.img)
        // let img = this.img[round(random(0, this.img.length-1))];
        let img = this.img[0];
        image(img, x1, y1);
      }
    }
  }
}

class Camera {
  // transform world coordinates to screen coordinates
  constructor() {
    this.ground = new Ground([
      loadImage("Resources/BackGround1.png"),
      loadImage("Resources/BackGround2.png"),
      loadImage("Resources/BackGround3.png"),
      loadImage("Resources/BackGround4.png"),
    ]);
    this.transform = [];
    this.realTransform = [];
  }
  follow(playerPos) {
    // Move player to center

    translate(-player.pos.x, -player.pos.y);
    this.transform = [-player.pos.x, -player.pos.y];
  }
  draw_background(
    radius = [
      [-3, +4],
      [-2, +3],
    ]
  ) {
    // Draw background behind everything (close to player for speed)
    this.ground.draw([-this.transform[0], -this.transform[1]], radius);
  }
  toWorldCoords(pos = null) {
    // Transform screen coordinates to world coordinates
    // Default: return position of the mouse
    let x, y;
    if (pos === null) {
      x = mouseX - width / 2;
      y = mouseY - height / 2;
    } else {
      [x, y] = pos;
    }
    // console.log("xy", x, y, [x - this.transform[0], y - this.transform[1]]);
    return createVector(x - this.transform[0], y - this.transform[1]);
  }
  shake(duration = 3, variance = 1.0) {
    // Start shake camera
  }
  translate(x, y) {
    // Average out the transformation over few frame
    translate(x, y);
    // = stack != null ? stack : [];
  }
  rotate(a) {
    // Average out the transformation over few frame
  }
}

// if (mouseX < 10) {
//   camera.translate(min(10 - mouseX, 10)*10, 0);
// }
// if (mouseX > width - 10) {
//   camera.translate(max(-mouseX + width - 10, -10)*10, 0);
// }
// if (mouseY < 10) {
//   camera.translate(0, min(10 - mouseY, 10)*10);
// }
// if (mouseY > height - 10) {
//   camera.translate(0, max(-mouseY + height - 10, -10)*10);
// }
