class Obstacle {
  constructor(pos, parent) {
    // parent: the Obstacles object this Obstacle belongs to
    this.circle = collisions.createBox({ x: pos.x, y: pos.y }, 51.9, 51.9);
    this.circle.parent = this;
    collisions.updateBody(this.circle);

    this.color = [256, 256, 0, 220];
    this.parent = parent;
    this.size = 51.9;
    // this.size = 30;
    // anime({
    //   targets: this,
    //   translateX: 270,
    //   size: 51.9,
    // });
  }
  draw() {
    push();
    // translate(-this.size / 2, -this.size / 2);
    translate(this.circle.pos.x, this.circle.pos.y);
    // Draw rect in corner
    rect(0, 0, this.size, this.size, 3.5);
    pop();
  }
  update() {}
  getHit() {}
}
class Obstacles {
  constructor() {
    this.obstacles = [];
    this.grid = new Grid();
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
  FindStraightPath(posStart, posEnd) {
    let pGridStart = this.grid.WorldCoordsToGridCoords(posStart.x, posStart.y);
    let pGridEnd = this.grid.WorldCoordsToGridCoords(posEnd.x, posEnd.y);
    let path = lineBresenham_1(...pGridStart, ...pGridEnd);
    // console.log("path", path);

    // Check path valid or invalid
    let isValid = !path.some((each) => {
      return this.grid.get(...each);
    });
    if (isValid) {
      return [
        [posStart.x, posStart.y],
        [posEnd.x, posEnd.y],
      ];
      path = path.map((each) => {
        each = this.grid.GridCoordsToWorldCoords(...each);
        each[0] += 52 / 2;
        each[1] += 52 / 2;
        return each;
      });
      return path;
    } else {
      return [];
    }
  }

  createObstacle(pos) {
    // console.log(pos);
    // pos.add(createVector(+52 / 2, +52 / 2));
    pos = createVector(pos.x, pos.y);

    [pos.x, pos.y] = this.grid.GridCoordsToWorldCoords(
      ...this.grid.WorldCoordsToGridCoords(pos.x, pos.y)
    );
    // ob.circle maybe inserted is overlap with something
    let gridPos = this.grid.WorldCoordsToGridCoords(pos.x, pos.y);
    if (this.grid.get(gridPos[0], gridPos[1]) === true) {
      // This cell is already in the grid
      return;
    }
    this.lastCreate = [pos.x, pos.y];
    if (this.lastCreate) {
      if (this.lastCreate.x === pos.x && this.lastCreate.y === pos.y) {
        return;
      }
    }
    let ob = new Obstacle(pos, this);
    const potentials = collisions.getPotentials(ob.circle);
    const collided = potentials.some((body) => {
      if (collisions.checkCollision(ob.circle, body)) {
        return true;
      }
    });

    if (collided) {
      collisions.remove(ob.circle);
    }

    if (!collided) {
      this.obstacles.push(ob);

      this.grid.set(gridPos[0], gridPos[1], true);
      setTimeout(() => {
        // Remove the obstacle from the world
        let x = this.obstacles.shift();

        collisions.remove(x.circle);
        let gridPos = this.grid.WorldCoordsToGridCoords(
          x.circle.pos.x,
          x.circle.pos.y
        );

        this.grid.set(gridPos[0], gridPos[1], false);
      }, 12.5 * 1000);
      return ob;
    }
  }
  update() {
    this.obstacles.forEach((obstacle) => {
      obstacle.update();
    });
  }
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
}
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
  isInIsolate(gridX, gridY) {
    if (this.get(gridX, gridY) === true) {
      return false;
    }
    // A region is isolated from every other region when
    // 1. Pathfinding can't find path to player
    // 2. Every Player can find path to infinite
    if (this.FindPathFast(gridX, gridY, ...playerInGridCoords).length > 0) {
      return false;
    }
    
    let playerInGridCoords = this.WorldCoordsToGridCoords(
      player.pos.x,
      player.pos.y
    );
    // console.log(
    //   playerInGridCoords,
    //   gridX,
    //   gridY,
    //   this.FindPath(gridX, gridY, ...playerInGridCoords).length === 0,
    //   this.FindPath(...playerInGridCoords, 0, 0).length !== 0
    // );
    if (this.FindPathFast(...playerInGridCoords, 0, 0).length !== 0) {
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
// isInIsolate(gridX, gridY) {
//   if (this.get(gridX, gridY) === true) {
//     return false;
//   }
//   // A region is isolated from every other region when
//   // 1. Pathfinding can't find path to any player
//   // 2. any  Player can find path to infinite

//   let isInIsolate = !players.players.some((p) => {
//     let pInGridCoords = this.WorldCoordsToGridCoords(p.pos.x, p.pos.y);
//     if (this.FindPathFast(...pInGridCoords, 0, 0).length !== 0) {
//       if (this.FindPathFast(gridX, gridY, ...pInGridCoords).length > 0) {
//         return true;
//       }
//     }
//   });
//   return isInIsolate;
// }