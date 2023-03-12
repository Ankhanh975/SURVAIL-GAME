class Chunk {
  cell = class {
    constructor(x, y, alive, lifeTime, collisionBox) {
      this.x = x; // 0 <= this.x < Chunk.size
      this.y = y; // 0 <= this.x < Chunk.size
      this.initTime = frameCount - lifeTime || 0;
      // Mutiple cells that sit next to each other can have the same collision box in a shape of a complex polygon. That is idealy it's to be so.
      // But the collision box work wonderful and fast and didn't need to be changed. Also I want to make the cell on and off dynamicly for the game.
      this.collisionBox = collisionBox || undefined;
      this.alive = alive || false;
    }
    kill() {
      this.alive = false;
      this.collisionBox = undefined;
    }
  };
  constructor(coords, system) {
    this.system = system;

    this.size = 16;
    this.cell_size = 52;
    this.coords = coords; // Example: [0, 0]
    this.grid = this.#create_matrix(this.size, this.size, this.cell);
    this.alive_cells = [];
    this.#initGrid();
    this.#initDraw();
    this.#initCollisionsMesh();
  }
  #initCollisionsMesh() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.grid[x][y].alive === true) {
          this.alive_cells.push(this.grid[x][y]);
          this.grid[x][y].collisionBox =
            this.system.system.collisions.createPolygon(
              {
                x: this.toWorldPos(this.grid[x][y])[0],
                y: this.toWorldPos(this.grid[x][y])[1],
              },
              [
                { x: 0 - 52 / 2, y: 0 - 52 / 2 },
                { x: 0 - 52 / 2, y: 52 - 52 / 2 },
                { x: 52 - 52 / 2, y: 52 - 52 / 2 },
                { x: 52 - 52 / 2, y: 0 - 52 / 2 },
              ]
            );
        }
      }
    }
  }
  destructor() {
    for (const cell of this.alive_cells) {
      if (cell.alive == true) {
        this.system.system.collisions.remove(cell.collisionBox);
        cell.kill();
      }
    }
  }

  #create_matrix(m, n, cell) {
    var result = [];
    for (var i = 0; i < n; i++) {
      var row = new Array();
      for (var l = 0; l < m; l++) {
        row.push(new cell(0, 0));
      }
      result.push(row);
    }
    return result;
  }
  #initDraw() {
    this.yellow_alive = createGraphics(52, 52);
    this.yellow_alive.push();
    this.yellow_alive.strokeWeight(1.5);
    this.yellow_alive.stroke(0, 0, 0, 240);
    this.yellow_alive.fill([220, 220, 10, 220]);
    this.yellow_alive.rect(0, 0, 52, 52, 3.5);
    this.yellow_alive.pop();

    this.yellow_half_alive = createGraphics(52, 52);
    this.yellow_half_alive.push();
    this.yellow_half_alive.strokeWeight(1.5);
    this.yellow_half_alive.stroke(0, 0, 0, 240);
    this.yellow_half_alive.fill([220, 220, 10, 110]);
    this.yellow_half_alive.rect(0, 0, 52, 52, 3.5);
    this.yellow_half_alive.pop();
  }
  #noiseFunction(x, y) {
    return (
      noisejs.simplex2(
        x / 35 + (this.coords[0] * this.size) / 35,
        y / 35 + (this.coords[1] * this.size) / 35
      ) +
      noise(
        x / 80 + (this.coords[0] * this.size) / 80,
        y / 80 + (this.coords[1] * this.size) / 80
      ) /
        3 +
      noise(
        x / 1000 + (this.coords[0] * this.size) / 1000,
        y / 1000 + (this.coords[1] * this.size) / 1000
      ) /
        10
    );
  }
  #thresholdFunction(x) {
    if ((0.6 < x && x < 1) || (-0.6 > x && x > -1)) {
      return true;
    } else {
      return false;
    }
  }
  #initGrid() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        let value = this.#noiseFunction(x, y);
        this.grid[x][y].x = x;
        this.grid[x][y].y = y;
        if (this.#thresholdFunction(value)) {
          this.grid[x][y].alive = true;
          this.grid[x][y].initTime = 10 ** 10;
        }
      }
    }
    return;
  }
  draw() {
    for (const cell of this.alive_cells) {
      if (cell.alive == true) {
        if (frameCount - cell.initTime < 30) {
          image(this.yellow_alive, ...this.toWorldPos(cell));
        } else if (frameCount - cell.initTime < 60) {
          image(this.yellow_half_alive, ...this.toWorldPos(cell));
        }
      }
    }
  }

  toWorldPos(cell) {
    const chunkSize = this.size * this.cell_size;
    let [x, y] = [
      (this.coords[0] + 0.5) * chunkSize,
      (this.coords[1] + 0.5) * chunkSize,
    ];
    x += cell.x * 52;
    y += cell.y * 52;
    return [x, y];
  }
}
class Chunks {
  constructor(center, system) {
    this.regionSize = 16 * 52;
    this.data = {};
    this.system = system;
    this.center = center || [0, 0];
    this.radius = 2;
    this.#initRegion();
  }
  #initRegion() {
    for (let x = -this.radius; x <= this.radius; x++) {
      for (let y = -this.radius; y <= this.radius; y++) {
        this.createChunk(this.center[0] + x, this.center[1] + y);
      }
    }
  }
  onCenterChange(NewX, NewY) {
    console.log("center changed", NewX, NewY, this.center[0], this.center[1]);
    let dX = NewX - this.center[0];
    let dY = NewY - this.center[1];
    const radious = this.radius;
    if ((dX == 1 || dX == -1) && dY == 0) {
      for (let x = -radious; x <= radious; x++) {
        this.createChunk(NewX + radious * dX, this.center[1] + x);
        this.deleteChunk(this.center[0] - radious * dX, this.center[1] + x);
      }
    } else if (dX == 0 && (dY == 1 || dY == -1)) {
      for (let y = -radious; y <= radious; y++) {
        this.createChunk(this.center[0] + y, NewY + radious * dY);
        this.deleteChunk(this.center[0] + y, this.center[1] - radious * dY);
      }
    } else if (dX == 1 && dY == 1) {
      for (let y = -radious; y <= radious - 1; y++) {
        this.createChunk(NewX + radious, NewY + y);
      }
      for (let x = -radious; x <= radious; x++) {
        this.createChunk(NewX + x, NewY + radious);
        this.deleteChunk(this.center[0] + x, this.center[1] - radious);
      }
      for (let y = -radious + 1; y <= radious; y++) {
        this.deleteChunk(this.center[0] - radious, this.center[1] + y);
      }
    } else if (dX == -1 && dY == -1) {
      for (let y = -radious; y <= radious - 1; y++) {
        this.createChunk(NewX - radious, NewY + y);
      }
      for (let x = -radious; x <= radious; x++) {
        this.createChunk(NewX + x, NewY - radious);
        this.deleteChunk(this.center[0] + x, this.center[1] + radious);
      }
      for (let y = -radious; y <= radious - 1; y++) {
        this.deleteChunk(this.center[0] + radious, this.center[1] + y);
      }
    } else if (dX == -1 && dY == 1) {
      for (let y = -radious; y <= radious - 1; y++) {
        this.createChunk(NewX - radious, NewY + y);
      }
      for (let x = -radious; x <= radious; x++) {
        this.createChunk(NewX + x, NewY + radious);
        this.deleteChunk(this.center[0] + x, this.center[1] - radious);
      }
      for (let y = -radious + 1; y <= radious; y++) {
        this.deleteChunk(this.center[0] + radious, this.center[1] + y);
      }
    } else if (dX == 1 && dY == -1) {
      for (let y = -radious + 1; y <= radious; y++) {
        this.createChunk(NewX + radious, NewY + y);
      }
      for (let x = -radious; x <= radious; x++) {
        this.createChunk(NewX + x, NewY - radious);
      }
      for (let y = -radious; y <= radious - 1; y++) {
        this.deleteChunk(this.center[0] - radious, this.center[1] + y);
      }
      for (let x = -radious; x <= radious; x++) {
        this.deleteChunk(this.center[0] + x, this.center[1] + radious);
      }
    }

    this.center = [NewX, NewY];
  }

  update(playerX, playerY) {
    let currentRegion = this.#posToChunkPos(playerX, playerY);
    if (
      currentRegion[0] !== this.center[0] ||
      currentRegion[1] !== this.center[1]
    ) {
      this.onCenterChange(...currentRegion);
      console.log(this.data);
    }
  }
  draw() {
    this.IterateOverRegions((region) => {
      region.draw();
      push();
      fill(255, 0, 0, 100);
      rect(
        (region.coords[0] + 0.5) * this.regionSize,
        (region.coords[1] + 0.5) * this.regionSize,
        55,
        55
      );
      pop();
    });
  }
  createChunk(x, y) {
    console.log("Creating chunk at " + x + " " + y);
    this.data[this.#encodeChunkPos(x, y)] = new Chunk([x, y], this);
  }
  deleteChunk(x, y) {
    if (this.data[this.#encodeChunkPos(x, y)] !== undefined) {
      this.data[this.#encodeChunkPos(x, y)].destructor();
      delete this.data[this.#encodeChunkPos(x, y)];
    } else {
      console.log(
        "Deleting chunk at " + x + " " + y,
        this.data[this.#encodeChunkPos(x, y)] + " unsucessful"
      );
    }
  }
  #encodeChunkPos(x, y) {
    return x + " " + y;
  }
  #decodeChunkPos(pos) {
    let data = pos.split(" ");
    return [int(data[0]), int(data[1])];
  }
  #posToChunkPos(playerX, playerY) {
    let x = floor((playerX - this.regionSize / 2) / this.regionSize);
    let y = floor((playerY - this.regionSize / 2) / this.regionSize);
    return [x, y];
  }
  IterateOverRegions(func) {
    for (const iterator in this.data) {
      func(this.data[iterator]);
    }
  }
}
