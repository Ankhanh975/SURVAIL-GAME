class Obstacle {
  constructor(pos, parent) {
    // parent: the Obstacles object this Obstacle belongs to
    this.circle = new DetectCollisions.Box({ x: pos.x, y: pos.y }, 51.9, 51.9);
    this.circle.parent = this;
    this.parent = parent;
  }
  draw() {
    push();
    // translate(-52 / 2, -52 / 2);
    translate(this.circle.pos.x, this.circle.pos.y);
    // Draw rect in corner
    rect(0, 0, 52, 52, 3.5);
    pop();
  }
  update() {}
  getHit() {}
}
class Obstacles {
  constructor() {
    this.obstacles = [];

    // this.grid.data[x][y] == 1 => obstacle is present
    this.grid = {};
    // Use as A* pathfinding to guild for AIs
    this.grid.data = new PF.Grid(100, 100);

    this.grid.finder = new PF.BiAStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true,
    });
    this.grid.WorldCoordsToGridCoords = (posx, posy) => {
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
    };
    this.grid.GridCoordsToWorldCoords = (gridx, gridy) => {
      return [(gridx - 50) * 52, (gridy - 50) * 52];
    };
    this.grid.FindPath = (startx, starty, endx, endy) => {
      // console.log("What is 'this'", this, this.data)
      let grid = this.grid.data.clone();
      this.grid.finder = new PF.BiAStarFinder({
        allowDiagonal: true,
        dontCrossCorners: true,
      });
      var path = this.grid.finder.findPath(startx, starty, endx, endy, grid);
      // path = PF.Util.smoothenPath(this.grid.data, path);
      // path = PF.Util.compressPath(path);
      return path;
    };
    this.grid.set = (x, y, state) => {
      this.grid.data.setWalkableAt(x, y, state);
    };
  }
  FindPath(posStart, posEnd) {
    if (posStart.mag() > 2500 || posEnd.mag() > 2500) {
      return [];
    }

    let pGridStart = this.grid.WorldCoordsToGridCoords(posStart.x, posStart.y);
    let pGridEnd = this.grid.WorldCoordsToGridCoords(posEnd.x, posEnd.y);
    let path;
    try {
      path = obstacles.grid.FindPath(...pGridStart, ...pGridEnd);
      if (path.length === 0) {
        return [];
      }
    } catch (TypeError) {
      return [];
    }
    // console.log("old", path);
    for (let i = 0; i < path.length; i++) {
      path[i] = this.grid.GridCoordsToWorldCoords(path[i][0], path[i][1]);
      path[i] = [path[i][0] + 52 / 2, path[i][1] + 52 / 2];
    }
    // console.log("path", path);

    // Because a* pathfinding work not on continuous coordinates so have to go to connected points
    path.unshift([posStart.x, posStart.y]);
    path.push([posEnd.x, posEnd.y]);
    // console.log(
    //   path[0][0] - path[1][0] < 0 && path[0][0] - path[2][0] > 0,
    //   path[0][1] - path[1][1] < 0 && path[0][1] - path[2][1] > 0,
    //   path[0][0] - path[1][0] > 0 && path[0][0] - path[2][0] < 0,
    //   path[0][1] - path[1][1] > 0 && path[0][1] - path[2][1] < 0
    // );
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
  update() {}
  draw() {
    push();
    strokeWeight(1.5);
    stroke(0, 0, 0);
    fill(220, 220, 10, 200);

    this.obstacles.forEach((obstacle) => {
      obstacle.draw();
    });

    pop();
  }

  createObstacle(pos) {
    // pos.add(createVector(+52 / 2, +52 / 2));
    [pos.x, pos.y] = this.grid.GridCoordsToWorldCoords(
      ...this.grid.WorldCoordsToGridCoords(pos.x, pos.y)
    );
    if (this.lastCreate) {
      if (this.lastCreate.x === pos.x && this.lastCreate.y === pos.y) {
        return;
      }
    }
    // console.log("new", this.lastCreate, pos, this.lastCreate == pos);

    this.lastCreate = pos;
    let ob = new Obstacle(pos, this);
    let InsertAble = true;

    system.insert(ob.circle);
    system.updateBody(ob.circle);
    // system.checkOne(ob.circle, () => {
    //   // ob.circle to be inserted is overlap with something
    //   InsertAble = false;
    // });
    if (InsertAble) {
      this.obstacles.push(ob);
      let gridPos = this.grid.WorldCoordsToGridCoords(pos.x, pos.y);
      console.log("Grid position", gridPos, pos.x, pos.y);

      this.grid.set(gridPos[0], gridPos[1], false);
      // setTimeout(() => {
      //   // Remove the obstacle from the world
      //   let x = this.obstacles.shift();

      //   system.remove(x.circle);
      //   system.update(x.circle);
      // }, 10 * 1000);
      return ob;
    } else {
      system.remove(ob.circle);
    }
  }
}
