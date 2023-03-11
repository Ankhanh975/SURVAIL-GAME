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
          // console.log("too far");
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
    }
    return;
    {
      const map_obj = new MapGenerator({ randomFillPercent: 20 });
      for (let i = 0; i < 5; i++) {
        map_obj.SmoothMap();
      }
      const map = map_obj.map;
      map.forEach((row, y) => {
        row.forEach((value, x) => {
          if (
            !(
              x >= 50 - size / 2 &&
              x < 50 + size / 2 &&
              y >= 50 - size / 2 &&
              y < 50 + size / 2
            )
          ) {
            return;
          }
          if (value == 1) {
            const pos = this.grid.GridCoordsToWorldCoords(x, y);
            this.createObstacle({ x: pos[0], y: pos[1] }, false);
          }
        });
      });
    }
  }
  initNormal() {
    this.allNormal = [];
    this.obstacles.forEach((obstacle) => {
      const _gridCoords = this.grid.WorldCoordsToGridCoords(
        obstacle.pos.x,
        obstacle.pos.y
      );
      const gridCoords = { x: _gridCoords[0], y: _gridCoords[1] };
      // console.log(gridCoords);
      const vec = getNormal(this.grid, gridCoords);

      // console.log(vec);
      obstacle.setNormal(vec);
      {
        // Debugging
        if (!vec) {
          return;
        }
        degrees;
        const vec2 = vec.copy().setMag(35);
        const end = p5.Vector.add(vec2, obstacle.pos);
        this.allNormal.push(
          `line(${obstacle.pos.x}, ${obstacle.pos.y}, ${end.x}, ${end.y})`
        );
      }
    });
  }
}
