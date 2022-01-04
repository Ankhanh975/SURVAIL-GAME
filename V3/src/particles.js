function polygon(color, points) {
  // print("polygon", color, points[0], typeof points, typeof color);
  push();
  fill(...color);
  stroke(...color);
  // noStroke()
  // strokeWeight(10)
  beginShape();
  for (let point of points) {
    vertex(...point);
  }

  endShape();
  pop();
}

class Spark {
  //  By https://www.youtube.com/watch?v=wNMRq_uoWM0
  constructor(loc, angle, speed, color, scale = 1) {
    // console.log("this.color", this.color, color);

    this.loc = loc;
    this.angle = angle;
    this.speed = speed;
    this.scale = scale;
    this.color = color;
    this.alive = true;
  }

  point_towards(angle, rate) {
    rotate_direction = ((angle - this.angle + PI * 3) % (PI * 2)) - PI;
    let rotate_sign = abs(rotate_direction) / rotate_direction;
    if (rotate_sign === NaN) {
      rotate_sing = 1;
    }
    if (abs(rotate_direction) < rate) {
      this.angle = angle;
    } else {
      this.angle += rate * rotate_sign;
    }
  }

  calculate_movement(dt) {
    return [
      cos(this.angle) * this.speed * dt,
      sin(this.angle) * this.speed * dt,
    ];
  }
  move(dt) {
    let movement = this.calculate_movement(dt);
    this.loc[0] += movement[0];
    this.loc[1] += movement[1];
    this.speed -= 0.085 + 0.025 * this.speed;
    this.angle += 0.075
    if (this.speed <= 0) {
      this.alive = false;
    }
  }
  draw() {
    if (this.alive) {
      let points = [
        [
          this.loc[0] + cos(this.angle) * this.speed * this.scale,
          this.loc[1] + sin(this.angle) * this.speed * this.scale,
        ],
        [
          this.loc[0] +
            cos(this.angle + PI / 2) * this.speed * this.scale * 0.3,
          this.loc[1] +
            sin(this.angle + PI / 2) * this.speed * this.scale * 0.3,
        ],
        [
          this.loc[0] - cos(this.angle) * this.speed * this.scale * 3.5,
          this.loc[1] - sin(this.angle) * this.speed * this.scale * 3.5,
        ],
        [
          this.loc[0] +
            cos(this.angle - PI / 2) * this.speed * this.scale * 0.3,
          this.loc[1] -
            sin(this.angle + PI / 2) * this.speed * this.scale * 0.3,
        ],
      ];
      // console.log("this.color", this.color);
      polygon(this.color, points);
    }
  }
}

class Sparks {
  // Draw particles effects
  constructor() {
    this.particles = [];
  }
  update() {
    let l = this.particles.length;
    for (var i = l - 1; i >= 0; i--) {
      this.particles[i].move(1);

      if (this.particles[i].alive === false) {
        this.particles.splice(i, 1);
        // this.particles.pop();
      }
    }
  }
  create_particle(
    loc,
    color = [240, 20, 20],
    scale = 2.1,
    speed = null,
    angle = null
  ) {
    if (angle === null) {
      angle = radians(random(0, 360));
    }
    if (speed === null) {
      speed = random(3, 6);
    }
    let n = new Spark(loc, angle, speed, color, scale);
    this.particles.push(n);
  }
  draw() {
    this.update();
    for (let spark of this.particles) {
      spark.draw();
    }
  }
}

// let sparks;

// function setup() {
//   createCanvas(500, 500);
//   frameRate(60);
//   sparks = [];
//   sparks = new Sparks();
// }
// function draw() {
//   background(0);
//   if (isPressed) {
//     sparks.create_particle([mouseX, mouseY], (num = 1));
//   }
//   sparks.draw();
//   // if (isPressed) {
//   //   sparks.push(
//   //     new Spark(
//   //       [mouseX, mouseY],
//   //       random(0, 360),
//   //       random(3, 6),
//   //       [255, 255, 255],
//   //       2
//   //     )
//   //   );
//   // }

//   // for (var i = sparks.length - 1; i >= 0; i--) {
//   //   sparks[i].move(1);
//   //   sparks[i].draw();
//   //   if (sparks[i].alive===false) {
//   //     // sparks.pop(i);
//   //     sparks.splice(i, 1);

//   //   }
//   // }
// }

// // function keyPressed() {
// //   print("keyPressed", mouseX, mouseY);
// //   sparks.push(
// //     new Spark(
// //       [mouseX, mouseY],
// //       random(0, 360),
// //       random(3, 6),
// //       [255, 255, 255],
// //       2
// //     )
// //   );
// // }
// let isPressed = false;
// function mousePressed(event) {
//   if (event.button === 0) {
//     isPressed = true;
//   }
// }
// function mouseReleased(event) {
//   if (event.button === 0) {
//     isPressed = false;
//   }
// }
