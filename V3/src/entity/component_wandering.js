component.sensor = class {
  // Zombie have 2 sensor, place sensor in head of zombie
  name = "sensor";
  constructor() {
    this.sensor1 = false;
    this.sensor2 = false;
    this.get = function () {
      const v = this.parent.rotation.lookAt
        .copy()
        .rotate(radians(-90))
        .setMag(70);
      // .copy()
      // this.parent.rotation.headTo.mag === 100
      const v1 = v.copy().rotate(radians(-20)).add(this.parent.pos);
      const v2 = v.copy().rotate(radians(20)).add(this.parent.pos);
      this.sensor1 = !collisions.isFreeLine(this.parent.pos, v1, {
        ignore: [this.parent.circle],
      });
      this.sensor2 = !collisions.isFreeLine(this.parent.pos, v2, {
        ignore: [this.parent.circle],
      });

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
    this._isWalking = true;
    this.wanderTime = 0;
    this.heading = p5.Vector.random2D().setMag(2.5);
    this.heading_angle = this.heading.heading();

    this.is = function () {
      return this.isWandering;
    };
    this.start = function () {
      this.isWandering = true;
      this.heading = p5.Vector.random2D().setMag(2.5);
      this.heading_angle = this.heading.heading();
    };

    this.end = function () {
      this.isWandering = false;
      this.wanderTime = 0;
    };
  }
  update = () => {
    {
      const h = this.heading.copy().setMag(50).add(this.parent.pos);
      queue.addDraw(
        `line(${this.parent.pos.x},${this.parent.pos.y}, ${h.x},${h.y})`
      );
    }

    // console.log(this.heading_angle, this.isWandering, this.wanderTime);
    if (this.is() && this._isWalking) {
      this.wanderTime += 1;
      if (this.wanderTime > Prob.normal(210, 50)()) {
        this._isWalking = false;
        setTimeout(() => {
          this.wanderTime = 0;
          this._isWalking = true;
          if (this.is()) {
            this.start();
          }
        }, Prob.normal(1000, 100)());
      }
    }
    if (this.is() && this._isWalking) {
      // const headTo = p5.Vector.random2D()
      //   .setMag(3.0)
      //   .setHeading(this.heading_angle + random(-radians(30), radians(30)));
      this.parent.addPos(this.heading);
      this.parent.setAngle(this.heading_angle);

      this.parent.sensor.get();
      // console.log(this.parent.sensor.sensor1, this.parent.sensor.sensor2);
      if (this.parent.sensor.sensor1 || this.parent.sensor.sensor2) {
        this.heading.rotate(radians(10));
        this.heading_angle = this.heading.heading();
        // this.parent.setAngle(this.heading)
      }
    }
    if (this.is() && this._isWalking && frameCount % 5 == 0) {
      this.heading_angle += Prob.normal(0, radians(5))();
      this.heading.setHeading(this.heading_angle);
    }
  };
};
