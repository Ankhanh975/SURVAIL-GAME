class Obstacle {
  constructor(pos, angle = 0) {
    this.normal = createVector(0, -1);

    this.pos = pos;
    this.velocity = createVector(0, 0);
    this.angle = angle;

    this.health = 20;
    // Remember to manually sync the position of this.circle.pos & this.pos.
    // this.circle = new DetectCollisions.Box(
    //   { x: this.pos.x, y: this.pos.y }
    // );
    this.circle = new DetectCollisions.Box(
      { x: this.pos.x, y: this.pos.y },
      50,
      50
    );
    this.circle.parent = this;
    system.insert(this.circle);
  }
  draw() {
    push();
    strokeWeight(1.5);
    translate(this.pos);
    translate(this.pos);
    rotate(this.angle);
    stroke(0, 0, 0);
    fill(220, 220, 10, 200);
    rect(0, 0, 55, 55, 3.5);
    pop();
  }
  update() {}
}
class Obstacles {
  constructor() {
    this.obstacles = [];
    // Own collision detection use to separate all obstacles out of collision
    this.system = new DetectCollisions.System();
  }
  update() {
    this.system.update();
    this.system.checkAll(({ a, overlapV }) => {
      let b = this.system.response.b;
      let l = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);

      let newMag = 2 / max(l.mag(), 7) ** 2;
      // l.setMag(newMag);
      l.setMag(1);
      // l.setMag(max(50 / l.mag(), 50));

      a.pos.x += l.x;
      a.pos.y += l.y;
      a.parent.pos.add(l);
    });
  }
  draw() {
    this.obstacles.forEach((obstacle) => {
      obstacle.draw();
    });
  }
  createObstacle(pos, angle = 0) {
    if (this.lastCreate === pos) {
      return;
    }
    this.lastCreate = pos;
    let ob = new Obstacle(pos, angle);
    this.obstacles.push(ob);
    this.system.insert(ob.circle);
    console.log(this.system, ob, ob.circle);
    // setTimeout(() => {
    //   // Remove the obstacle from the world
    //   this.obstacles.shift();
    // }, 10 * 1000);
  }
}
