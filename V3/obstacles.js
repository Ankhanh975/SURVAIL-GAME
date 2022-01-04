class Obstacle {
  constructor(pos, parent = null, lifeTime = 15 * 1000, angle = 0) {
    // parent: the Obstacles object this Obstacle belongs to
    this.velocity = createVector(0, 0);
    this.angle = angle;

    this.health = 20;
    // Remember to manually sync the position of this.circle.pos & this.pos.
    // this.circle = new DetectCollisions.Box(
    //   { x: this.pos.x, y: this.pos.y }
    // );
    this.size = 52;
    this.circle = new DetectCollisions.Box({ x: pos.x, y: pos.y }, 52, 52);
    this.circle.parent = this;
  }
  draw() {
    push();
    strokeWeight(1.5);
    translate(this.circle.pos.x, this.circle.pos.y);
    rotate(this.angle);
    stroke(0, 0, 0);
    fill(220, 220, 10, map(this.health, 0, 20, 20, 200));
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
    pos.x -= 52 / 2;
    pos.y -= 52 / 2;
    if (this.lastCreate) {
      if (this.lastCreate.x === pos.x && this.lastCreate.y === pos.y) {
        return;
      }
    }
    // console.log("new", this.lastCreate, pos, this.lastCreate == pos);

    this.lastCreate = pos;
    let ob = new Obstacle(pos, angle);
    let InsertAble = true;
    
    system.insert(ob.circle);
    system.updateBody(ob.circle);
    system.checkOne(ob.circle, () => {
      let b = system.response.b;
      if (b.parent instanceof Player) {
        // ob.circle to be inserted is overlap with a player
        InsertAble = false;
      }
    });
    if (InsertAble) {
      this.obstacles.push(ob);
      this.system.insert(ob.circle);

      setTimeout(() => {
        // Remove the obstacle from the world
        let x = this.obstacles.shift();
        system.remove(x.circle);
        this.system.remove(x.circle);
      }, 10 * 1000);
    } else {
      system.remove(ob.circle);
    }
  }
}
