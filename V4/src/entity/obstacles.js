class Obstacles {
  constructor() {
    this.obstacles = [];
    this.grid = new Grid();
    this.initSpite();
  }
  initSpite() {
    this.obstacles_surface = createGraphics(52, 52);

    this.obstacles_surface.push();
    this.obstacles_surface.strokeWeight(1.5);
    this.obstacles_surface.stroke(0, 0, 0, 240);
    this.obstacles_surface.fill([220, 220, 10, 220]);
    this.obstacles_surface.rect(0, 0, 52, 52, 3.5);
    this.obstacles_surface.pop();

    this.obstacles_surface2 = createGraphics(52, 52);

    this.obstacles_surface2.push();
    this.obstacles_surface2.strokeWeight(1.5);
    this.obstacles_surface2.stroke(0, 0, 0, 240);
    this.obstacles_surface2.fill([220, 220, 10, 110]);
    this.obstacles_surface2.rect(0, 0, 52, 52, 3.5);
    this.obstacles_surface2.pop();
  }

  FindPath(posStart, posEnd) {
    let pGridStart = this.grid.WorldCoordsToGridCoords(posStart.x, posStart.y);
    let pGridEnd = this.grid.WorldCoordsToGridCoords(posEnd.x, posEnd.y);
    let path = obstacles.grid.FindPath(...pGridStart, ...pGridEnd);

    // console.log("old", path);
    path = path.map((each) => {
      each = this.grid.GridCoordsToWorldCoords(...each);
      each[0] += 52 / 2;
      each[1] += 52 / 2;
      return each;
    });

    // console.log("path", path);

    // Because a* pathfinding work not on continuous coordinates so have to go to connected points
    path.unshift([posStart.x, posStart.y]);
    path.push([posEnd.x, posEnd.y]);
    if (
      (path[0][0] - path[1][0] < 0 && path[0][0] - path[2][0] > 0) ||
      (path[0][1] - path[1][1] < 0 && path[0][1] - path[2][1] > 0) ||
      (path[0][0] - path[1][0] > 0 && path[0][0] - path[2][0] < 0) ||
      (path[0][1] - path[1][1] > 0 && path[0][1] - path[2][1] < 0)
    ) {
      path.shift();
      path.shift();
      path.unshift([posStart.x, posStart.y]);

      // let r = path.slice(1, 1);
      // console.log("r", JSON.stringify(r));
    }
    return path;
  }
  createObstacle(pos, lifeTime = true) {
    pos = createVector(pos.x, pos.y);

    [pos.x, pos.y] = this.grid.GridCoordsToWorldCoords(
      ...this.grid.WorldCoordsToGridCoords(pos.x, pos.y)
    );
    // ob.circle maybe inserted is overlap with something
    let gridPos = this.grid.WorldCoordsToGridCoords(pos.x, pos.y);
    if (this.grid.get(gridPos[0], gridPos[1]) === true) {
      // This cell is already in the grid
      return null;
    }
    let ob = new Obstacle({ pos: pos, parent: this, lifeTime: lifeTime });
    const potentials = collisions.getPotentials(ob.circle);
    const collided = potentials.some((body) => {
      if (body.parent instanceof Obstacle || body.parent instanceof Player) {
        if (collisions.checkCollision(ob.circle, body)) {
          return true;
        }
      }
    });

    if (collided) {
      collisions.remove(ob.circle);
      return null;
    } else {
      this.obstacles.push(ob);
      this.grid.set(gridPos[0], gridPos[1], true);
      return ob;
    }
  }
  update() {
    for (const obstacle of this.obstacles) {
      obstacle.update();
    }
  }
  draw() {
    push();
    {
      for (const obstacle of this.obstacles) {
        if (
          player.pos.x - obstacle.pos.x > 1000 ||
          player.pos.x - obstacle.pos.x < -1000 ||
          player.pos.y - obstacle.pos.y > 600 ||
          player.pos.y - obstacle.pos.y < -600
        ) {
          continue;
        }
        obstacle.draw();
      }
    }

    pop();
    return;
  }
  initObstacles(size = 60) {
    {
      let chunkX = 0;
      let chunkY = 0;
      for (let x = 50 - size / 2; x < 50 + size / 2; x++) {
        for (let y = 50 - size / 2; y < 50 + size / 2; y++) {
          let value = noisejs.simplex2(
            x / 20 + (chunkX * 100) / 20,
            y / 20 + (chunkY * 100) / 20
          );
          if (value > 0.3 && value < 0.7) {
            const pos = this.grid.GridCoordsToWorldCoords(x, y);
            this.createObstacle({ x: pos[0], y: pos[1] }, false);
          }
        }
      }
    }
    return;
  }
  initNormal() {
    this.allNormal = [];
    this.obstacles.forEach((obstacle) => {
      const _gridCoords = this.grid.WorldCoordsToGridCoords(
        obstacle.pos.x,
        obstacle.pos.y
      );
      const gridCoords = { x: _gridCoords[0], y: _gridCoords[1] };
      const vec = getNormal(this.grid, gridCoords);

      obstacle.setNormal(vec);
      if (!vec) {
        return;
      }
      degrees;
      const vec2 = vec.copy().setMag(35);
      const end = p5.Vector.add(vec2, obstacle.pos);
      this.allNormal.push(
        `line(${obstacle.pos.x}, ${obstacle.pos.y}, ${end.x}, ${end.y})`
      );
    });
  }
}

