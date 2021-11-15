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
let enemy = [];

let camera;

function setup() {
  createCanvas(1024, 768, WEBGL);
  frameRate(60); // Attempt to refresh at starting FPS
  rectMode(CENTER);
  textureMode(IMAGE);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);

  player = new Player(img);
  camera = new Camera();
  sparks = new Sparks();

  for (let index = 0; index < 100; index++) {
    enemy.push(new Player(img, "n", [random(0, 400), random(0, 400)]));
  }
}

function draw() {
  // print("frameRate", round(frameRate()));
  // translate(-width / 2, -height / 2);
  background(100);

  camera.follow(player.pos);
  camera.draw_background();

  let mouse = camera.toWorldCoords();
  if (isPressed) {
    sparks.create_particle([mouse.x, mouse.y], (num = 1));
  }
  sparks.draw();
  player.update(mouse, (onController = true));
  player.drawPlayer();
  player.drawNameTag();

  // enemy.forEach((e) => {
  //   e.update(mouse);
  //   e.drawPlayer();
  //   e.drawNameTag();
  // });
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
