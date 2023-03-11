class Obstacle {
  constructor(settings, system) {
    this.size = 51.9;

    this.pos = createVector(
      settings.pos.x + this.size / 2,
      settings.pos.y + this.size / 2
    );

    this.box = collisions.createPolygon({ x: this.pos.x, y: this.pos.y }, [
      { x: 0 - this.size / 2, y: 0 - this.size / 2 },
      { x: 0 - this.size / 2, y: this.size - this.size / 2 },
      { x: this.size - this.size / 2, y: this.size - this.size / 2 },
      { x: this.size - this.size / 2, y: 0 - this.size / 2 },
    ]);

    this.box.parent = this;
    this.parent = system;
    this.life = settings.life || 60 * 16; //(frame)
    // if (settings.lifeTime) {
    //   setTimeout(() => {
    //     // Remove the obstacle from the world
    //     const index = obstacles.obstacles.indexOf(this);
    //     if (index > -1) {
    //       obstacles.obstacles.splice(index, 1);
    //     }

    //     collisions.remove(this.box);
    //     let gridPos = obstacles.grid.WorldCoordsToGridCoords(
    //       this.pos.x,
    //       this.pos.y
    //     );

    //     obstacles.grid.set(gridPos[0], gridPos[1], false);
    //   }, 18 * 1000);
    // }
    // if (settings.lifeTime) {
    //   setTimeout(() => {
    //     this.surface = this.parent.obstacles_surface2;
    //   }, 17.1 * 1000);
    // }
  }
  setPos(pos) {
    this.pos = pos;
    this.box.setPosition(this.pos.x, this.pos.y);
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    image(Obstacles_img[0], 0, 0);
    pop();
  }
}

class Obstacles {
  constructor() {
    this.obstacles = [];
  }

  addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  }

  getObstacles() {
    return this.obstacles;
  }

  getObstacle(index) {
    return this.obstacles[index];
  }

  removeObstacle(index) {
    this.obstacles.splice(index, 1);
  }

  removeObstacles() {
    this.obstacles = [];
  }

  getObstacleCount() {
    return this.obstacles.length;
  }
}
