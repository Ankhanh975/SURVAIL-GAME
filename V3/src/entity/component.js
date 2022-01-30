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
  constructor() {
    // Represents In radians and in vector coordinates respectively
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
    angle = -angle;
    this.headTo.rotate(angle);

    this.angle = this.headTo.heading();
  };
  setAngle = (angle) => {
    this.lookAt = createVector(100, 0).rotate(angle).rotate(radians(90));
  };
  getAngle = () => {
    return this.angle;
  };
};
component.onController = class {
  update = () => {
    // console.log("update called", this);
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
        particle.move(1.5);
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

      this.parent.addPos(d);
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
