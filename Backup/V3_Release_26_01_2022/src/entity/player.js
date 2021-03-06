class Player extends Base {
  constructor(animation, parent, name = "love", pos = [0, 0], health = 42) {
    super(parent, pos, name, health);
    this.animation = animation;
    this.animationLength = this.animation.length;
    this.animateFrames = 0;

    this.punchHand = "right";

    this.recovery = 0.04;
    this.damage = 0.75;

    // physics circle for collision detection
    // TODO: this.circle should be a polygon
    this.circle = collisions.createCircle(
      { x: this.pos.x, y: this.pos.y },
      65 / 2
    );
    this.circle.parent = this;
    collisions.updateBody(this.circle);
  }
  setPos(pos) {
    super.setPos(pos);

    collisions.checkOne(this.circle, (response) => {
      const x = -response.overlapV.x;
      const y = -response.overlapV.y;
      const b = response.b.parent;
      const pushOut = createVector(x, y);
      if (response.b.parent instanceof Player) {
        const pushOut2 = createVector(x, y);
        pushOut.limit(5);
        pushOut2.limit(5);

        pushOut.setMag(pushOut.mag() * 0.6);
        pushOut2.setMag(pushOut2.mag() * -0.4);

        this.pos.add(pushOut);
        this.circle.setPosition(this.pos.x, this.pos.y);
        b.pos.add(pushOut2);
        b.circle.setPosition(b.pos.x, b.pos.y);
      } else if (response.b.parent instanceof Obstacle) {
        this.pos.add(pushOut);
        this.circle.setPosition(this.pos.x, this.pos.y);
      }
    });
  }

  update() {
    super.update();
    {
      // Limit max rotate to speed of radians(37.5) per frame
      let heading = p5.Vector.sub(this.lookAt, this.pos).rotate(radians(90));
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
  }
  LookAt(lookAt) {
    // To lookAt some point on the map
    this.lookAt = lookAt;
  }
  draw(options) {
    push();
    translate(Math.round(this.pos.x), Math.round(this.pos.y));
    if (options.body) {
      push();
      rotate(this.heading.angle);
      if (this.punchHand === "left" && this.animateFrames !== 0) {
        scale(-1, 1);
        // translate(-10, 0);
      }
      image(this.animation[this.animateFrames], 0, 0);
      pop();
    }
    if (options.healthBar) {
      push();

      translate(-20, -35);
      strokeWeight(4);

      stroke(25, 25, 25);
      rect(0, 0, 55, 1);

      strokeWeight(3);
      stroke(250, 50, 25);
      rect(0, 0, 55 * (this.health / this.totalHealth), 1);
      pop();
    }
    if (options.nameTag) {
      push();

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
    pop();
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

      setTimeout(() => {
        this.animateFrames = 2;
      }, 16 * 5 * 1);
      setTimeout(() => {
        this.animateFrames = 3;
      }, 16 * 5 * 2);
      setTimeout(() => {
        this.animateFrames = 4;
      }, 16 * 5 * 3);
      setTimeout(() => {
        this.animateFrames = 5;
      }, 16 * 5 * 4);
      setTimeout(() => {
        this.animateFrames = 0;
      }, 16 * 5 * 5);
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
            collisions.remove(e.circle);

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
                  21 *
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
