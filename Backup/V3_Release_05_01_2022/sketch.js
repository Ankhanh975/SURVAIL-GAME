var myFont;
addFunction("preload", () => {
  // myFont = loadFont("Resources/Steps-Mono.otf");
  myFont = loadFont("Resources/Minecraft.ttf");
  // song = loadSound("Resources/C418 - Beginning 2.mp3");
  // song.play();
  // img = loadImage(" Zombie.png");
});

let song;
let sparks;
let camera;
let players;
let system;
let player;
let obstacles;
let mouse;
let queue = new Queue();
let killCount = 0;
let talkative =
  "\n\nHow to play?\nPress awsd, \nspace\nAnd L/R Click, \nF1, F11";
setInterval(() => {
  let t = [
    "\n\nStay close to\nthe origin\nto find more\npeople.\n",
    "\n\nPress F1 if \nyou find out\nthat it \ncramped.\n",
    "\n\nPress F11 to\nplay in \nfullscreen mode!\n\n",
    "\n\nYou can now \nplay the game\nin multiplier!\n\n",
    "\n\nNew to the \ngame? \nRead introduction\nat https://github.com/\nAnkhanh975/SURVAIL-GAME",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  talkative = t[int(random(0, t.length))];
}, 2000);
addFunction("setup", () => {
  // frameRate(15);
  // createCanvas(1024, 768, WEBGL);
  // createCanvas(windowWidth, windowHeight);
  createCanvas(1024, 768);
  imageMode(CENTER);
  // rectMode(CENTER);
  // textureMode(IMAGE);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  background(100);
});

addFunction("setup", () => {
  system = new DetectCollisions.System();
  // system.result = system.createResult();
  camera = new Camera();
  sparks = new Sparks();
  // main player, store in players.player but player is a faster way to access
  players = new Players(system);
  player = new Player(players.img[5], players);
  player.health = 100;
  player.totalHealth = 100;
  player.recovery = 0.4;
  obstacles = new Obstacles();
  players.players.push(player);
});

addFunction("draw", () => {
  translate(width / 2, height / 2);
  if (player.health < 0) {
    scale(0.75);
  }
  // print("frameRate", round(frameRate()));
  // background(100);
  noSmooth();
  mouse = camera.toWorldCoords();
});

addFunction("draw", () => {
  if (isPressed2) {
    sparks.create_particle([mouse.x, mouse.y], [9, 200, 9]);
    if (frameCount % 3 === 0) {
      obstacles.createObstacle(mouse);
    }
  }
  // if (isPressed && !player.onPunch()) {
  //   // shake
  // var r = Prob.normal(0, 2.8);
  //   setTimeout(() => {
  //     let id66 = setInterval(() => {
  //       shake = [r(), r()];
  //       queue.addPro(`
  //         translate(${r()}, ${r()})
  //       `);
  //     }, 16);
  //     setTimeout(() => {
  //       clearInterval(id66);
  //     }, 16 * 5.5);
  //   }, 191);
  // }

  // if (isPressed && !player.onPunch()) {
  //
  //   setTimeout(() => {
  //     queue.addDraw(`
  //     push();
  //     translate(player.pos.x, player.pos.y);
  //     rotate(radians(0 - 90) + player.angle);
  //     fill(255, 0, 0, 100);
  //     stroke(255, 255, 0, 200);
  //     strokeWeight(4);

  //     arc(
  //       0,
  //       0,
  //       2 * 250,
  //       2 * 250,
  //       // -(player.angle ) / 2,
  //       // +(player.angle ) / 2,
  //       -radians(80) / 2,
  //       radians(80) / 2,
  //       PIE
  //     );
  //     pop();
  //     `);
  //   }, 190);
  // }

  // if (isPressed && !player.onPunch()) {
  if (isPressed && (frameCount % 24 === 0 || !player.onPunch())) {
    player.startPunch();
  }

  // Should be in this exact order
  queue.updatePro();
  players.update(mouse, null);
  onController(player);
  system.update();
  obstacles.update();
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b;
    if (a.parent instanceof Player && b.parent instanceof Player) {
      let l = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
      // console.log(overlapV);
      let newMag = 110 / max(l.mag() - 35, 7) ** 2;
      l.setMag(newMag);
      // l.setMag(50 / l.mag());

      a.parent.addPos(l);
    }
  });
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b;
    if (a.parent instanceof Player && b.parent instanceof Obstacle) {
      // Player inside a obstacle
      let l = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);

      a.parent.setPos(a.parent.lastPos.copy());

      let newMag = 110 / max(l.mag() - 35, 7) ** 2;
      l.setMag(newMag);
      // l.setMag(50 / l.mag());

      // a.parent.addPos(l);
    }
  });
});
addFunction("draw", () => {
  push();
  camera.follow(players.players[0].pos);
  camera.draw_background();
  {
    // Draw spawn at position 0, 0
    push();
    let c = HSVtoRGB(0.5, 0.5, 1);
    fill(...c, 125);
    circle(0, 0, 50);

    pop();
  }
  queue.updateDraw();
  players.draw();
  obstacles.draw();
  sparks.draw();
  pop();
  menu.display(
    `\
  Players: ${players.players.length}
  FPS: ${int(frameRate())}

  Kill: ${killCount}
  Pos: ${int(player.pos.x)}, ${int(player.pos.y)}

  Game make
  by KHANH.

  `
  );
  // menu.display(
  //   `Kill: ${killCount}\nPos: ${int(player.pos.x)}, ${int(player.pos.y)}` +
  //     talkative
  // );
  chatbox.draw();
});
function mouseClicked(event) {
  // console.log("mouseClicked", event.button  )
  // player.startPunch();
  return false;
}
function keyPressed() {
  // console.log("keyPressed", keyCode);
  // if pressed Enter => jump
  if (keyCode === 32) {
    function f(x, variance = 2.75, mu = 0) {
      // follow a normal curve
      return (
        Math.exp(-((-x - mu) * (-x - mu)) / (2 * variance * variance)) /
        (variance * sqrt(2 * Math.PI))
      );
    }
    let start = millis();

    let id99 = setInterval(() => {
      let delta = p5.Vector.sub(player.pos, player.lastPos);
      let toLookAt = p5.Vector.sub(player.lookAt, player.pos);
      // toLookAt.setMag(15);
      toLookAt.setMag(0);
      // delta.setMag(0);

      if (delta.mag() < 5) {
        delta.setMag(0);
      } else {
        delta.setMag(25);
      }
      let deltaT = (millis() - start) / 16 - 3.2;
      let d = p5.Vector.add(delta, toLookAt);
      d.setMag(d.mag() * f(deltaT) * 10);
      // console.log("d", deltaT, f(deltaT));
      // console.log("d", d.x, d.y);
      // idea: only follow in x-axis or y-axis
      if (abs(d.x) > abs(d.y)) {
        d.y = 0;
        // console.log("set d", d);
      } else {
        d.x = 0;
        // console.log("set d", d);
      }
      player.addPos(d);
    }, 16);
    setTimeout(() => {
      clearInterval(id99);
    }, 16 * 5);

    // shake
    // let id66 = setInterval(() => {
    //   queue.addPro(`
    //         translate(${Prob.normal(0, 2)()}, ${Prob.normal(0, 2)()})
    //       `);
    // }, 16);
    // setTimeout(() => {
    //   clearInterval(id66);
    // }, 16 * 5.5);
  }
}
