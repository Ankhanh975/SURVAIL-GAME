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
    this.transformed = [];
  }
  follow(playerPos) {
    // Move player to center
    translate(-player.pos.x, -player.pos.y);
    this.transformed = [-player.pos.x, -player.pos.y];
    
  }
  draw_background(
    radius = [
      [-3, +4],
      [-3, +4],
    ]
  ) {
    // Draw background behind everything (close to player for speed)
    this.ground.draw([-this.transformed[0], -this.transformed[1]], radius);
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
    // console.log("xy", x, y, [x - this.transformed[0], y - this.transformed[1]]);
    return createVector(x - this.transformed[0], y - this.transformed[1]);
  }
}
