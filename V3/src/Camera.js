class Ground {
  // Set background base on player position
  constructor(img) {
    this.img = img;
  }
  draw(playerPos, radius) {
    this.size = [this.img[0].width, this.img[0].height];
    playerPos = [
      Math.round(playerPos[0] / this.size[0]),
      Math.round(playerPos[1] / this.size[1]),
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
      loadImage("Assets/BackGround1.png"),
      loadImage("Assets/BackGround2.png"),
      loadImage("Assets/BackGround3.png"),
      loadImage("Assets/BackGround4.png"),
    ]);
    this.transform = [];
    this.realTransform = [];
  }
  follow(playerPos) {
    // Move player to center

    translate(Math.round(-player.pos.x), Math.round(-player.pos.y));
    this.transform = [-player.pos.x, -player.pos.y];
  }
  draw_background(radius) {
    radius = radius || [
      [-5, +6],
      [-3, +4],
    ];
    // Draw background behind everything (close to player for speed)
    this.ground.draw([-this.transform[0], -this.transform[1]], radius);
  }
  toWorldCoords(pos) {
    // Transform screen coordinates to world coordinates
    // Default: return position of the mouse
    let x, y;
    if (pos) {
      x = pos[0] - width / 2;
      y = pos[1] - height / 2;
    } else {
      x = mouseX - width / 2;
      y = mouseY - height / 2;
    }
    // console.log("xy", x, y, [x - this.transform[0], y - this.transform[1]]);
    // return createVector(x - this.transform[0], y - this.transform[1]);
    return createVector(x + player.pos.x, y + player.pos.y);
  }
  shake(duration = 3, variance = 1.0) {
    // Start shake camera
  }
  translate(x, y) {
    // Average out the transformation over few frame
    translate(x, y);
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
    // = stack != null ? stack : [];
  }
  rotate(a) {
    // Average out the transformation over few frame
  }
}

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 */
function HSVtoRGB(h, s, v) {
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
// Monitor total play time
// Check Monitor use: localStorage.getItem("playTime");
setTimeout(() => {
  let start = frameCount;
  setInterval(() => {
    let thisTime = (frameCount - start) / frameRate();

    let now = localStorage.getItem("playTime");
    now = JSON.parse(now);
    if (now === null || now === "undefined") now = 0;
    else now = now;

    localStorage.setItem("playTime", JSON.stringify(now + thisTime));
  }, 30 * 1000);
}, 5000);
