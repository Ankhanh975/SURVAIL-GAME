var effects = [];
var particleAmt = 32; // number of particles to draw per explosion

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  // console.log("effects.length", effects.length);
  effects.forEach((ps, i) => {
    if (ps.isDead()) {
      effects.splice(i, 1);
      return;
    }
    ps.run();
  });
  if (frameCount % 10 === 0) {
    var s = new RocketExplosion(mouseX, mouseY);
    // var s = new BombExplosion(mouseX, mouseY);
    // var s = new ShrapnelExplosion(mouseX, mouseY);
    for (var i = 0; i < particleAmt; i++) {
      s.addParticle();
    }
    effects.push(s);
  }
}
function mousePressed() {
  console.log("mousePressed");
  // var s = new RocketExplosion(this.pos.x, this.pos.y);
  var s = new RocketExplosion(mouseX, mouseY);
  // var s = new BombExplosion(mouseX, mouseY);
  // var s = new ShrapnelExplosion(mouseX, mouseY);
  for (var i = 0; i < particleAmt; i++) {
    s.addParticle();
  }
  effects.push(s);
}
