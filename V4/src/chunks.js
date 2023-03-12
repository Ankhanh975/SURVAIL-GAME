class Chunk {
  cell = class {
    constructor(x, y, alive, lifeTime, collisionBox) {
      this.x = x; // 0 <= this.x < Chunk.size
      this.y = y; // 0 <= this.x < Chunk.size
      this.initTime = frameCount - lifeTime || 0;
      this.system = undefined;
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
  super_cell = class {
    constructor(space, x, y, alive, lifeTime, collisionBox) {
      this.ocupied_space = space;
      this.polygon = undefined;
      this.area = undefined;
      this.x = x;
      this.y = y;
      this.initTime = frameCount - lifeTime || 0;
      this.collisionBox = collisionBox || undefined;
      this.alive = alive || false;
    }
    kill() {
      this.cells.forEach((cell) => {
        cell.kill();
      });
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

    function create_matrix(m, n, cell) {
      var result = [];
      for (var i = 0; i < n; i++) {
        var row = new Array(m).fill(cell);
        result.push(row);
      }
      return result;
    }
    this.super_cells = [];
    let mask = create_matrix(this.size, this.size, false);
    this.alive_cells.forEach((cell) => {
      if (mask[cell.x][cell.y] === false) {
        const super_cell_pos = Algritham(cell, this.grid);
        super_cell_pos.forEach((pos) => {
          mask[pos.x][pos.y] = true;
        });
        const super_cell_cells = super_cell_pos.map(
          (pos) => this.grid[pos.x][pos.y]
        );
        this.super_cells.push(new this.super_cell(super_cell_cells, 0, 0));
      }
    });
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
          this.grid[x][y].collisionBox.parent = this.grid[x][y];
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
    for (const super_cell of this.super_cells) {
      const color = 1;
      // const color = random(0, 1) > 0.5 ? true : false;
      for (const cell of super_cell.ocupied_space) {
        if (cell.alive == true) {
          if (color) {
            image(this.yellow_alive, ...this.toWorldPos(cell));
          } else {
            image(this.yellow_half_alive, ...this.toWorldPos(cell));
          }
        }
      }
    }
    // for (const cell of this.alive_cells) {
    //   if (cell.alive == true) {
    //     if (frameCount - cell.initTime < 30) {
    //       image(this.yellow_alive, ...this.toWorldPos(cell));
    //     } else if (frameCount - cell.initTime < 60) {
    //       image(this.yellow_half_alive, ...this.toWorldPos(cell));
    //     }
    //   }
    // }
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
    this.radius = 1;
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
function Algritham(start, grid) {
  function create_matrix(m, n, cell) {
    var result = [];
    for (var i = 0; i < n; i++) {
      var row = new Array(m).fill(cell);
      result.push(row);
    }
    return result;
  }
  function array_4_directions() {
    return [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ];
  }

  let to_fill = [];
  let final = [];
  let mask = create_matrix(grid.length, grid[0].length, false);
  if (grid[start.x][start.y].alive === false) {
    return [];
  } else {
    to_fill.push({ x: start.x, y: start.y });
  }
  while (to_fill.length > 0) {
    let to_fill2 = [];
    for (const pos of to_fill) {
      if (grid[pos.x][pos.y].alive === true && mask[pos.x][pos.y] === false) {
        mask[pos.x][pos.y] = true;
        final.push(pos);
        array_4_directions().forEach(([x, y], i) => {
          const nextIteration = { x: pos.x + x, y: pos.y + y };
          if (
            nextIteration.x >= 0 &&
            nextIteration.y >= 0 &&
            nextIteration.x < grid.length &&
            nextIteration.y < grid[0].length
          ) {
            if (
              grid[nextIteration.x][nextIteration.y].alive === true &&
              mask[nextIteration.x][nextIteration.y] === false
            ) {
              to_fill2.push(nextIteration);
            }
          }
        });
      }
    }
    to_fill = to_fill2;
  }

  return final;
}
