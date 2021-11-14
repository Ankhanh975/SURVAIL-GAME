let img;
function preload() {
  img = loadImage("Animation_0.png");
  // img = loadImage("Animation_1.png");
  // img = loadImage("Animation_2.png");
  // img = loadImage("Animation_3.png");
  // img = loadImage("Animation_4.png");
  // img = loadImage("Animation_5.png");
  // img = loadImage(" Zombie.png");
 
}

class Player {
  constructor(color) {
    this.pos = createVector(0, 0);
    this.lookAt = createVector(0, 0);
    this.normal = createVector(0, -1);
  }
  drawPlayer() {
    // console.log(this.pos, this.lookAt);
    let vec = p5.Vector.sub(this.lookAt, this.pos)
    let angle = this.normal.angleBetween(vec);
    // print(angle);

    push();
    translate(this.pos);
    rotate(angle);
    texture(img);
    noStroke();
    rect(0, 0, 196, 196);
    pop();
  }
  update(lookAt) {
    this.lookAt = lookAt;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.pos.x -= 5;
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.pos.x += 5;
    } else if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.pos.y -= 5;
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.pos.y += 5;
    }
  }
}
let player;

function setup() {
  createCanvas(400, 400, WEBGL);
  frameRate(60); // Attempt to refresh at starting FPS
  rectMode(CENTER);
  angleMode(DEGREES);
  // textureWrap(REPEAT);
  // textureMode(IMAGE)
  player = new Player();
}
function draw() {
  // background(255, 255, 255, 25);

  background(100);
  translate(-width / 2, -height / 2);

  let mouse = createVector(mouseX, mouseY);
  player.update(mouse);
  player.drawPlayer();
  
}
