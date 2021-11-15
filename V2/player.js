function average(angles) {
  // https://www.youtube.com/watch?v=xHq4UlJiUaE
  let x = 0;
  let y = 0;
  angles.forEach((n) => {
    x += cos(n - 180);
    y += sin(n - 180);
  });
  return atan2(y, x) + 180;
}
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

class Player {
  constructor(animation, name = "love", pos = [0, 0]) {
    this.normal = createVector(0, -1);

    this.pos = createVector(...pos);
    this.lookAt = createVector(0, 0);
    this.animation = animation;
    this.name = name;

    if (this.name === null) {
    }
    this.velocity = createVector(0, 0);
    this.angle = 0;
  }
  drawPlayer() {
    push();
    translate(this.pos);
    rotate(this.angle);
    texture(this.animation[0]);
    noStroke();
    rect(0, 0, 196, 196);
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
    this.lookAt = lookAt;
    // console.log(this.pos, this.lookAt);

    // Crop to max rotate speed
    let mouseVec = p5.Vector.sub(this.lookAt, this.pos);
    let angle = this.normal.angleBetween(mouseVec);
    let change = min((this.angle - angle) / 2, -(this.angle - angle) / 2 + PI);
    // average([this.angle, angle]);
    print("angle", int(change * 1000));

    if (change < radians(3  )) {
      this.angle = angle;
    } else {
      if (this.angle - angle / 2 - PI > 0) {
        this.angle += radians(3 );
      } else {
        this.angle -= radians(3 );
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
  startPunch(hand = "right") {
    print("StartPunch");
  }
}
