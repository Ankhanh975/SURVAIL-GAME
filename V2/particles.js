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
    let rotate_sign;
    rotate_direction = ((angle - this.angle + PI * 3) % (PI * 2)) - PI;
    try {
      rotate_sign = abs(rotate_direction) / rotate_direction;
    } catch {
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
  constructor() {
    this.particles = [];
  }
  update() {
    let l = this.particles.length;
    for (let i = 0; i < l; i++) {
      this.particles[l - i - 1].move(1);

      if (!this.particles[l - i - 1].alive) {
        this.particles.pop(l - i - 1);
      }
    }
  }
  create_particle(
    loc,
    num = 1,
    angle = null,
    speed = null,
    color = [254, 254, 254],
    scale = 2.1
  ) {
    //  num{ number of particles to create
    for (let i = 0; i < num; i++) {
      if (angle === null) {
        angle = radians(random(0, 360));
      }
      if (speed === null) {
        speed = random(3, 6);
      }
      let n = new Spark(loc, angle, speed, color, scale);
      this.particles.push(n);
    }
  }
    draw() {
      this.update()
    for (let spark of this.particles) {
      spark.draw();
    }
  }
}
let sparks 

function setup() {
  createCanvas(500, 500);
    frameRate(60);
    sparks = new Sparks();
}
function draw() {
  background(0);
    if (isPressed) {
        
        sparks.create_particle([mouseX, mouseY], num = 3);
        sparks.draw();
        
    }
//   for (var i = sparks.length - 1; i >= 0; i--) {
//     sparks[i].move(1);
//     sparks[i].draw();
//     if (!sparks[i].alive) {
//       sparks.pop(i);
//     }
//   }
}

// function keyPressed() {
//   print("keyPressed", mouseX, mouseY);
//   sparks.push(
//     new Spark(
//       [mouseX, mouseY],
//       radians(random(0, 360)),
//       random(3, 6),
//       [255, 255, 255],
//       2
//     )
//   );

//   sparks.push(
//     new Spark(
//       [mouseX, mouseY],
//       radians(random(0, 360)),
//       random(3, 6),
//       [255, 255, 255],
//       2
//     )
//   );

//   sparks.push(
//     new Spark(
//       [mouseX, mouseY],
//       radians(random(0, 360)),
//       random(3, 6),
//       [255, 255, 255],
//       2
//     )
//   );
// }
let isPressed = false;
function mousePressed(event) {
  if (event.button === 0) {
    isPressed = true;
  }
}
function mouseReleased(event) {
  if (event.button === 0) {
    isPressed = false;
  }
}
