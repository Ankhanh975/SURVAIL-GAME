component.wandering = class {
  name = "wandering";
  constructor() {
    this.isWandering = false;
    this.heading = createVector(1, 0);
    this.heading_angle = 0;

    this.is = function () {
      return this.isWandering;
    };
    this.start = function () {
      this.isWandering = true;
    };
    this.end = function () {
      this.isWandering = false;
    };
  }
  update = () => {
    if (this.is()) {
      const headTo = createVector(x, y)
        .setMag(3.0)
        .setHeading(this.heading_angle + random(-radians(30), radians(30)));
      this.parent.addPos(headTo);
      this.heading_angle += random(-radians(5), radians(5));
      this.heading.setHeading(this.heading_angle);
      if (this.parent.velocity.mag() < 1) {
        this.heading.rotate(90);
        this.heading_angle = this.heading.heading();
      }
    }
  };
};
