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

    this.size = 50;
    this.cell_size = 52;
    this.coords = coords; // Example: [0, 0]
    this.grid = this.#create_matrix(this.size, this.size, this.cell);
    this.#initGrid();
    this.#initDraw();
    this.#initCollisionsMesh();
  }
  #initCollisionsMesh() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.grid[x][y].alive === true) {
          this.grid[x][y].collisionBox = this.system.collisions.createPolygon(
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
    return noisejs.simplex2(
      x / 20 + (this.coords[0] * 100) / 20,
      y / 20 + (this.coords[1] * 100) / 20
    );
  }
  #initGrid() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        let value = this.#noiseFunction(x, y);
        this.grid[x][y].x = x;
        this.grid[x][y].y = y;
        if (0.3 < value && value < 0.7) {
          this.grid[x][y].alive = true;
          this.grid[x][y].initTime = 10 ** 10;
        }
      }
    }
    return;
  }
  draw() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.grid[x][y].alive == true) {
          push();
          translate(...this.toWorldPos(this.grid[x][y]));
          if (frameCount - this.grid[x][y].initTime < 30) {
            image(this.yellow_alive, 0, 0);
          } else if (frameCount - this.grid[x][y].initTime < 60) {
            image(this.yellow_half_alive, 0, 0);
          } else {
            this.system.collisions.remove(this.grid[x][y].collisionBox);
            this.grid[x][y].kill();
          }
          pop();
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
