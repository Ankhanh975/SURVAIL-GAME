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
  constructor(animation, parent, name = "love", pos = [0, 0], health = 42) {
    this.normal = createVector(0, -1);

    this.pos = createVector(...pos);
    this.lastPos = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.angle = 0;

    this.lookAt = createVector(0, 0);
    this.animation = animation;
    this.animateFrames = 0;

    this.name = name;
    this.punchHand = "right";
    
    this.health = health;
    this.totalHealth = health;
    this.recovery = 0.04
    
    // physics circle for collision detection
    this.circle = system.createCircle({ x: this.pos.x, y: this.pos.y }, 65 / 2);
    this.circle.parent = this;
    this.parent = parent;
  }
  setPos(pos) {
    this.pos = pos;
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
    system.updateBody(this.circle);
  }
  addPos(pos) {
    this.pos.add(pos);
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
    system.updateBody(this.circle);
  }

  update(lookAt) {
    if (this.health < this.totalHealth) {
      this.health += this.recovery;
    }

    this.lastPos = this.pos.copy();
    this.lookAt = lookAt;
    if (!this.pos.equals(this.lookAt)) {
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
    translate(0, -18);

    textFont(myFont);
    textAlign(CENTER);
    textSize(21);
    stroke(0, 0, 0);
    strokeWeight(1.5);
    fill(255, 255, 255);
    text(this.name, 0, 0);

    pop();
  }
  drawHeightBar() {
    push();
    translate(this.pos);
    translate(0, -35);
    strokeWeight(4);

    stroke(25, 25, 25);
    rect(0, 0, 55, 1);

    strokeWeight(3);
    stroke(250, 50, 25);
    rect(0, 0, 55 * (this.health / this.totalHealth), 1);
    pop();
  }
  onPunch() {
    return this.animateFrames !== 0;
  }
  startPunch(hand = null) {
    // print("startPunch", this.animateFrames, this.animation.length);
    {
      // animation
      this.punchHand = hand || ["left", "right"][int(random(0, 2))];
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

    // effects to outside
    setTimeout(() => {
      obstacles.obstacles.forEach((e, i) => {});

      this.parent.players.forEach((e, i) => {
        let hit = collidePointArc(
          e.pos.x,
          e.pos.y,
          this.pos.x,
          this.pos.y,
          250,
          radians(0 - 90) + this.angle,
          radians(80)
        );

        if (hit) {
          // print("Hit players.AIs", i);
          e.getHit();
          if (e.health < 0) {
            system.remove(e.circle);
            this.parent.players.splice(i, 1);
            killCount += 1;
          } else {
            // Push enemies backwards
            let id2 = setInterval(() => {
              let l = p5.Vector.sub(this.pos, e.pos);
              l.setMag(-max(18888 / l.mag(), 12));

              // l.scale(1 / mal.len());
              e.addPos(l);
            }, 16);
            setTimeout(() => {
              clearInterval(id2);
            }, 16.6 * 2);
          }
        }
      });
    }, 190);
  }
  getHit() {
    // animation

    this.health -= 13;
    if (this.health >= 0) {
      for (let i = 0; i < 4; i++) {
        sparks.create_particle(this.pos, [200, 0, 0], 3.5);
      }
    } else {
      // Dead
      for (let i = 0; i < 4; i++) {
        sparks.create_particle(this.pos, [100, 0, 0], 3.5);
      }
    }
  }
}

class AIPlayer extends Player {
  constructor(animation, parent, pos = [0, 0]) {
    super(animation, parent, "n", pos);
    this.name = generateName.__call();
    this.AIPlayer = true;
  }

  update(grid) {
    let lookAt, dist, toLookAt;
    {
      lookAt = this.parent.players[0].pos;
      dist = this.pos.dist(lookAt);
      toLookAt = p5.Vector.sub(lookAt, this.pos);

      super.update(lookAt);
      if (dist < 120) {
        toLookAt.setMag(3.5);
        toLookAt.rotate(radians(180));
        this.addPos(toLookAt);
      }
      if (dist < 150) {
        if (!this.onPunch()) {
          if (random(0, 100) >= 92.5) {
            this.startPunch();
          }
        }
      }

      if (dist > 150) {
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

function onController(player) {
  // The awsd response
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.addPos(createVector(-7, 0));
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.addPos(createVector(7, 0));
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.addPos(createVector(0, -7));
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.addPos(createVector(0, 7));
  }
}
