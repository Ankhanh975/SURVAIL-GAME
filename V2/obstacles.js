class Obstacle {
  constructor(pos, angle = 0) {
    this.velocity = createVector(0, 0);
    this.angle = angle;

    this.health = 20;
    // Remember to manually sync the position of this.circle.pos & this.pos.
    // this.circle = new DetectCollisions.Box(
    //   { x: this.pos.x, y: this.pos.y }
    // );
    this.size = 52
    this.circle = new DetectCollisions.Box({ x: pos.x, y: pos.y }, 52, 52);
    this.circle.parent = this;
  }
  draw() {
    push();
    strokeWeight(1.5);
    translate(this.circle.pos.x, this.circle.pos.y);
    rotate(this.angle);
    stroke(0, 0, 0);
    fill(220, 220, 10, 200);
    translate(+52 / 2, +52 / 2);
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
    // Own collision detection use to separate all obstacles out of collision
    this.system = new DetectCollisions.System();
  }
  update() {
    this.system.update();
    this.system.separate();
  }
  draw() {
    this.obstacles.forEach((obstacle) => {
      obstacle.draw();
    });
  }

  createObstacle(pos, angle = 0) {
    if (this.lastCreate) {
      if (this.lastCreate.x === pos.x && this.lastCreate.y === pos.y) {
        return;
      }
    }
    // console.log("new", this.lastCreate, pos, this.lastCreate == pos);

    this.lastCreate = pos;
    let ob = new Obstacle(pos, angle);
    this.obstacles.push(ob);
    this.system.insert(ob.circle);
    system.insert(ob.circle);
    setTimeout(() => {
      // Remove the obstacle from the world
      let x = this.obstacles.shift();
      system.remove(x.circle);
      this.system.remove(x.circle);
    }, 30 * 1000);
  }
}
