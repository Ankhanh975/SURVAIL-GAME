// The system will be responsible for managing the game loop and the game state.

class Spark {
  //  By https://www.youtube.com/watch?v=wNMRq_uoWM0
  constructor(loc, angle, speed, color, scale = 1) {
    this.pos = { x: loc[0], y: loc[1] };
    this.angle = angle;
    this.speed = speed;
    this.scale = scale;
    this.color = color;
    this.alive = true;
  }
  point_towards(angle, rate) {
    rotate_direction = ((angle - this.angle + PI * 3) % (PI * 2)) - PI;
    let rotate_sign = abs(rotate_direction) / rotate_direction;
    if (rotate_sign === NaN) {
      rotate_sign = 1;
    }
    if (abs(rotate_direction) < rate) this.angle = angle;
    else this.angle += rate * rotate_sign;
  }
  calculate_movement(dt) {
    return [
      Math.cos(this.angle) * this.speed * dt,
      Math.sin(this.angle) * this.speed * dt,
    ];
  }
  move(dt) {
    let movement = this.calculate_movement(dt);
    this.pos.x += movement[0];
    this.pos.y += movement[1];

    this.speed -= 0.085 + 0.025 * this.speed;
    this.angle += 0.075;
    if (this.speed <= 0) {
      this.alive = false;
    }
  }
  draw() {
    if (!this.alive) {
      return;
    }
    let scale = this.speed * this.scale;
    let points = [
      [
        this.pos.x + cos(this.angle) * scale,
        this.pos.y + sin(this.angle) * scale,
      ],
      [
        this.pos.x + cos(this.angle + PI / 2) * scale * 0.3,
        this.pos.y + sin(this.angle + PI / 2) * scale * 0.3,
      ],
      [
        this.pos.x - cos(this.angle) * scale * 3.5,
        this.pos.y - sin(this.angle) * scale * 3.5,
      ],
      [
        this.pos.x + cos(this.angle - PI / 2) * scale * 0.3,
        this.pos.y - sin(this.angle + PI / 2) * scale * 0.3,
      ],
    ];
    this.#polygon(points);
  }
  #polygon(points) {
    push();
    fill(...this.color);
    stroke(...this.color);
    beginShape();
    for (let point of points) vertex(...point);
    endShape();
    pop();
  }
}

