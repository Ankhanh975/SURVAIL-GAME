class Player {
  constructor(animation, parent, name = "love", pos = [0, 0], health = 42) {
    this.pos = createVector(...pos);
    this.lastPos = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.heading = createVector(1, 0);
    this.heading.angle = 0;

    this.lookAt = createVector(0, 0);
    this.animation = animation;
    this.animationLength = this.animation.length;
    this.animateFrames = 0;

    this.name = name;
    this.punchHand = "right";

    this.health = health;
    this.totalHealth = health;
    this.recovery = 0.04;
    this.damage = 1;
    // physics circle for collision detection
    this.circle = system.createCircle({ x: this.pos.x, y: this.pos.y }, 90);
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

  update(lookAt, moveTo) {
    this.lastPos = this.pos.copy();
    if (this.health < this.totalHealth) {
      this.health += this.recovery;
    }
    {
      // Limit max rotate to speed of radians(37.5) per frame
      let heading = p5.Vector.sub(lookAt, this.pos).rotate(radians(90));
      let angle = heading.angleBetween(this.heading);

      // console.log("angle", degrees(angle));
      if (abs(angle) < radians(37.5)) {
        this.heading = heading;
      } else if (angle > 0) {
        this.heading.rotate(radians(-37.5));
      } else if (isNaN(angle)) {
      } else {
        this.heading.rotate(radians(37.5));
      }
      this.heading.angle = this.heading.heading();
    }
    if (moveTo) {
      this.setPos(moveTo);
    }
  }
  drawPlayer() {
    push();
    noStroke();
    translate(Math.round(this.pos.x), Math.round(this.pos.y));

    rotate(this.heading.angle);
    if (this.punchHand === "left" && this.animateFrames !== 0) {
      scale(-1, 1);
      // translate(-10, 0);
    }
    image(this.animation[this.animateFrames], 0, 0);
    pop();
  }
  drawNameTag() {
    push();
    translate(Math.round(this.pos.x), Math.round(this.pos.y));

    translate(2, -18);

    textFont(myFont);
    textAlign(CENTER);
    textSize(21);
    stroke(0, 0, 0);
    // strokeWeight(1.5);
    strokeWeight(0);
    fill(255, 255, 255);
    text(this.name, 0, 0);

    pop();
  }
  drawHeightBar() {
    if (this.health >= 0) {
      push();
      translate(Math.round(this.pos.x), Math.round(this.pos.y));

      translate(-20, -35);
      strokeWeight(4);

      stroke(25, 25, 25);
      rect(0, 0, 55, 1);

      strokeWeight(3);
      stroke(250, 50, 25);
      rect(0, 0, 55 * (this.health / this.totalHealth), 1);
      pop();
    }
  }
  onPunch() {
    return this.animateFrames !== 0;
  }
  startPunch(hand = null) {
    this.health -= 1;
    // print("startPunch", this.animateFrames, this.animation.length);
    {
      // animation
      this.punchHand = hand || ["left", "right"][int(random(0, 2))];
      this.animateFrames = 1;

      let id = setInterval(() => {
        // print("in setInterval", this.animateFrames, this.animation.length);
        if (this.animateFrames === this.animationLength - 1) {
          this.animateFrames = 0;
          clearInterval(id);
        } else {
          this.animateFrames += 1;
        }
      }, 16 * 5);
    }

    // effects to all players when punch: push them backwards and minus their health
    setTimeout(() => {
      obstacles.obstacles.forEach((e, i) => {});
      let hitRange;
      if (this.AIPlayer) {
        hitRange = [150, radians(0 - 90) + this.heading.angle, radians(40)];
      } else {
        hitRange = [280, radians(0 - 90) + this.heading.angle, radians(60)];
      }

      this.parent.players.forEach((e, i) => {
        let hit = collidePointArc(
          e.pos.x,
          e.pos.y,
          this.pos.x,
          this.pos.y,
          hitRange[0],
          hitRange[1],
          hitRange[2]
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
            let start = millis();
            let jump = () => {
              let deltaT = (millis() - start) / 16 / 1.75;
              let d = p5.Vector.sub(this.pos, e.pos);
              d.normalize();
              // console.log("d", deltaT, d);
              d.setMag(
                -d.mag() *
                  Curve.f2(deltaT, 0.1, 0.6, 0.275) *
                  15 *
                  this.damage -
                  3
              );
              e.addPos(d);
            };
            jump();
            let id9 = setInterval(() => {
              jump();
            }, 16);

            setTimeout(() => {
              clearInterval(id9);
            }, 16 * 5);
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
        sparks.create_particle(this.pos, [200, 50, 50], 3.6);
      }
    } else {
      // Dead
      for (let i = 0; i < 4; i++) {
        sparks.create_particle(this.pos, [0, 0, 0], 3.6);
      }
    }
  }
}

class AIPlayer extends Player {
  constructor(animation, parent, pos = [0, 0]) {
    super(animation, parent, "n", pos);
    this.name = generateName.__call();
    this.AIPlayer = true;
    // this.target = int(random(0, this.parent.realPlayers.length));
    this.target = 0
  }

  update() {
    let target = this.parent.realPlayers[this.target].pos;

    // let target;
    // {
    //   let targetDis = Infinity;
    //   this.parent.realPlayers.forEach((p) => {
    //     let d = this.pos.dist(p.pos);
    //     console.log("d", d, targetDis);
    //     if (d < targetDis) {
    //       targetDis = d;
    //       target = p.pos;
    //     }
    //   });
    // }

    {
      let lookAt, dist, toLookAt;
      lookAt = target;
      dist = this.pos.dist(lookAt);
      toLookAt = p5.Vector.sub(lookAt, this.pos);

      super.update(lookAt);
      // if (dist < 150) {
      //   if (!this.onPunch()) {
      //     if (random(0, 100) >= 92.5) {
      //       this.startPunch();
      //     }
      //   }
      // }

      if (dist < 120) {
        toLookAt.setMag(3.5);
        toLookAt.rotate(radians(180));
        this.addPos(toLookAt);
      }
      if (dist > 150) {
        toLookAt.setMag(3.0);
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

    //     if (dist < 70) {
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
