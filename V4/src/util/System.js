// The system will be responsible for managing the game loop and the game state.

chunkSize = 233;

function createFPSMetering() {
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


function throwError(str) {
  throw new Error(str);
}

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
  constructor() {
    frameRate(60);
    this.fpsMeter = createFPSMetering();

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
    this.#updateSpark();
    this.fpsMeter.tick();
    if (this.movingEntities.length > 0) {
      this.centerChunk = this.PosToChunkCoord(
        this.movingEntities[0].physic.pos
      );
    }
  }
  draw() {
    noSmooth();
    this.#drawBackground();
    this.#drawMenu(
      `\
Testing, ${frameCount}
  `
    );
    this.#drawSpark();
  }
  #updateSpark() {
    for (var i = this.sparks.length - 1; i >= 0; i--) {
      this.sparks[i].move(1);

      if (!this.sparks[i].alive) {
        this.sparks.splice(i, 1);
      }
    }
  }
  #drawSpark() {
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
    translate(...this.ChunkCoordToPos(...this.centerChunk));
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
    image(this.backgroundIMG, ...this.ChunkCoordToPos([x, y]));
  }
  #drawMenu(text) {
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
  ChunkCoordToPos(coord) {
    return [(coord[0] + 0.5) * chunkSize, (coord[1] + 0.5) * chunkSize];
  }
  PosToChunkCoord(pos) {
    return [floor(pos.x / chunkSize), floor(pos.y / chunkSize)];
  }
}
