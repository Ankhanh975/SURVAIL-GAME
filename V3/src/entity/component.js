const component = {};
component.base = class {
  name = "base";
  constructor() {
    this.x = 0;
  }
  update = () => {};
  getX = () => {
    return this.x;
  };
};

component.rotation = class {
  // limit rotation speed
  name = "rotation";
  constructor() {
    // Represents In radians and in vector coordinates respectively
    // TODO: add acceleration to this rotation component
    this.angle = 0;
    this.headTo = createVector(100, 0);
    this.lookAtAngle = 0;
    this.lookAt = createVector(100, 0);
  }
  update = () => {
    // Limit max rotate to speed of radians(37.5) per update
    let heading = this.lookAt;
    let angle = heading.angleBetween(this.headTo);
    angle = constrain(angle, radians(-35), radians(35));
    this.headTo.rotate(-angle);

    this.angle = this.headTo.heading();
  };
  setAngle = (angle) => {
    this.lookAt.setHeading(angle);
  };
  getAngle = () => {
    // Carefully because the angle original may be Vector(100, 0)
    // or Vector(0, -100) for different system(drawing and collision detection);
    return this.angle;
  };
};
component.position = class {
  // limit moving speed
  // TODO: add acceleration to speed calculation
  constructor() {
    this.pos = createVector(0, 0);
    // this.lastPos = createVector(0, 0);
    this.isFreeze = false;
    // this.velocity = createVector(0, 0);
    this.velocity_length = 0;
    // this.acceleration = createVector(0, 0);
  }
  update = () => {};
  getPos = () => {
    return this.pos;
  };
  setPos = (pos, checkFreeze = true) => {
    if (checkFreeze && this.isFreeze) {
      return;
    }
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.parent.circle.pos.x = this.pos.x;
    this.parent.circle.pos.y = this.pos.y;
    // this.parent.circle.setPosition(this.pos.x, this.pos.y);
  };

  addPos = (pos, checkFreeze = true) => {
    if (checkFreeze && this.isFreeze) {
      return;
    }
    this.pos.x += pos.x;
    this.pos.y += pos.y;
    this.parent.circle.pos.x = this.pos.x;
    this.parent.circle.pos.y = this.pos.y;
    // this.parent.circle.setPosition(this.pos.x, this.pos.y);
  };
  setFreezeFor = (milliseconds) => {
    if (this.isFreeze === false) {
      this.isFreeze = true;
      setTimeout(() => {
        this.isFreeze = false;
      }, milliseconds);
    }
  };
  _isFreeze = () => {
    return this.isFreeze;
  };
};
component.onController = class {
  update = () => {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.parent.addPos(createVector(-7, 0));
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.parent.addPos(createVector(7, 0));
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.parent.addPos(createVector(0, -7));
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.parent.addPos(createVector(0, 7));
    }
  };
};
component.jump = class {
  jump = () => {
    let start = millis();
    let _jump = () => {
      this.parent.health -= this.parent.totalHealth / 200;
      for (let i = 0; i < 14; i++) {
        let particle = sparks.create_particle(this.parent.pos, [0, 0, 0], 3.5);
        if (particle) {
          particle.move(1.5);
        }
      }
      let d = createVector(0, 0);
      // change listener to useable for all entities
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        d.add(createVector(-30, 0));
      }
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        d.add(createVector(30, 0));
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        d.add(createVector(0, -30));
      }
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        d.add(createVector(0, 30));
      }
      // let delta = p5.Vector.sub(this.parent.pos, this.parent.lastPos);
      // if (delta.mag() < 1) {
      //   return;
      // }

      let deltaT = (millis() - start) / 25 - 0.175;
      d.setMag(150 * Curve.f(deltaT) + 3);

      this.parent.addPos(d, false);
      collisions.updateBody(this.parent.circle);
    };
    // console.log(this, start, _jump);

    _jump();
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        _jump();
      }, 16 * i);
    }
  };
};
