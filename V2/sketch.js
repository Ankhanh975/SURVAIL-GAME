// let img;
// let song;

// function preload() {
//   song = loadSound("Resources/C418 - Beginning 2.mp3");

//   img = loadImage("Animation_0.png");
//   // img = loadImage("Animation_1.png");
//   // img = loadImage("Animation_2.png");
//   // img = loadImage("Animation_3.png");
//   // img = loadImage("Animation_4.png");
//   // img = loadImage("Animation_5.png");
//   // img = loadImage(" Zombie.png");
// }

// let player;
// function polygon(x, y, radius, npoints) {
//   push();
//   angleMode(RADIANS);
//   let angle = TWO_PI / npoints;
//   beginShape();
//   for (let a = 0; a < TWO_PI; a += angle) {
//     let sx = x + cos(a) * radius;
//     let sy = y + sin(a) * radius;
//     vertex(sx, sy);
//   }
//   endShape(CLOSE);
//   pop();
// }

// function setup() {
//   createCanvas(1024, 768, WEBGL);
//   frameRate(60); // Attempt to refresh at starting FPS
//   rectMode(CENTER);
//   angleMode(DEGREES);

//   // textureWrap(REPEAT);
//   // textureMode(IMAGE)
//   player = new Player();
//   // song.play();
// }
// function draw() {

//   // background(255, 255, 255, 25);
//   // background(100);
//   polygon(0, 0, 82, 3);
//   translate(-width / 2, -height / 2);

//   let mouse = createVector(mouseX, mouseY);
//   player.update(mouse);
//   player.drawPlayer();
// }







































































































































































