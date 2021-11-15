var myFont;
function preload() {
  myFont = loadFont("Resources/Steps-Mono.otf");

  // song = loadSound("Resources/C418 - Beginning 2.mp3");
  // song.play();
  // img = loadImage(" Zombie.png");

  img.push(loadImage("Resources/Animation_0.png"));
  img.push(loadImage("Resources/Animation_1.png"));
  img.push(loadImage("Resources/Animation_2.png"));
  img.push(loadImage("Resources/Animation_3.png"));
  img.push(loadImage("Resources/Animation_4.png"));
  img.push(loadImage("Resources/Animation_5.png"));
}

let img = [];
let song;
let player;
let sparks;
function setup() {
  createCanvas(1024, 768, WEBGL);
  frameRate(60); // Attempt to refresh at starting FPS
  rectMode(CENTER);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  // textureMode(IMAGE)
  player = new Player(img);
  sparks = new Sparks();
}
function draw() {
  // background(255, 255, 255, 25);
  background(100);
  translate(-width / 2, -height / 2);
  if (isPressed) {
    sparks.create_particle([mouseX, mouseY], (num = 1));
  }
  sparks.draw();
  let mouse = createVector(mouseX, mouseY);
  player.update(mouse, (onController = true));
  player.drawPlayer();
  player.drawNameTag();
}
function mouseClicked() {
  player.startPunch();
}

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
