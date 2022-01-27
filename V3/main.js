let sparks;
let camera;
let players;
let player;
let obstacles;
let mouse;
let queue = new Queue();
let killCount = 0;
let mousePos = [];
addFunction("setup", () => {
  // frameRate(15);
  // createCanvas(1024, 768, WEBGL);
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // TODO
  // colorMode(HSB, 255);

  // rectMode(CENTER);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  // background(100);
});

addFunction("setup", () => {
  sparks = new Sparks();
  obstacles = new Obstacles();
  camera = new Camera();
  players = new Players();

  // main player, store in players.player but player is a faster way to access
  player = new Player(players.img[5], players);
  player.addComponent(component.onController);
  player.addComponent(component.jump);
  player.addComponent(component.placeObstacle);
  player.health = 1000;
  player.totalHealth = 1000;
  player.damage = 4.5;
  player.recovery = 0.001 * player.health;

  players.players[0] = player;
  players.realPlayers = [player];

  // let friend = new Player(players.img[5], players);
  // friend.health = 400;
  // friend.totalHealth = 400;
  // friend.name = "friend";
  // friend.damage = 2.5;
  // friend.addPos(createVector(100, 0));
  // friend.recovery = 0.001 * friend.health;
  // players.players[1] = friend;
  // players.realPlayers.push(friend);
  for (let index = 0; index < 1; index++) {
    players.createAIPlayer();
  }
});

addFunction("draw", () => {
  mouse = camera.toWorldCoords();

  if (isPressed && !player.onPunch()) {
    player.startPunch();
    sparks.create_particle(player.pos, [255, 0, 0], 3.5);
  }

  mousePos.push([mouse.x, mouse.y]);

  if (mousePos.length > 30) {
    mousePos.shift();
  }
  // onController need to after players.update

  queue.updatePro();
  player.setAngle(p5.Vector.sub(mouse, player.pos).heading());
  players.update();
  obstacles.update();
  collisions.update();

  players.players.forEach((player) => {
    collisions.checkOne(player.circle, (response) => {
      const x = -response.overlapV.x;
      const y = -response.overlapV.y;
      const b = response.b.parent;
      const pushOut = createVector(x, y);
      if (response.b.parent instanceof Player) {
        const pushOut2 = createVector(x, y);

        pushOut.setMag(pushOut.mag() * 0.6);
        pushOut2.setMag(pushOut2.mag() * -0.4);
        pushOut.limit(5);
        pushOut2.limit(5);
        
        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
        b.pos.add(pushOut2);
        b.circle.setPosition(b.pos.x, b.pos.y);
      } else if (response.b.parent instanceof Obstacle) {
        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
      }
    });
  });
  players.players.forEach((player) => {
    collisions.checkOne(player.circle, (response) => {
      const x = -response.overlapV.x;
      const y = -response.overlapV.y;
      const b = response.b.parent;
      const pushOut = createVector(x, y);
      if (response.b.parent instanceof Player) {
        const pushOut2 = createVector(x, y);
        pushOut.limit(10);
        pushOut2.limit(10);

        pushOut.setMag(pushOut.mag() * 0.6);
        pushOut2.setMag(pushOut2.mag() * -0.4);

        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
        b.pos.add(pushOut2);
        b.circle.setPosition(b.pos.x, b.pos.y);
      } else if (response.b.parent instanceof Obstacle) {
        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
      }
    });
  });
  players.players.forEach((player) => {
    collisions.checkOne(player.circle, (response) => {
      const x = -response.overlapV.x;
      const y = -response.overlapV.y;
      const b = response.b.parent;
      const pushOut = createVector(x, y);
      if (response.b.parent instanceof Player) {
        const pushOut2 = createVector(x, y);
        pushOut.limit(15);
        pushOut2.limit(15);

        pushOut.setMag(pushOut.mag() * 0.6);
        pushOut2.setMag(pushOut2.mag() * -0.4);

        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
        b.pos.add(pushOut2);
        b.circle.setPosition(b.pos.x, b.pos.y);
      } else if (response.b.parent instanceof Obstacle) {
        player.pos.add(pushOut);
        player.circle.setPosition(player.pos.x, player.pos.y);
      }
    });
  });
});

addFunction("draw", () => {
  if (player.health < 0) {
    scale(0.75);
  }
  if (width < 500) {
    scale(0.5);
  }
});
addFunction("draw", () => {
  push();
  camera.follow(player.pos);
  camera.draw_background();
  // {
  //   // Draw spawn at position 0, 0
  push();
  let c = HSVtoRGB((frameCount % 750) / 750, 0.9, 0.7);
  fill(...c, 75);
  circle(0, 0, 100);

  pop();

  // if (players.players[1]) {
  //   let path = players.players[1].path;
  //   path.forEach((e, i) => {
  //     push();
  //     fill(0, 0, 255, 90);
  //     circle(e[0], e[1], 40 + i * 3);
  //     pop();
  //   });
  // }
  if (isPressed) {
    push();
    translate(player.pos.x, player.pos.y);
    rotate(radians(0 - 90) + player.getAngle());
    fill(255, 0, 0, 90);
    stroke(255, 255, 0, 180);
    strokeWeight(4);
    arc(
      -10,
      0,
      2 * 300,
      2 * 300,
      -radians(40) / 2,
      radians(40) / 2,
      PIE
    );
    pop();
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
Obstacles: ${obstacles.obstacles.length}
Kill: ${killCount}
Pos: ${int(player.pos.x)}, ${int(player.pos.y)}
Window Size: \n${width}, ${height}
`
  );

  // Game make
  // by KHANH.
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
function keyPressed() {
  // if pressed Enter => jump
  if (keyCode === 32) {
    player.jump();
  }
}