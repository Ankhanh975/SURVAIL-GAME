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
