var myFont;
let img = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];
function preload() {
  // myFont = loadFont("Resources/Steps-Mono.otf");
  myFont = loadFont("Resources/Minecraft.ttf");

  img[0][0] = loadImage("Resources/Animation_0.png");
  img[0][1] = loadImage("Resources/Animation_1.png");
  img[0][2] = loadImage("Resources/Animation_2.png");
  img[0][3] = loadImage("Resources/Animation_3.png");
  img[0][4] = loadImage("Resources/Animation_4.png");
  img[0][5] = loadImage("Resources/Animation_5.png");

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
let obstacles = [];
let frameCount = 0;

function setup() {
  // createCanvas(1024, 768, WEBGL);
  createCanvas(1024, 768);
  frameRate(60); // Attempt to refresh at starting FPS
  imageMode(CENTER);
  rectMode(CENTER);
  // textureMode(IMAGE);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  background(100);

  system = new DetectCollisions.System();
  camera = new Camera();
  sparks = new Sparks();
  players = new Players(system, img);
  // main player, store in players.player but player is a faster way to access
  let id3 = setInterval(() => {
    obstacles.push(new Obstacle([random(-200, 200), random(-200, 200)]));
  }, 150);
  setTimeout(() => {
    clearInterval(id3);
  }, 3000);
  player = new Player(players.img[5]);
  players.players.push(player);
}
function draw() {
  frameCount++;
  translate(width / 2, height / 2);
  // print("frameRate", round(frameRate()));
  // background(100);
  noSmooth();
  // if (mouseX < 10) {
  //   camera.translate(min(10 - mouseX, 10)*10, 0);
  // }
  // if (mouseX > width - 10) {
  //   camera.translate(max(-mouseX + width - 10, -10)*10, 0);
  // }
  // if (mouseY < 10) {
  //   camera.translate(0, min(10 - mouseY, 10)*10);
  // }
  // if (mouseY > height - 10) {
  //   camera.translate(0, max(-mouseY + height - 10, -10)*10);
  // }

  camera.follow(player.pos);
  camera.draw_background();

  let mouse = camera.toWorldCoords();
  players.update(mouse);
  if (isPressed2) {
    sparks.create_particle([mouse.x, mouse.y], [9, 200, 9]);
  }

  if (isPressed && !player.onPunch()) {
    player.startPunch();
    setTimeout(() => {
      players.AIs.forEach((e, i) => {
        let hit = collidePointArc(
          e.pos.x,
          e.pos.y,
          player.pos.x,
          player.pos.y,
          1800,
          radians(0 - 90) + player.angle,
          radians(80)
        );

        if (hit) {
          // print("Hit players.AIs", i);
          e.getHit();
          if (e.health <= 0) {
            players.AIs.splice(i, 1);
          }
        }
      });
    }, 190);
  }

  system.update();
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b.pos;
    let l = createVector(a.pos.x - b.x, a.pos.y - b.y);
    // console.log(overlapV);
    // l.scale(0.0001 / l.len() ** 2);
    l.setMag(50 / (l.mag() - 10));
    // l.scale(1 / mal.len());
    a.pos.x += l.x;
    a.pos.y += l.y;
    a.parent.pos.add(l);
    // console.log("2", a);
  });
  obstacles.forEach((obstacle) => {
    obstacle.draw();
  });
  sparks.draw();
}

let isPressed = false;
let isPressed2 = false;
function mousePressed(event) {
  // console.log("mousePressed", event.button  )
  if (event.button === 0) {
    isPressed = true;
  } else if (event.button === 2) {
    isPressed2 = true;
  }
  return false;
}
function mouseReleased(event) {
  // console.log("mouseReleased", event.button )
  if (event.button === 0) {
    isPressed = false;
  } else if (event.button === 2) {
    isPressed2 = false;
  }
  return false;
}
function mouseClicked(event) {
  // console.log("mouseClicked", event.button  )

  return false;
}
