class Obstacle {
  constructor(pos, parent, lifeTime = true) {
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
          this.circle.pos.x,
          this.circle.pos.y
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
  draw() {
    push();
    translate(this.circle.pos.x, this.circle.pos.y);
    translate(this.size / 2, this.size / 2);

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
      if (collisions.checkCollision(ob.circle, body)) {
        return true;
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
    for (const obstacle of this.obstacles) {
      obstacle.draw();
    }
    pop();
  }
  initObstacles() {
   
    let chunkX = 0;
    let chunkY = 0;
    // for (let x = 0; x < 100; x++) {
    // for (let y = 0; y < 100; y++) {
    for (let x = 20; x < 80; x++) {
      for (let y = 20; y < 80; y++) {
        let value = noisejs.simplex2(
          x / 15 + (chunkX * 100) / 15,
          y / 15 + (chunkY * 100) / 15
        );
        // chunk[x][y] += noisejs.simplex2(x / 5, y / 5) / 20;
        if (value > 0.35 && value < 0.7) {
          const pos = this.grid.GridCoordsToWorldCoords(x, y);
          this.createObstacle({ x: pos[0], y: pos[1] }, false);
        }
      }
    }

    // translate(c.x * chunkSize * 16, c.y * chunkSize * 16);

    return;
    function createChunk(chunkX = 0, chunkY = 0) {
      let chunk = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
      for (x = 0; x < chunk[0].length; x++) {
        for (y = 0; y < chunk.length; y++) {
          chunk[x][y] = noisejs.simplex2(
            x / 40 + (chunkX * 16) / 40,
            y / 40 + (chunkY * 16) / 40
          );
          // chunk[x][y] += noisejs.simplex2(x / 5, y / 5) / 20;
        }
      }
      return chunk;
    }
    function distance(p1, p2) {
      // dx = p2.x - p1.x;
      // dx *= dx;
      // dy = p2.y - p1.y;
      // dy *= dy;
      // return Math.sqrt(dx + dy);
      return min(p1.x - p2.x, p1.y - p2.y);
    }
    function getPoints(x, y, r) {
      // https://stackoverflow.com/questions/14611782/using-midpoint-circle-algorithm-to-generate-points-of-a-filled-circle
      var ret = [];
      for (var j = x - r; j <= x + r; j++)
        for (var k = y - r; k <= y + r; k++)
          if (distance({ x: j, y: k }, { x: x, y: y }) <= r)
            ret.push({ x: j, y: k });
      return ret;
    }

    let chunks = {};
    let frame = 0;
    // Player position in chunks coordinates
    let playerX = 0;
    let playerY = 0;

    let radius = 1;
    let chunkSize = 30;
    function draw() {
      frame++;
      // playerX = round((mouseX - width / 2) / (chunkSize * 16) - 0.5);
      // playerY = round((mouseY - width / 2) / (chunkSize * 16) - 0.5);
      // playerY = mouseY;
      console.log("draw", frameRate(), playerX, playerY);
      background(0);
      translate(width / 2, height / 2);
      let drawChunks = getPoints(playerX, playerY, radius);
      // update chunk
      drawChunks.forEach((c) => {
        let chunk = chunks[`${c.x},${c.y}`];
        if (chunk !== undefined) {
          return;
        } else {
          chunks[`${c.x},${c.y}`] = createChunk(c.x, c.y);
        }
      });
      // drawChunks
      drawChunks.forEach((c) => {
        let chunk = chunks[`${c.x},${c.y}`];
        if (chunk === undefined) {
          return;
        }
        push();
        translate(c.x * chunkSize * 16, c.y * chunkSize * 16);
        for (var i = 0; i < chunk.length; i++) {
          for (var j = 0; j < chunk[i].length; j++) {
            var x = i * chunkSize;
            var y = j * chunkSize;
            let v = chunk[i][j];
            if (v > 0 && v <= 0.1) {
              fill(128, 128, 0);
            } else if (v > 0.1 && v <= 0.5) {
              fill(0, 255, 0);
            } else if (v > 0.5 && v < 1) {
              fill(150 + v * 5, 150 + v * 5, 150 + v * 5);
            } else if (v > -0.2 && v <= 0) {
              fill(0, 0, 245);
            } else {
              fill(10 - v * 5, 10 - v * 5, 202 - v * 5);
            }
            if (v > 0.3) {
              fill(128, 128, 0);
            } else {
              fill(0, 0, 0);
            }
            stroke(0, 0, 0, 180);
            rect(x, y, chunkSize, chunkSize);
          }
        }
        pop();
      });
    }
  }
}

// {
//   let pGridStart = this.grid.WorldCoordsToGridCoords(
//     posStart.x,
//     posStart.y
//   );
//   let pGridEnd = this.grid.WorldCoordsToGridCoords(posEnd.x, posEnd.y);
//   let path = lineBresenham_1(...pGridStart, ...pGridEnd);
//   // console.log("path", path);
//   // Check path valid or invalid
//   let isValid = !path.some((each) => {
//     return this.grid.get(...each);
//   });
//   if (isValid) {
//     return [
//       [posStart.x, posStart.y],
//       [posEnd.x, posEnd.y],
//     ];
//     path = path.map((each) => {
//       each = this.grid.GridCoordsToWorldCoords(...each);
//       each[0] += 52 / 2;
//       each[1] += 52 / 2;
//       return each;
//     });
//     return path;
//   } else {
//     return [];
//   }
// }