class System {
  #ZoomScope = class {
    #AverageTer = class {
      constructor(averageOver = 15) {
        this.averageOver = averageOver;
        this.data = new Array(averageOver).fill(0);
      }
      update(newSensorData) {
        if (this.data.length > this.averageOver) {
          this.data.shift();
        }
        this.data.push(newSensorData);
      }
      get() {
        let total = 0;
        this.data.forEach((value) => {
          total += value;
        });
        return total / this.data.length;
      }
    };
    constructor() {
      this.averageTer = new this.#AverageTer();
      this.scaleCoefficient = 1;
    }
    update() {
      setTimeout(() => {
        this.averageTer.update(int(this.isOnEdge()));
      }, 16 * 13);
      this.scaleCoefficient = -this.averageTer.get() / 1.55 + 1;
      scale(this.scaleCoefficient);
    }

    isOnEdge() {
      let onEdge = 0;
      if (abs(mouseX - width) < 30) {
        onEdge = 1;
      }
      if (abs(mouseX) < 30) {
        onEdge = 1;
      }
      if (abs(mouseY - height) < 30) {
        onEdge = 1;
      }
      if (abs(mouseY) < 30) {
        onEdge = 1;
      }
      return onEdge;
    }
  };
  #createFPSMetering() {
    return new FPSMeter(null, {
      graph: 1,
      decimals: 0,
      heat: 1,
      smoothing: 1,
      position: "absolute",
      zIndex: 10,
      left: "17px",
      top: "8px",
      right: "auto",
      bottom: "auto",
      margin: "0 0 0 0",
    });
  }
  throwError(str) {
    throw new Error(str);
  }
  constructor() {
    this.tileSize = 233;
    frameRate(60);
    this.fpsMeter = this.#createFPSMetering();
    this.collisions = new Collisions2();
    this.zoomScope = new this.#ZoomScope();

    this.centerChunk = [0, 0];
    this.activeChunksRadius = 5;
    this.backgroundIMG = backgroundIMG;

    this.sparks = [];
    this.movingEntities = [];
  }
  addEntity(entity) {
    this.movingEntities.push(entity);
  }
  removeEntity(entity) {
    this.movingEntities.splice(this.movingEntities.indexOf(entity), 1);
  }
  update() {
    translate(width / 2, height / 2);
    imageMode(CENTER);
    this.#updateSparks();
    this.fpsMeter.tick();
    this.#updateCollisions();
    this.zoomScope.update();

    if (this.movingEntities.length > 0) {
      this.centerChunk = this.PosToTileCoord(this.movingEntities[0].physic.pos);
    }
    this.activeChunksRadius = int(6 / this.zoomScope.scaleCoefficient);
  }
  draw() {
    noSmooth();
    background(100);
    this.#drawBackground();

    this.#drawSparks();
  }
  #updateCollisions() {
    this.collisions.update();
    for (let i = 0; i < 3; i++) {
      for (const player of this.movingEntities) {
        this.collisions.checkOne(player.physic.circle, (response) => {
          const a = player;
          const b = response.b.parent;
          let x = -response.overlapV.x;
          let y = -response.overlapV.y;
          x = min(x, 14);
          y = min(y, 14);

          if (b instanceof Player) {
            const effects = 0.4;
            a.addPos(
              { x: x * (1.01 - effects), y: y * (1.01 - effects) },
              false
            );
            b.addPos({ x: -(x * effects), y: -(y * effects) }, false);

            const vec = a.rotation.headTo.copy();
            vec.rotate(radians(a.random * 90)).setMag(0.4);
            a.addPos(vec);
          } else a.physic.addPos({ x: x * 1.1, y: y * 1.1 }, false);
        });
      }
    }
  }
  #updateSparks() {
    for (var i = this.sparks.length - 1; i >= 0; i--) {
      this.sparks[i].move(1);

      if (!this.sparks[i].alive) {
        this.sparks.splice(i, 1);
      }
    }
  }
  #drawSparks() {
    for (let spark of this.sparks) {
      spark.draw();
    }
  }
  createSparks(loc, color = [240, 20, 20], scale = 2.1, speed = null) {
    let angle = random(radians(0), radians(360));
    if (speed === null) {
      speed = random(3, 4);
    }
    let n = new Spark(loc, angle, speed, color, scale);
    this.sparks.push(n);
    return n;
  }
  #drawBackground() {
    push();
    translate(...this.tileCoordToPos(...this.centerChunk));
    for (
      let x = this.centerChunk[0] - this.activeChunksRadius;
      x < this.centerChunk[0] + this.activeChunksRadius;
      x++
    ) {
      for (
        let y = this.centerChunk[1] - this.activeChunksRadius;
        y < this.centerChunk[1] + this.activeChunksRadius;
        y++
      ) {
        this.#drawChunk(x, y);
      }
    }
    pop();
  }
  #drawChunk(x, y) {
    image(this.backgroundIMG, ...this.tileCoordToPos([x, y]));
  }

  drawMenu(text) {
    push();
    translate(width / 2 - 205, height / 4 - 400);
    stroke(50, 50, 50, 125);
    strokeWeight(3);
    fill(200, 200, 200, 125);
    rect(0, 0, 200, 325, 3);

    translate(20, 45);
    textFont(myFont);

    textSize(25);
    strokeWeight(0);
    fill(0, 0, 0, 255);
    canva.text(text, 0, 0);

    pop();
  }
  tileCoordToPos(coord) {
    return [(coord[0] + 0.5) * this.tileSize, (coord[1] + 0.5) * this.tileSize];
  }
  PosToTileCoord(pos) {
    return [floor(pos.x / this.tileSize), floor(pos.y / this.tileSize)];
  }
}
