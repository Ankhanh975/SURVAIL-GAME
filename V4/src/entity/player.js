class Player {
  #Rotation = class {
    // limit rotation speed
    constructor() {
      this.target = createVector(100, 0);
      this.targetAngle = 0; // (radians)
      this.current = createVector(100, 0);
      this.currentAngle = 0; // (radians)
    }
    update() {
      // Limit max rotate to speed of radians(37.5) per update
      let angle = this.current.angleBetween(this.target);
      angle = constrain(angle, radians(-37.5), radians(37.5));

      this.current.rotate(-angle);
      this.currentAngle = this.target.heading();
    }
    setTarget(angle) {
      this.target.setHeading(angle);
      this.targetAngle = angle;
    }
    getCurrentAngle() {
      return this.currentAngle;
    }
  };
  #Physic = class {
    // Implement freeze response
    // potentialy to support acceleration
    constructor(pos) {
      this.pos = createVector(0, 0);
      this.isFreeze = false;
      this.circle = undefined;
    }
    getPos() {
      return this.pos;
    }
    setPos(pos) {
      if (this.isFreeze) return;
      this.pos.x = pos.x;
      this.pos.y = pos.y;
      this.circle.pos.x = this.pos.x;
      this.circle.pos.y = this.pos.y;
    }

    addPos(pos) {
      if (this.isFreeze) return;
      this.pos.x += pos.x;
      this.pos.y += pos.y;
      this.circle.pos.x = this.pos.x;
      this.circle.pos.y = this.pos.y;
    }
    setFreezeFor(sec) {
      if (this.isFreeze === false) {
        this.isFreeze = true;
        setTimeout(() => {
          this.isFreeze = false;
        }, sec * 1000);
      }
    }
    addCollisionBox(collisions) {
      this.circle = collisions.createCircle(
        { x: this.pos.x, y: this.pos.y },
        60 / 2
      );
      this.circle.parent = this.parent;
      collisions.updateBody(this.circle);
    }
    isFreeze() {
      return this.isFreeze;
    }
  };
  #Proprties = class {
    constructor(settings) {
      this.health = 35;
      this.totalHealth = 35;
      this.health_percentage = this.health / this.totalHealth;
      this.recovery = 0.04;
      this.damage = 0.75;
      this.alive = true;
      this.color = 0;
      this.name = settings.name || "";
    }
    update() {
      this.health += this.recovery;
      this.health = constrain(this.health, 0, this.totalHealth);
      this.health_percentage = this.health / this.totalHealth;
      if (this.health_percentage < 0) {
        this.alive = false;
      }
    }
  };
  #Animation = class {
    constructor() {
      this.animateFrames = 0;
      this.punchHand = "right";
    }
    start() {
      this.animateFrames = 1;
      this.punchHand = ["left", "right"][int(random(0, 2))];
      setTimeout(() => {
        this.animateFrames = 2;
      }, 80 * 1);
      setTimeout(() => {
        this.animateFrames = 3;
      }, 80 * 2);
      setTimeout(() => {
        this.animateFrames = 4;      }, 80 * 3);
      setTimeout(() => {
        this.animateFrames = 5;
      }, 80 * 4);
      setTimeout(() => {
        this.animateFrames = 0;
        this.punchHand = "right";
      }, 80 * 5);
    }
    getFrame() {
      return this.animateFrames;
    }
    onPunch() {
      return this.animateFrames !== 0;
    }
  };
  constructor(settings, system) {
    console.log("settings: ", settings, "system", system, "this", this);
    this.system = system;
    this.system.addEntity(this);

    this.physic = new this.#Physic(settings.pos || createVector(0, 0));
    this.rotation = new this.#Rotation();
    this.proprties = new this.#Proprties(settings);
    this.animation = new this.#Animation();

    this.physic.parent = this;
    this.rotation.parent = this;
    this.proprties.parent = this;

    this.physic.addCollisionBox(collisions);
  }
  update() {
    if (!this.proprties.alive) return;
    this.rotation.update();
    this.proprties.update();
  }

  die() {
    collisions.remove(this.circle);
    this.system.removeEntity(this);
    this.proprties.alive = false;
  }
  draw(options = {}) {
    push();
    translate(this.physic.pos);

    const angle = this.rotation.getCurrentAngle() + radians(90);
    const health = this.proprties.health_percentage;
    const img = Players_img[this.proprties.color][this.animation.getFrame()];
    push();
    ctx.globalAlpha = Curve.f3(health);
    rotate(angle);
    if (this.animation.punchHand === "left" && this.animation.onPunch()) {
      scale(-1, 1);
      translate(-10, 0);
    }
    image(img, 0, 0);
    pop();
    if (options.healthBar) {
      push();

      translate(-20, -35);
      strokeWeight(4);

      stroke(25, 25, 25, 150);
      rect(0, 0, 45, 1);

      strokeWeight(2);
      stroke(250, 50, 25);
      rect(0, 0, 45 * this.proprties.health_percentage, 2);
      pop();
    }
    if (options.nameTag) {
      push();

      translate(2, -18);

      textFont(myFont);
      textAlign(CENTER);
      textSize(21);
      stroke(0, 0, 0);
      strokeWeight(0);
      fill(255, 255, 255);
      text(this.proprties.name, 0, 0);

      pop();
    }
    pop();
  }
  onPunch() {
    return this.animation.onPunch();
  }
  startPunch(target) {
    this.health -= 1;
    this.animation.start();

    // effects to players getting punch: push them backwards and minus their health
    setTimeout(() => {
      target = target || collisions.getPunchAble(this);
      target.forEach((entity) => {
        if (!(entity instanceof Player)) {
          return;
        }
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
    this.physic.setFreezeFor(0.15);
    this.proprties.health -= 13;
    if (this.proprties.health >= 0) {
      for (let i = 0; i < 4; i++) {
        this.system.createSparks(
          [this.physic.pos.x, this.physic.pos.y],
          [200, 50, 50],
          3.6
        );
      }
    } else {
      for (let i = 0; i < 4; i++) {
        sparks.createSparks(
          this.physic.pos.x,
          this.physic.pos.y,
          [0, 0, 0],
          3.6
        );
      }
    }
  }
}
class OnControllerPlayer extends Player {
  constructor(settings, system) {
    super(settings, system);
    this.jumpCooldown = 0;
    document.body.addEventListener("keydown", (event) => {
      if (event.key == " ") {
        // console.log(this.physic.pos.x, this.physic.pos.y);
        if (this.jumpCooldown > 0) return;
        this.#jump();
        this.jumpCooldown = 20;
      }
    });
  }

  update() {
    super.update();
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.physic.addPos(createVector(-7, 0));
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.physic.addPos(createVector(7, 0));
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.physic.addPos(createVector(0, -7));
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.physic.addPos(createVector(0, 7));
    }
    this.rotation.target.x = mouseX - width / 2;
    this.rotation.target.y = mouseY - height / 2;
  }
  #jump() {
    let start = millis();
    let _jump = () => {
      player.proprties.health -= player.proprties.totalHealth / 200;

      for (let i = 0; i < 14; i++) {
        player.system
          .createSparks(
            [player.physic.pos.x, player.physic.pos.y],
            [0, 0, 0],
            random(3, 3.75)
          )
          .move(0, 1);
      }
      let d = createVector(0, 0);
      // change listener to useable for all entities
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) d.add(createVector(-30, 0));
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) d.add(createVector(30, 0));
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) d.add(createVector(0, -30));
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) d.add(createVector(0, 30));

      let deltaT = (millis() - start) / 25 - 0.15;
      d.setMag(150 * Curve.f(deltaT) + 3);

      player.physic.addPos(d);
      collisions.updateBody(player.physic.circle);
    };

    _jump();
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        _jump(this);
      }, 16 * i);
    }
  }
}
