let pg;

class tower {
  constructor(size = 100) {
    this.size = size;
    this.pg = createGraphics(this.size, this.size);
    this.pg.background(0);
  }
  update() {
    this.pg.background(51, 50);

    this.pg.push();
    let c = HSVtoRGB((frameCount % 750) / 750, 0.9, 0.7);
    this.pg.fill(...c, 200);
    this.pg.circle(this.size / 2, this.size / 2, this.size);
    this.pg.pop();

    this.pg.push();
    this.pg.stroke(0, 0, 0, 200);
    this.pg.translate(this.size / 2, this.size / 2);
    this.pg.rotate(frameCount / 100.0);
    this.pg.line(0, 0, this.size / 2, 0);
    this.pg.HSVtoRGB;
    this.pg.pop();
  }
  draw() {
    push();
    translate(-this.size / 2, -this.size / 2);
    image(this.pg, 0, 0);
    pop();
  }
}
function setup() {
  createCanvas(400, 400);
  pg = new tower();
  background(51);
  rectMode(CENTER);
}

function draw() {
  background(51, 50);
  pg.update();
  translate(201, 201);
  pg.draw();
}
