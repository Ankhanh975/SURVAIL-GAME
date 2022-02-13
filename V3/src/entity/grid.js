class Grid {
  constructor() {
    // this.data[x][y] == 1 => obstacle is present
    // Use as A* pathfinding to guild for AIs
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
    let returnX, returnY;
    // if (posx > 0) returnX = Math.ceil(posx / 52.0) + 50;
    // else if (posx < 0) returnX = Math.floor(posx / 52.0) + 50;
    // else returnX = 51;
    // if (posy > 0) returnY = Math.ceil(posy / 52.0) + 50;
    // else if (posy < 0) returnY = Math.floor(posy / 52.0) + 50;
    // else returnY = 51;
    returnX = Math.floor(posx / 52.0) + 50;
    returnY = Math.floor(posy / 52.0) + 50;

    return [returnX, returnY];
  }
  GridCoordsToWorldCoords(gridx, gridy) {
    return [(gridx - 50) * 52, (gridy - 50) * 52];
  }
  FindPath(startx, starty, endx, endy) {
    // console.log("What is 'this'", this, this.data)
    let grid = this.data.clone();
    var path;
    try {
      path = this.finder.findPath(startx, starty, endx, endy, grid);
    } catch (TypeError) {
      return [];
    }
    // path = PF.Util.smoothenPath(this.data, path);
    // path = PF.Util.compressPath(path);
    return path;
  }
  set(x, y, state) {
    // if (x < 0 || y < 0 || x >= 100 || y >= 100) {
    //   // console.log("out of bounds", x, y, state);
    //   return;
    // }
    // state == true means that the point is have obstacles
    this.data.setWalkableAt(x, y, !state);
  }
  FindPathFast(startx, starty, endx, endy) {
    // console.log("What is 'this'", this, this.data)
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
    // if (x < 0 || y < 0 || x >= 100 || y >= 100) {
    //   // console.log("out of bounds", x, y, state);
    //   return;
    // }
    // state == true means that the point is have obstacles
    this.data.setWalkableAt(x, y, !state);
  }
  get(x, y) {
    // return !this.data.nodes[x][y].walkable;
    return !this.data.isWalkableAt(x, y);
  }
  getSize() {
    return [100, 100];
  }
  isInIsolate(gridX, gridY) {
    {
      // A region is isolated from every other region when
      // 1. Pathfinding can't find path to any player // 2. Every Player can find path to infinite
      if (this.get(gridX, gridY) === true) {
        return false;
      }
      if (this.FindPathFast(gridX, gridY, 0, 0).length === 0) {
        return true;
      }
      return false;

      let playerInGridCoords = this.WorldCoordsToGridCoords(
        player.pos.x,
        player.pos.y
      );
      if (this.FindPathFast(gridX, gridY, ...playerInGridCoords).length > 0) {
        return false;
      }
      if (this.FindPathFast(...playerInGridCoords, 0, 0).length !== 0) {
        return true;
      }
      return false;
    }
    {
      // Paint algorithm
      const maxSize = 300;
      const mapSize = this.getSize();
      if (this.get(gridX, gridY) === true) {
        return false;
      }

      function IsInMapRange(x, y) {
        return x >= 0 && x < mapSize[0] && y >= 0 && y < mapSize[1];
      }
      if (!IsInMapRange(gridX, gridY)) {
        return false;
      }
      const startX = gridX;
      const startY = gridY;
      console.log(this);

      let tiles = [];
      let mapFlags = createGrid(...this.getSize());
      const tileType = this.get(startX, startY);

      let queue = [];
      queue.push({ tileX: startX, tileY: startY });
      mapFlags[startX][startY] = 1;

      while (queue.length > 0 && tiles.length < maxSize) {
        console.log(tiles, queue);
        const tile = queue.shift();
        tiles.push(tile);

        for (let x = tile.tileX - 1; x <= tile.tileX + 1; x++) {
          for (let y = tile.tileY - 1; y <= tile.tileY + 1; y++) {
            if (IsInMapRange(x, y) && (y == tile.tileY || x == tile.tileX)) {
              if (mapFlags[x][y] == 0 && this.get(x, y) == tileType) {
                mapFlags[x][y] = 1;
                queue.push({ tileX: x, tileY: y });
              }
            }
          }
        }
        console.log(tiles, queue);
      }
      console.log(tiles.length, tiles);
      return tiles.length < maxSize + 1;
    }
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
    if (grid.get(x - 1, y) !== state && grid.get(x + 1, y) !== state) {
      return null;
    }
    if (grid.get(x, y - 1) !== state && grid.get(x, y + 1) !== state) {
      return null;
    }

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
