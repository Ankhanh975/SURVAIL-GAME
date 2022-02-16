class PlayerBase extends Base {
  constructor(settings) {
    super();
    this.parent = settings.parent || throwError("Invalid parent");
    settings.pos = settings.pos || [0, 0];
    this.name = settings.name || "";

    this.health = settings.health || 35;
    this.totalHealth = settings.totalHealth || settings.health || 35;
    this.health_percentage = this.health / this.totalHealth;
    this.recovery = settings.recovery || 0;
    this.damage = settings.damage || 1;

    this.#createCollisions(settings.pos);
  }
  #createCollisions(pos) {
    // physics in collision detection system
    // physics circle for collision detection
    // DONE: this.circle should be a polygon
    this.circle = collisions.createCircle(
      { x: pos[0], y: pos[1] },
      // PLAYING
      // 60 / 2
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
    return collisions;
  }
  update() {
    super.update();
    this.health += this.recovery;
    this.health = constrain(this.health, 0, this.totalHealth);
    this.health_percentage = this.health / this.totalHealth;
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
  constructor(settings) {
    super(settings);
    this.AIPlayer = false;
    this.color = settings.color || 0;

    // if (color === 0) this.color = [255, 255, 255];
    // else if (color === 1) this.color = [255, 255, 0];
    // else if (color === 2) this.color = [0, 0, 255];
    // else if (color === 3) this.color = [248, 147, 29];
    // else if (color === 4) this.color = [0, 255, 0];
    // else if (color === 5) this.color = [255, 0, 0];
    this.addComponent(component.animation);
    this.addComponent(component.rotation);
    this.addComponent(component.position);
    this.setPos({ x: settings.pos[0], y: settings.pos[1] });
    this.punchHand = "right";

    this.recovery = 0.04;
    this.damage = 0.75;

    {
      // this.random = random(0, 100) > 50 ? 1 : -1;
      // setInterval(() => {
      // this.random = random(0, 100) > 50 ? 1 : -1;
      // }, 1000);
      this.random = 1;
      setInterval(() => {
        this.random = this.random * -1;
      }, 1000 * 10);
      this.int = 0;
      this.int2 = 0;
    }
  }
  get pos() {
    return this.getPos();
  }
  // setPos(pos) {
  // super.setPos(pos);

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
  // }
  // update() {
  // super.update();
  // this.circle.setAngle(this.getAngle());
  // }
  draw(options = {}) {
    push();
    translate(this.pos);
    if (options.body) {
      this.animation.draw();
      // push();
      // rotate(this.getAngle());
      // if (this.punchHand === "left" && !this.animation.onPunch()) {
      //   scale(-1, 1);
      //   translate(-10, 0);
      // }
      // image(this.animation.getFrames(), 0, 0);
      // pop();
    }
    if (options.healthBar) {
      push();

      translate(-20, -35);
      strokeWeight(4);

      stroke(25, 25, 25, 150);
      rect(0, 0, 45, 1);

      strokeWeight(3);
      stroke(250, 50, 25);
      rect(0, 0, 45 * (this.health / this.totalHealth), 1);
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
          entity.addPos(d, false);
        };
        jump();
        for (let i = 1; i <= 5; i++) {
          setTimeout(() => {
            jump();
          }, 16 * i);
        }
      });
    }, 190);
  }
  getHit() {
    // animation
    this.setFreezeFor(150);
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
