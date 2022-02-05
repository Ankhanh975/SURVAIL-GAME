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
      function createGrid(n, m) {
        let grid = [];
        let grid0 = [];
        for (let i = 0; i < n; i++) {
          grid.push(null);
        }
        for (let i = 0; i < m; i++) {
          grid0.push(0);
        }
        grid = grid.map(function (grid) {
          return grid0;
        });
        return grid;
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
