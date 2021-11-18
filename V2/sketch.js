var myFont;
function preload() {
  // myFont = loadFont("Resources/Steps-Mono.otf");
  myFont = loadFont("Resources/Minecraft.ttf");

  // song = loadSound("Resources/C418 - Beginning 2.mp3");
  // song.play();
  // img = loadImage(" Zombie.png");
}

let song;
let sparks;
let camera;
let players;
let player;
let system;
function setup() {
  createCanvas(1024, 768, WEBGL);
  // frameRate(30); // Attempt to refresh at starting FPS
  frameRate(60); // Attempt to refresh at starting FPS
  imageMode(CENTER);
  // rectMode(CENTER);
  // textureMode(IMAGE);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  background(100);

  system = new DetectCollisions.System();
  camera = new Camera();
  sparks = new Sparks();
  players = new Players(system);
  // main player, store in players.player but player is a faster way to access

  player = new Player(players.img[5]);
  players.players.push(player);
}
let frameCount = 0;
function draw() {
  frameCount++;
  // print("frameRate", round(frameRate()));
  // translate(-width / 2, -height / 2);
  // background(100);
  noSmooth();
  // if (mouseX < 90) {
  //   camera.translate(min(90 - mouseX, 90), 0);
  // }
  // console.log("Translate", -mouseX + width - 90);
  // if (mouseX > width - 90) {
  //   camera.translate(max(-mouseX + width - 90, -90), 0);
  // }
  // if (mouseY < 90) {
  //   camera.translate(0, min(90 - mouseY, 90));
  // }
  // if (mouseY > height - 90) {
  //   camera.translate(0, max(-mouseY + height - 90, -90));
  // }

  camera.follow(player.pos);
  camera.draw_background();

  let mouse = camera.toWorldCoords();
  players.update(mouse);
  // if (isPressed) {
  //   sparks.create_particle([mouse.x, mouse.y], [9, 200, 9]);
  // }
  if (isPressed && !player.onPunch()) {
    player.startPunch();
    setTimeout(() => {
      players.AIs.forEach((e, i) => {
        let hit = collidePointArc(
          e.pos.x,
          e.pos.y,
          player.pos.x,
          player.pos.y,
          180,
          radians(0 - 90) + player.angle,
          radians(80)
        );

        if (hit) {
          print("Hit players.AIs", i);
          e.getHit();
          if (e.health <= 0) {
            players.AIs.splice(i, 1);
          }
        }
      });
    }, 185);
  }

  sparks.draw();
}

let isPressed = false;
function mousePressed(event) {
  if (event.button === 0) {
    isPressed = true;
  }
  return false;
}
function mouseReleased(event) {
  if (event.button === 0) {
    isPressed = false;
  }
  return false;
}
function mouseClicked() {
  return false;
}
