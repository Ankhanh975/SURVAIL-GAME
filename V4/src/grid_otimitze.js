class Chunk {
  cell = class {
    constructor(x, y, alive) {
      this.x = x;
      this.y = y;
      this.alive = alive || false;
      this.hasGroup = false;
    }
  };
  cave = class {
    constructor(cells) {
      this.cells = cells;
      this.poligons = [];
      this.#initPoligons();
    }
    #initPoligons() {
      for (const cell of this.cells) {
      }
    }
  };
  constructor(coords) {
    this.size = 16;
    this.cell_size = 52;
    this.coords = coords;
    this.grid = this.#create_matrix(this.size, this.size, this.cell);
    this.alive_cells = [];
    this.#initGrid();
    this.#initDraw();
  }
  #initDraw() {
    this.yellow_alive = createGraphics(52, 52);
    this.yellow_alive.push();
    this.yellow_alive.strokeWeight(1.5);
    this.yellow_alive.stroke(0, 0, 0, 240);
    this.yellow_alive.fill([220, 220, 10, 220]);
    this.yellow_alive.rect(0, 0, 52, 52, 3.5);
    this.yellow_alive.pop();
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
        image(this.yellow_alive, ...this.toWorldPos(cell));
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
