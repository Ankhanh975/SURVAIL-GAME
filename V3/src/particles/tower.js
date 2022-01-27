class Tower {
  constructor(size = 2000) {
    this.size = size;
    this.pg = createGraphics(this.size, this.size);
    this.pg.background(0, 0);
    this.pg.push();
    this.pg.fill(255, 255, 255, 255);
    this.pg.circle(this.size / 2, this.size / 2, 25);
    this.pg.pop();
  }
  update() {
    // this.pg.background(100, 100);
    // this.pg.background(100, 4);
    let c = HSVtoRGB((frameCount + 750) / 1000, 1, 1);

    let speed = (frameCount / 7 / 100) * constrain(frameCount, 1, 15);
    this.pg.push();
    this.pg.stroke(...c, 2);
    this.pg.fill(...c, 2);
    // this.pg.strokeWeight(5);
    this.pg.translate(this.size / 2, this.size / 2);
    this.pg.rotate(speed);

    // let size = Prob.normal(0, 50)();
    let size = 0;
    this.pg.arc(
      0,
      0,
      this.size - 14 + size,
      this.size - 14 + size,
      0,
      constrain(speed / 300, radians(10), radians(10))
    );
    this.pg.pop();
    this.pg.push();

    this.pg.fill(255, 150, 150, 200);
    this.pg.noStroke();
    this.pg.circle(this.size / 2, this.size / 2, 10);
    this.pg.pop();
  }
  draw() {
    push();
    // translate(-this.size / 2, -this.size / 2);
    image(this.pg, 0, 0);
    pop();
  }
}
