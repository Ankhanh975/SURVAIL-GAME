class Base {
  constructor(parent, pos = [0, 0], name = "", health) {
    this.pos = createVector(...pos);
    this.lastPos = createVector(0, 0);

    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.heading = createVector(100, 0);
    this.heading.angle = 0;
    // this.lookAt may be different from this.heading 
    // because the heading have limited change in speed when this.lookAt is not
    this.lookAt = createVector(100, 0);
    this.parent = parent;

    this.name = name;

    this.health = health;
    this.totalHealth = health;
    this.recovery = 0.0;
    this.damage = 1;

    // physics in collision detection system
    this.circle = null;
  }
  setPos(pos) {
    this.pos = pos;
    this.circle.setPosition(this.pos.x, this.pos.y);
  }

  addPos(pos) {
    // pos: p5js vector add to this.pos
    this.setPos(this.pos.add(pos));
  }
  update() {
    this.health += this.recovery;
    this.health = min(this.health, this.totalHealth);
    this.health = max(this.health, 0);
    this.lastPos = this.pos.copy();
  }
}
