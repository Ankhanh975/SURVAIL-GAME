class PlayerBase extends Base {
  constructor(parent, pos = [0, 0], name = "", health) {
    super();
    this.pos = createVector(...pos);
    this.lastPos = createVector(0, 0);
    this.isFreeze = false;
    this.velocity = createVector(0, 0);
    this.velocity_length = 0
    this.acceleration = createVector(0, 0);
    this.parent = parent;

    this.name = name;

    this.health = health;
    this.totalHealth = health;
    this.recovery = 0.0;
    this.damage = 1;

    // physics in collision detection system
    this.circle = null;
  }
  setPos(pos) {
    this.pos = pos;
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
    // this.circle.setPosition(this.pos.x, this.pos.y);
  }
  addPos(pos) {
    // pos: p5js vector add to this.pos
    this.setPos(this.pos.add(pos));
  }
  update() {
    super.update();
    this.health += this.recovery;
    this.health = constrain(this.health, 0, this.totalHealth);
    this.lastPos = this.pos.copy();
  }
  die() {
    collisions.remove(this.circle);

    const index = this.parent.players.indexOf(this);
    if (index > -1) {
      this.parent.players.splice(index, 1);
    }
    this._die = true;
    killCount += 1;
  }
}
class Player extends PlayerBase {
  constructor(color, parent, name = "love", pos = [0, 0], health = 42) {
    health = 10000;
    // color=0: [255, 255, 255],
    // color=1: [255, 255, 0],
    // color=2: [0, 0, 255],
    // color=3: [248, 147, 29],
    // color=4: [0, 255, 0],
    // color=5: [255, 0, 0],
    super(parent, pos, name, health);
    this.color = color;
    this.addComponent(component.animation);
    this.addComponent(component.rotation);
    this.punchHand = "right";

    this.recovery = 0.04;
    this.damage = 0.75;

    // physics circle for collision detection
    // DONE: this.circle should be a polygon
    this.circle = collisions.createCircle(
      { x: this.pos.x, y: this.pos.y },
      60 / 2
    );
    // this.circle = collisions.createPolygon({ x: this.pos.x, y: this.pos.y }, [
    //   { x: 75 / 2, y: 33 / 2 },
    //   { x: -75 / 2, y: 33 / 2 },
    //   { x: -70 / 2, y: -50 / 2 },
    //   { x: 70 / 2, y: -50 / 2 },
    // ]);

    this.circle.parent = this;
    collisions.updateBody(this.circle);
  }
  setPos(pos) {
    super.setPos(pos);

    // collisions.checkOne(this.circle, (response) => {
    //   const x = -response.overlapV.x;
    //   const y = -response.overlapV.y;
    //   const b = response.b.parent;
    //   const pushOut = createVector(x, y);
    //   if (response.b.parent instanceof Player) {
    //     const pushOut2 = createVector(x, y);
    //     pushOut.limit(5);
    //     pushOut2.limit(5);

    //     pushOut.setMag(pushOut.mag() * 0.6);
    //     pushOut2.setMag(pushOut2.mag() * -0.4);

    //     this.pos.add(pushOut);
    //     this.circle.setPosition(this.pos.x, this.pos.y);
    //     b.pos.add(pushOut2);
    //     b.circle.setPosition(b.pos.x, b.pos.y);
    //   } else if (response.b.parent instanceof Obstacle) {
    //     this.pos.add(pushOut);
    //     this.circle.setPosition(this.pos.x, this.pos.y);
    //   }
    // });
  }
  update() {
    super.update();
    // this.circle.setAngle(this.getAngle());
  }
  draw(options = {}) {
    push();
    translate(this.pos);
    if (options.body) {
      push();
      rotate(this.getAngle());
      if (this.punchHand === "left" && this.animateFrames !== 0) {
        scale(-1, 1);
        translate(-10, 0);
      }
      image(this.animation.getFrames(), 0, 0);
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
    return this.animation.onPunch();
  }
  startPunch(hand, target) {
    this.health -= 1;
    // animation
    this.animation.start();
    this.punchHand = hand || ["left", "right"][int(random(0, 2))];

    // effects to all players when punch: push them backwards and minus their health
    setTimeout(() => {
      target = target || collisions.getPunchAble(this);
      target.forEach((entity) => {
        // console.log(entity);
        if (!(entity instanceof Player)) {
          return;
        }
        // print("Hit players.AIs", i);

        entity.getHit();

        if (entity.health < 0) {
          entity.die();
          return;
        }
        // Push enemies backwards
        let start = millis();
        let jump = () => {
          let deltaT = (millis() - start) / 16 / 1.75;
          let d = p5.Vector.sub(this.pos, entity.pos);
          d.normalize();
          d.setMag(
            -d.mag() * Curve.f2(deltaT, 0.1, 0.6, 0.275) * 21 * this.damage - 3
          );
          entity.addPos(d);
        };
        jump();
        let id9 = setInterval(() => {
          jump();
        }, 16);

        setTimeout(() => {
          clearInterval(id9);
        }, 16 * 5);
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
