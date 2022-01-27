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
      // TODO=change listener to useable for all entities
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
component.placeObstacle = class {
  // TODO: if move mouse to fast path will not be filled in
  constructor() {
    this.mouse = createVector(0, 0);
    canvas = document.querySelector("#defaultCanvas0");
    canvas.addEventListener("mousemove", (event) => {
      this.mouse = camera.toWorldCoords([event.clientX, event.clientY]);
      if (!isPressed2) {
        return;
      }
      // sparks.create_particle(this.mouse, [9, 200, 9]);
      obstacles.createObstacle(this.mouse);

      // let pGridStart = obstacles.grid.WorldCoordsToGridCoords(mouse.x, mouse.y);
      // let pGridEnd = obstacles.grid.WorldCoordsToGridCoords(
      //   mousePos[mousePos.length - 1][0],
      //   mousePos[mousePos.length - 1][1]
      // );
      // let path = lineBresenham_1(...pGridStart, ...pGridEnd);
      // path = path.map((each) => {
      //   each = obstacles.grid.GridCoordsToWorldCoords(...each);
      //   each[0] += 52 / 2;
      //   each[1] += 52 / 2;
      //   return each;
      // });
      // console.log(path);
      // path.forEach((point) => {
      //   obstacles.createObstacle(createVector(point[0], point[1]));
      // });
      // obstacles.createObstacle(mouse);
    });
    // canvas.addEventListener("mousemove", (event) => {});
  }
  update = () => {
    if (!isPressed2) {
      return;
    }
    sparks.create_particle(this.mouse, [9, 200, 9]);
    obstacles.createObstacle(this.mouse);
  };
};