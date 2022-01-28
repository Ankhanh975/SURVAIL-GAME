class Obstacle {
  constructor(pos, parent) {
    // parent: the Obstacles object this Obstacle belongs to
    this.size = 51.9;
    this.circle = collisions.createPolygon({ x: pos.x, y: pos.y }, [
      { x: this.size, y: this.size },
      { x: 0, y: this.size },
      { x: 0, y: 0 },
      { x: this.size, y: 0 },
    ]);

    this.circle.parent = this;
    this.color = [220, 220, 10, 200];
    this.parent = parent;
    this.life = 60 * 16; //(frame)
    
    setTimeout(() => {
      // Remove the obstacle from the world
      let x = obstacles.obstacles.shift();

      collisions.remove(x.circle);
      let gridPos = obstacles.grid.WorldCoordsToGridCoords(
        x.circle.pos.x,
        x.circle.pos.y
      );

      obstacles.grid.set(gridPos[0], gridPos[1], false);
    }, 16 * 1000);
    setTimeout(() => {
      this.color[3] = 100;
    }, 15.1 * 1000);

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
    fill(...this.color);
    // Draw rect in corner
    rect(0, 0, this.size, this.size, 3.5);
    pop();
  }
  update() {
    this.life -= 1;
    if (this.life <= 0) {
    }
  }
  getHit() {}
}
class Obstacles {
  constructor() {
    this.obstacles = [];
    this.grid = new Grid();
    this.obstacles_surface = createGraphics(52, 52);
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
    this.lastCreate = [pos.x, pos.y];
    if (this.lastCreate) {
      if (this.lastCreate.x === pos.x && this.lastCreate.y === pos.y) {
        return null;
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
      return null;
    }

    if (!collided) {
      this.obstacles.push(ob);
      this.grid.set(gridPos[0], gridPos[1], true);
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

    this.obstacles.forEach((obstacle) => {
      obstacle.draw();
    });

    pop();
  }
}
