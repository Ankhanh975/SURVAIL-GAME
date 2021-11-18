class Obstacle {
  constructor(pos, angle = 0) {
    this.normal = createVector(0, -1);

    this.pos = createVector(...pos);
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
    rotate(this.angle);
    stroke(0, 0, 0);
    fill(220, 220, 10, 200);
    rect(0, 0, 55, 55, 3.5);
    pop();
  }
  update() {}
}
