class Obstacle {
  constructor(pos, parent, lifeTime = true) {
    // parent: the Obstacles object this Obstacle belongs to
    this.size = 51.9;
    this.pos = createVector(pos.x, pos.y);
    this.pos.x += this.size / 2;
    this.pos.y += this.size / 2;
    this.circle = collisions.createPolygon({ x: this.pos.x, y: this.pos.y }, [
      { x: 0 - this.size / 2, y: 0 - this.size / 2 },
      { x: 0 - this.size / 2, y: this.size - this.size / 2 },
      { x: this.size - this.size / 2, y: this.size - this.size / 2 },
      { x: this.size - this.size / 2, y: 0 - this.size / 2 },
    ]);
    // Debugging
    // this.circle.normals[0].x = 1;
    // this.circle.normals[0].y = 0;
    // this.circle.normals[1].x = 1;
    // this.circle.normals[1].y = 0;
    // this.circle.normals[2].x = 1;
    // this.circle.normals[2].y = 0;
    // this.circle.normals[3].x = 1;
    // this.circle.normals[3].y = 0;

    // this.circle.isStatic = true;
    this.circle.parent = this;
    this.color = [220, 220, 10, 200];
    this.parent = parent;
    this.life = 60 * 16; //(frame)
    this.surface = this.parent.obstacles_surface;
    lifeTime &&
      setTimeout(() => {
        // Remove the obstacle from the world
        const index = obstacles.obstacles.indexOf(this);
        if (index > -1) {
          obstacles.obstacles.splice(index, 1);
        }

        collisions.remove(this.circle);
        let gridPos = obstacles.grid.WorldCoordsToGridCoords(
          this.pos.x,
          this.pos.y
        );

        obstacles.grid.set(gridPos[0], gridPos[1], false);
      }, 16 * 1000);
    lifeTime &&
      setTimeout(() => {
        this.surface = this.parent.obstacles_surface2;
      }, 15.1 * 1000);

    // anime({
    //   targets: this,
    //   translateX: 270,
    //   size: 51.9,
    // });
  }
  setPos(pos) {
    this.pos = pos;
    // this.circle.pos.x = this.pos.x;
    // this.circle.pos.y = this.pos.y;
    this.circle.setPosition(this.pos.x, this.pos.y);
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    // translate(this.size / 2, this.size / 2);

    image(this.surface, 0, 0);
    // strokeWeight(1.5);
    // stroke(0, 0, 0);
    // fill(...this.color);
    // rect(0, 0, this.size, this.size, 3.5);
    pop();
  }
  update() {
    // this.life -= 1;
    // if (this.life <= 0) {
    // }
  }
  getHit() {}
}
class Obstacles {
  constructor() {
    this.obstacles = [];
    this.grid = new Grid();
    this.obstacles_surface = createGraphics(52, 52);

    this.obstacles_surface.push();
    this.obstacles_surface.strokeWeight(1.5);
    this.obstacles_surface.stroke(0, 0, 0, 240);
    this.obstacles_surface.fill([220, 220, 10, 200]);
    this.obstacles_surface.rect(0, 0, 52, 52, 3.5);
    this.obstacles_surface.pop();

    this.obstacles_surface2 = createGraphics(52, 52);

    this.obstacles_surface2.push();
    this.obstacles_surface2.strokeWeight(1.5);
    this.obstacles_surface2.stroke(0, 0, 0, 240);
    this.obstacles_surface2.fill([220, 220, 10, 100]);
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
    let ob = new Obstacle(pos, this, lifeTime);
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
    // console.log(pixelDensity());
  }
  draw() {
    push();
    // Test speed of 2 options
    // if (this.obstacles.length > 10_000) {
    //   {
    //     collisions.getNear(
    //       player.pos,
    //       {
    //         rangeX: 1000,
    //         rangeY: 1000,
    //       },
    //       (each) => {
    //         if (each.parent instanceof Obstacle) {
    //           each.parent.draw();
    //         }
    //       }
    //     );
    //   }
    //   return;
    // }
    {
      for (const obstacle of this.obstacles) {
        if (
          player.pos.x - obstacle.pos.x > 1000 ||
          player.pos.x - obstacle.pos.x < -1000 ||
          player.pos.y - obstacle.pos.y > 600 ||
          player.pos.y - obstacle.pos.y < -600
        ) {
          // console.log("too far");
          continue;
        }
        obstacle.draw();
      }
    }

    pop();
    return;
  }
  initObstacles() {
    let chunkX = 0;
    let chunkY = 0;
    const size = 60;
    for (let x = 50 - size / 2; x < 50 + size / 2; x++) {
      for (let y = 50 - size / 2; y < 50 + size / 2; y++) {
        // for (let x = 20; x < 80; x++) {
        // for (let y = 20; y < 80; y++) {
        let value = noisejs.simplex2(
          x / 20 + (chunkX * 100) / 20,
          y / 20 + (chunkY * 100) / 20
        );
        // chunk[x][y] += noisejs.simplex2(x / 5, y / 5) / 20;
        if (value > 0.3 && value < 0.7) {
          const pos = this.grid.GridCoordsToWorldCoords(x, y);
          this.createObstacle({ x: pos[0], y: pos[1] }, false);
        }
      }
    }
    return;
  }
}
