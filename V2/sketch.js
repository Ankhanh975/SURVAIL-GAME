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
let obstacles;
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
  // main player, store in players.player but player is a faster way to access
  players = new Players(system, img);
  player = new Player(players.img[5]);
  obstacles = new Obstacles();
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
  if (isPressed2) {
    sparks.create_particle([mouse.x, mouse.y], [9, 200, 9]);
    if (frameCount % 3 === 0) {
      obstacles.createObstacle(mouse);
    }
  }

  if (isPressed && !player.onPunch()) {
    player.startPunch();
    setTimeout(() => {
      players.AIs.concat(obstacles.obstacles).forEach((e, i) => {
        let hit = collidePointArc(
          e.pos.x,
          e.pos.y,
          player.pos.x,
          player.pos.y,
          250,
          radians(0 - 90) + player.angle,
          radians(80)
        );

        if (hit) {
          // print("Hit players.AIs", i);
          e.getHit();
          if (e.health < 0) {
            players.AIs.splice(i, 1);
          } else {
            let id2 = setInterval(() => {
              let l = p5.Vector.sub(player.pos, e.pos);
              l.setMag(-max(18888 / l.mag(), 12));

              // l.scale(1 / mal.len());
              e.circle.pos.x += l.x;
              e.circle.pos.y += l.y;
              e.pos.add(l);
            }, 16.6);
            setTimeout(() => {
              clearInterval(id2);
            }, 16.6 * 2);
          }
        }
      });
    }, 190);
  }
  // Should be in this exact order
  players.update(mouse);
  system.update();
  obstacles.update();

  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b;
    let l = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
    if (a.parent instanceof Player && b.parent instanceof Player) {
      // console.log(overlapV);
      let newMag = 110 / max(l.mag() - 35, 7) ** 2;
      l.setMag(newMag);
      // l.setMag(50 / l.mag());

      a.parent.addPos(l);
    } else if (a.parent instanceof Player && b.parent instanceof Obstacle) {
      // Player inside a obstacle
      a.parent.setPos(a.parent.lastPos.copy());
      // l.setMag(-.1);
      // b.parent.circle.pos.x += l.x;
      // b.parent.circle.pos.y += l.y;
      // b.parent.pos.add(l);
    }
  });
  players.draw();
  obstacles.draw();
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
