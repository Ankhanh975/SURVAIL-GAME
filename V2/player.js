class Player {
  constructor(animation, name = "love", pos = [0, 0]) {
    this.pos = createVector(...pos);
    this.lookAt = createVector(0, 0);
    this.normal = createVector(0, -1);
    this.animation = animation;
    this.name = name;
    if (this.name === null) {
    }
  }
  drawPlayer() {
    // console.log(this.pos, this.lookAt);
    let vec = p5.Vector.sub(this.lookAt, this.pos);
    let angle = this.normal.angleBetween(vec);
    // print(angle);

    push();
    translate(this.pos);
    rotate(angle);
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
