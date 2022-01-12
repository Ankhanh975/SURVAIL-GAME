let sparks;
let camera;
let players;
let system;
let player;
let obstacles;
let mouse;
let queue = new Queue();
let killCount = 0;
let mousePos = [];
addFunction("setup", () => {
  // frameRate(15);
  // createCanvas(1024, 768, WEBGL);
  // createCanvas(1024, 768);
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // TODO
  // colorMode(HSB, 255);

  // rectMode(CENTER);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  background(100);
});

addFunction("setup", () => {
  system = new Collisions();
  sparks = new Sparks();
  obstacles = new Obstacles();
  camera = new Camera();
  players = new Players();

  // main player, store in players.player but player is a faster way to access
  player = new Player(players.img[5], players);
  player.health = 1000;
  player.totalHealth = 1000;
  player.damage = 4.5;
  player.recovery = 0.001 * player.health;
  players.players[0] = player;
  players.realPlayers = [player];

  let friend = new Player(players.img[5], players);
  friend.health = 400;
  friend.totalHealth = 400;
  friend.name = "friend";
  friend.damage = 2.5;
  friend.addPos(createVector(100, 0));
  friend.recovery = 0.001 * friend.health;
  players.players[1] = friend;
  players.realPlayers.push(friend);
});

addFunction("draw", () => {
  mouse = camera.toWorldCoords();

  {
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
  }

  if (isPressed && !player.onPunch()) {
    player.startPunch();
    sparks.create_particle(player.pos, [255, 0, 0], 3.5);
  }
  if (isPressed2) {
    // let line = lineBresenham_1(
    //   mouse.x,
    //   mouse.y,
    //   mousePos[mousePos.length - 1][0],
    //   mousePos[mousePos.length - 1][1]
    // );
    // console.log(line);
    // line.forEach((point) => {
    //   obstacles.createObstacle({ x: point[0], y: point[1] });
    // });
    obstacles.createObstacle(mouse);
    sparks.create_particle(mouse, [9, 200, 9]);
  }
  mousePos.push([mouse.x, mouse.y]);

  if (mousePos.length > 30) {
    mousePos.shift();
  }
  // onController need to after players.update

  queue.updatePro();
  players.update(mouse);
  onController(player);
  obstacles.update();
  // system.update();

  players.players.forEach((player) => {
    system.getPotentials(player.circle).forEach((collider) => {
      if (system.checkCollision(player.circle, collider)) {
        const { overlapV } = system.response;
        const b = system.response.b.parent;

        let x = -overlapV.x;
        let y = -overlapV.y;
        const pushOut = createVector(x, y);
        pushOut.setMag(pushOut.mag() * 0.75);
        pushOut.limit(5);

        const pushOut2 = createVector(x, y);
        pushOut2.setMag(pushOut2.mag() * -0.25);
        pushOut2.limit(5);
        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
        try {
          b.pos.add(pushOut2);
          b.circle.setPosition(b.pos.x, b.pos.y);
        } catch (TypeError) {}
      }
    });
  });
});

addFunction("draw", () => {
  // translate(0.5, 0.5);
  translate(width / 2, height / 2);
  if (player.health < 0) {
    scale(0.75);
  }
  if (width < 500) {
    scale(0.5);
  }
  // background(100);
  noSmooth();
});
addFunction("draw", () => {
  push();
  camera.follow(player.pos);
  camera.draw_background();
  // {
  //   // Draw spawn at position 0, 0
  push();
  let c = HSVtoRGB((frameCount % 1000) / 1000, 0.9, 0.7);
  fill(...c, 75);
  circle(0, 0, 100);

  pop();
  //   for (let i = 0; i < 5; i++) {
  //     let particle = tower.create_particle(
  //       createVector(0, 0),
  //       [1758, 255, 255, 200],
  //       5
  //     );
  //     particle.move(2.5);
  //   }
  //   tower.update();
  //   tower.draw();
  // }

  if (players.players[3]) {
    let path = players.players[3].path;
    path.forEach((e, i) => {
      push();
      fill(0, 0, 255, 90);
      circle(e[0], e[1], 40 + i * 3);
      pop();
    });
  }

  queue.updateDraw();
  sparks.draw();
  players.draw();
  obstacles.draw();

  pop();
  fpsMeter.tick();
  menu.display(
    `\
Players: ${players.players.length}
Kill: ${killCount}
Pos: ${int(player.pos.x)}, ${int(player.pos.y)}
Window Size: \n${width}, ${height}
` + talkative
  );

  // Game make
  // by KHANH.

  chatbox.draw();
});

//   // shake
// if (isPressed && !player.onPunch()) {
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
