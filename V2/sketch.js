var myFont;
function preload() {
  // myFont = loadFont("Resources/Steps-Mono.otf");
  myFont = loadFont("Resources/Minecraft.ttf");

  // song = loadSound("Resources/C418 - Beginning 2.mp3");
  // song.play();
  // img = loadImage(" Zombie.png");

  img[0].push(loadImage("Resources/Animation_0.png"));
  img[0].push(loadImage("Resources/Animation_1.png"));
  img[0].push(loadImage("Resources/Animation_2.png"));
  img[0].push(loadImage("Resources/Animation_3.png"));
  img[0].push(loadImage("Resources/Animation_4.png"));
  img[0].push(loadImage("Resources/Animation_5.png"));
}

let img = [[], [], [], [], [], []];
let song;
let player;
let sparks;
let enemy = [];
const system = new DetectCollisions.System();
let camera;

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
  [
    [255, 255, 0],
    [0, 0, 255],
    [248, 147, 29],
    [0, 255, 0],
    [255, 0, 0],
  ].forEach((color, ii) => {
    for (let i = 0; i < img[0].length; i++) {
      img[ii + 1].push(createImage(img[0][0].width, img[0][0].height));
      img[ii + 1][i].copy(
        img[0][i],
        0,
        0,
        img[0][0].width,
        img[0][0].height,
        0,
        0,
        img[0][0].width,
        img[0][0].height
      );
      change(img[ii + 1][i], [255, 255, 255], color);
    }
  });

  camera = new Camera();
  sparks = new Sparks();
  player = new Player(img[5]);

  for (let index = 0; index < 59; index++) {
    let pos = p5.Vector.random2D().setMag(210 + random(0, 150));
    // print(pos);
    enemy.push(new AIPlayer(img[int(random(0, 5))], [pos.x, pos.y]));
    // enemy.push(new AIPlayer(img[int(random(0, 5))], [0, 150]));
  }
  setInterval(function gameTick() {
    print("gameTick");
    if (enemy.length < 59) {
      let pos = p5.Vector.random2D().setMag(210 + random(0, 150));

      enemy.push(new AIPlayer(img[int(random(0, 5))], [pos.x, pos.y]));
    }
  }, 1000);
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
  system.update();
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b.pos;
    let l = createVector(a.pos.x - b.x, a.pos.y - b.y);
    // console.log(overlapV);
    // l.scale(0.0001 / l.len() ** 2);
    l.setMag(0.02 / mag(l) ** 2);
    // l.scale(1 / mal.len());
    a.pos.x += l.x;
    a.pos.y += l.y;
    a.parent.pos.add(l);
    // console.log("2", a);
  });

  let mouse = camera.toWorldCoords();
  if (isPressed) {
    sparks.create_particle([mouse.x, mouse.y], 1, [240, 251, 252]);
  }
  if (isPressed && !player.onPunch()) {
    player.startPunch();
    setTimeout(() => {
      enemy.forEach((e, i) => {
        print("forEach", i, frameCount);
        let dist = player.pos.dist(e.pos);
        if (dist < 140) {
          print("Hit enemy");
          e.getHit();
          if (e.health <= 0) {
            enemy.splice(i, 1);
          }
        }
      });
    }, 185);
  }

  player.update(mouse, (onController = true));
  player.drawPlayer();
  player.drawNameTag();

  enemy.forEach((e) => {
    e.update(enemy, [player]);
    e.drawPlayer();
    // e.drawNameTag();
  });
  sparks.draw();
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
