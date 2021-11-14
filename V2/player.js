class Player {
  constructor(animation) {
    this.pos = createVector(100, 100);
    this.lookAt = createVector(0, 0);
    this.normal = createVector(0, -1);
    this.animation = animation;
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
  drawNameTag(name="love") {
    push();
    translate(this.pos);
    translate(0, -27);
      
    textAlign(CENTER);
    textFont(myFont);
    textSize(21);
    fill(255, 255, 255);
    text(name, 0, 0);

    pop();
  }

  update(lookAt) {
    this.lookAt = lookAt;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.pos.x -= 5;
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.pos.x += 5;
    } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.pos.y -= 5;
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.pos.y += 5;
    }
  }
  startPunch() {}
}