function getNormal(grid, pos) {
  // Normal is a vector with 8 unique values in 8 direction.
  // Point to the closest point that is not inside a wall
  const x = pos.x;
  const y = pos.y;
  const state = grid.get(x, y);
  function addDirection(vec, direction) {
    const n = createVector(...direction).normalize();
    vec.add(n);
  }
  function getNormalOne(grid, x, y) {
    let normal = createVector(0, 0);

    if (grid.get(x - 1, y) === state) {
      addDirection(normal, [-1, 0]);
    }
    if (grid.get(x, y - 1) === state) {
      addDirection(normal, [0, -1]);
    }
    if (grid.get(x + 1, y) === state) {
      addDirection(normal, [+1, 0]);
    }
    if (grid.get(x, y + 1) === state) {
      addDirection(normal, [0, 1]);
    }
    if (grid.get(x - 1, y - 1) === state) {
      addDirection(normal, [-1, -1]);
    }
    if (grid.get(x - 1, y + 1) === state) {
      addDirection(normal, [-1, +1]);
    }
    if (grid.get(x + 1, y - 1) === state) {
      addDirection(normal, [+1, -1]);
    }
    if (grid.get(x + 1, y + 1) === state) {
      addDirection(normal, [+1, +1]);
    }
    if (normal.mag() < 0.9) {
      return null;
    } else {
      return normal.rotate(radians(180)).normalize();
    }
  }
  function getNormalTwo(grid, x, y) {
    const list = [
      [-2, -1],
      [-2, +0],
      [-2, +1],
      [+2, -1],
      [+2, +0],
      [+2, +1],
      [-1, -2],
      [+0, -2],
      [+1, -2],
      [-1, +2],
      [+0, +2],
      [+1, +2],
      [-2, -2],
      [-2, +2],
      [+2, -2],
      [+2, +2],
    ];
    let normal = createVector(0, 0);
    list.forEach((each) => {
      const i = each[0];
      const j = each[1];
      if (grid.get(x + i, y + j) === state) {
        addDirection(normal, each);
      }
    });

    if (normal.mag() < 0.9) {
      return null;
    } else {
      return normal.rotate(radians(180)).normalize();
    }
  }
  function getNormalThree(grid, x, y) {
    const list = [
      [-3, -2],
      [-3, -1],
      [-3, +0],
      [-3, +1],
      [-3, +2],
      //
      [+3, -2],
      [+3, -1],
      [+3, +0],
      [+3, +1],
      [+3, +2],
      //
      [-2, -3],
      [-1, -3],
      [+0, -3],
      [+1, -3],
      [+2, -3],
      //
      [-2, +3],
      [-1, +3],
      [+0, +3],
      [+1, +3],
      [+2, +3],
      //
      [-3, -3],
      [-3, +3],
      [+3, -3],
      [+3, +3],
    ];
    let normal = createVector(0, 0);
    list.forEach((each) => {
      const i = each[0];
      const j = each[1];
      if (grid.get(x + i, y + j) === state) {
        addDirection(normal, each);
      }
    });
    if (normal.mag() < 0.9) {
      return null;
    } else {
      return normal.rotate(radians(180)).normalize();
    }
  }
  if (grid.get(x - 1, y) !== state && grid.get(x + 1, y) !== state) {
    return null;
  }
  if (grid.get(x, y - 1) !== state && grid.get(x, y + 1) !== state) {
    return null;
  }
  const one = getNormalOne(grid, x, y);
  if (one) {
    return one;
  }

  const two = getNormalTwo(grid, x, y);
  if (two) {
    return two;
  }
  const three = getNormalThree(grid, x, y);
  if (three) {
    return three;
  }
  return null;
}
class Grid {
  constructor() {
    this.data = new PF.Grid(100, 100);
    this.finder = new PF.BiAStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true,
    });
    this.finder2 = new PF.BestFirstFinder({
      allowDiagonal: true,
      dontCrossCorners: true,
      heuristic: PF.Heuristic.chebyshev,
    });
  }
  WorldCoordsToGridCoords(posx, posy) {
    return [floor(posx / 52.0) + 50, floor(posy / 52.0) + 50];
  }
  GridCoordsToWorldCoords(gridx, gridy) {
    return [(gridx - 50) * 52, (gridy - 50) * 52];
  }
  FindPath(startx, starty, endx, endy) {
    let grid = this.data.clone();
    var path;
    try {
      path = this.finder.findPath(startx, starty, endx, endy, grid);
    } catch (TypeError) {
      return [];
    }
    return path;
  }
  FindPathFast(startx, starty, endx, endy) {
    let grid = this.data.clone();
    var path;
    try {
      path = this.finder2.findPath(startx, starty, endx, endy, grid);
    } catch (TypeError) {
      return [];
    }
    return path;
  }
  set(x, y, state) {
    this.data.setWalkableAt(x, y, !state);
  }
  get(x, y) {
    return !this.data.isWalkableAt(x, y);
  }
  getSize() {
    return [100, 100];
  }
  isInIsolate(gridX, gridY) {
    // A region is isolated from every other region when
    // 1. Pathfinding can't find path to any player // 2. Every Player can find path to infinite
    if (this.get(gridX, gridY) === true) {
      return false;
    }
    if (this.FindPathFast(gridX, gridY, 0, 0).length === 0) {
      return true;
    }
    return false;
  }
  isValidPath(path) {
    let isValid = path.some((each) => {
      if (this.grid.get(...each) === true) {
        return false;
      }
    });
    return isValid;
  }
}
