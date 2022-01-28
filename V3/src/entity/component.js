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
    this.mousePos = createVector(0, 0);
    this.mouseDown = false;
    this.mousePosHistory = [];
    this.to_fill = [];
    this.getRealPos = (x, y) => {
      x = x - width / 2 + this.parent.pos.x;
      y = y - height / 2 + this.parent.pos.y;
      // [x, y] = obstacles.grid.GridCoordsToWorldCoords(
      //   ...obstacles.grid.WorldCoordsToGridCoords(x, y)
      // );
      // [x, y] = [x + 52 / 2, y + 52 / 2];
      return { x: x, y: y };
    };
    canvas = document.querySelector("#defaultCanvas0");

    document.addEventListener("mousedown", (event) => {
      if (event.button === 2) {
        this.mouseDown = true;
        this.mousePos = this.getRealPos(event.clientX, event.clientY);
        this.mousePosHistory.push(this.mousePos);
      }
    });
    document.addEventListener("mouseup", (event) => {
      if (event.button === 2) {
        this.mouseDown = false;
        this.mousePosHistory = [];
      }
    });
    canvas.addEventListener("mousemove", (event) => {
      this.mousePos = this.getRealPos(event.clientX, event.clientY);

      if (!this.mouseDown) {
        return;
      }
      this.mousePosHistory.push(this.mousePos);

      if (this.mousePosHistory.length > 2) {
        this.mousePosHistory.shift();
      }
    });
  }
  update = () => {
    // Fill all positions from current mouse position and last mouse position
    // console.log(this.mouseDown, this.mousePos);
    // console.log(this.to_fill.length);
    let solve = 0;
    if (this.to_fill.length > 300) {
      this.to_fill = [];
    }
    for (let i = 0; i < this.to_fill.length; i++) {
      if (solve >= 2) {
        break;
      }
      let pos = this.to_fill.shift();
      // console.log(pos);
      let ob = obstacles.createObstacle({
        x: obstacles.grid.GridCoordsToWorldCoords(...pos)[0],
        y: obstacles.grid.GridCoordsToWorldCoords(...pos)[1],
      });
      if (ob) {
        solve += 1;
        if (obstacles.grid.get(pos[0] - 1, pos[1]) === false) {
          this.to_fill.push([pos[0] - 1, pos[1]]);
        }
        if (obstacles.grid.get(pos[0], pos[1] - 1) === false) {
          this.to_fill.push([pos[0], pos[1] - 1]);
        }
        if (obstacles.grid.get(pos[0], pos[1] + 1) === false) {
          this.to_fill.push([pos[0], pos[1] + 1]);
        }
        if (obstacles.grid.get(pos[0] + 1, pos[1]) === false) {
          this.to_fill.push([pos[0] + 1, pos[1]]);
        }
      }
    }

    if (!this.mouseDown) {
      return;
    }
    let path;

    if (this.mousePosHistory.length === 1) {
      path = [this.mousePosHistory[0]];
    } else if (this.mousePosHistory.length >= 2) {
      let pGridStart = obstacles.grid.WorldCoordsToGridCoords(
        this.mousePosHistory[0].x,
        this.mousePosHistory[0].y
      );
      let pGridEnd = obstacles.grid.WorldCoordsToGridCoords(
        this.mousePosHistory[1].x,
        this.mousePosHistory[1].y
      );
      path = lineBresenham_1(...pGridStart, ...pGridEnd);
      path = path.map((each) => {
        each = obstacles.grid.GridCoordsToWorldCoords(...each);
        each[0] += 52 / 2;
        each[1] += 52 / 2;
        each = { x: each[0], y: each[1] };
        return each;
      });
      path = lineBresenham_1(
        this.mousePosHistory[this.mousePosHistory.length - 1].x,
        this.mousePosHistory[this.mousePosHistory.length - 1].y,
        this.mousePosHistory[this.mousePosHistory.length - 2].x,
        this.mousePosHistory[this.mousePosHistory.length - 2].y
      );
      path = path.map((each) => {
        each = { x: each[0], y: each[1] };
        return each;
      });
    } else if (this.mousePosHistory.length >= 3) {
      // path = bezierCurve(
      //   this.mousePosHistory[this.mousePosHistory.length - 1].x,
      //   this.mousePosHistory[this.mousePosHistory.length - 1].y,
      //   this.mousePosHistory[this.mousePosHistory.length - 2].x,
      //   this.mousePosHistory[this.mousePosHistory.length - 2].y,
      //   this.mousePosHistory[this.mousePosHistory.length - 3].x,
      //   this.mousePosHistory[this.mousePosHistory.length - 3].y
      // );
      // path = [
      //   { x: 0, y: 0 },
      //   { x: 100, y: 100 },
      //   { x: 200, y: 200 },
      //   { x: 300, y: 300 },
      // ];
    }
    sparks.create_particle(this.mousePos, [9, 200, 9]);
    // obstacles.createObstacle(this.mousePos);
    // console.log(path.length, JSON.stringify(path));

    path.forEach((point) => {
      const ob = obstacles.createObstacle(point);
      if (!ob) {
        return;
      }
      const ob_pos = obstacles.grid.WorldCoordsToGridCoords(
        ob.circle.pos.x,
        ob.circle.pos.y
      );
      setTimeout(() => {
        if (obstacles.grid.isInIsolate(ob_pos[0] - 1, ob_pos[1] - 1)) {
          this.to_fill.push([ob_pos[0] - 1, ob_pos[1] - 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] - 1, ob_pos[1])) {
          this.to_fill.push([ob_pos[0] - 1, ob_pos[1]]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] - 1, ob_pos[1] + 1)) {
          this.to_fill.push([ob_pos[0] - 1, ob_pos[1] + 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0], ob_pos[1] - 1)) {
          this.to_fill.push([ob_pos[0], ob_pos[1] - 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0], ob_pos[1] + 1)) {
          this.to_fill.push([ob_pos[0], ob_pos[1] + 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] + 1, ob_pos[1] - 1)) {
          this.to_fill.push([ob_pos[0] + 1, ob_pos[1] - 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] + 1, ob_pos[1])) {
          this.to_fill.push([ob_pos[0] + 1, ob_pos[1]]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] + 1, ob_pos[1] + 1)) {
          this.to_fill.push([ob_pos[0] + 1, ob_pos[1] + 1]);
        }
      }, 20);
    });
  };
};
