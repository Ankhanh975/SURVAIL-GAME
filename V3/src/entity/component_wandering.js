component.sensor = class {
  // Zombie have 2 sensor, place sensor in head of zombie
  name = "sensor";
  constructor() {
    this.sensor1 = false;
    this.sensor2 = false;
    this.get = function () {
      const v = this.parent.rotation.headTo;
      // .copy()
      // this.parent.rotation.headTo.mag === 100
      const v1 = v.copy().rotate(radians(-20)).add(this.parent.pos);
      const v2 = v.copy().rotate(radians(20)).add(this.parent.pos);
      this.sensor1 = !collisions.isFreeLine(this.parent.pos, v1, [this.parent]);
      this.sensor2 = !collisions.isFreeLine(this.parent.pos, v2, [this.parent]);

      queue.addDraw(
        `line(${this.parent.pos.x},${this.parent.pos.y}, ${v1.x},${v1.y})`
      );
      queue.addDraw(
        `line(${this.parent.pos.x},${this.parent.pos.y}, ${v2.x},${v2.y})`
      );

      return [this.sensor1, this.sensor2];
    };
  }
};

component.wandering = class {
  name = "wandering";
  constructor() {
    this.isWandering = false;
    this.wanderTime = 0;
    this.heading = createVector(1, 0);
    this.heading_angle = 0;

    this.is = function () {
      return this.isWandering;
    };
    this.start = function () {
      console.log("start");
      this.isWandering = true;
    };
    this.end = function () {
      this.isWandering = false;
      this.wanderTime = 0;
    };
  }
  update = () => {
    // console.log(this.heading_angle, this.isWandering, this.wanderTime);
    if (this.is()) {
      this.wanderTime += 1;
    }
    if (this.is()) {
      const headTo = p5.Vector.random2D()
        .setMag(3.0)
        .setHeading(this.heading_angle + random(-radians(30), radians(30)));
      this.parent.addPos(headTo);
      this.heading_angle += random(-radians(5), radians(5));
      this.heading.setHeading(this.heading_angle);

      this.parent.sensor.get();
      console.log(this.parent.sensor.sensor1, this.parent.sensor.sensor2);
      if (this.parent.sensor.sensor1 || this.parent.sensor.sensor2) {
        this.heading.rotate(90);
        this.heading_angle = this.heading.heading();
        // this.parent.setAngle(this.heading)
        return;
      }
    }
  };
};
