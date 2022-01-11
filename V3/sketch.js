let sparks;
let camera;
let players;
let system;
let player;
let obstacles;
let mouse;
let queue = new Queue();
let killCount = 0;

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
  player.damage = 5;
  player.recovery = 0.001 * player.health;
  players.players[0] = player;
  players.realPlayers = [player];

  let friend = new Player(players.img[5], players);
  friend.health = 200;
  friend.totalHealth = 200;
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
    // if (isPressed && (frameCount % 24 === 0 || !player.onPunch())) {
    player.startPunch();
    sparks.create_particle(player.pos, [255, 0, 0], 3.5);
  }
  if (isPressed2) {
    sparks.create_particle(mouse, [9, 200, 9]);
    obstacles.createObstacle(mouse);
  }
  // onController need to after players.update

  queue.updatePro();
  players.update(mouse);
  onController(player);
  obstacles.update();
  system.update();
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b;
    if (a.parent instanceof Player && b.parent instanceof Player) {
      // Check that 2 ellipses overlap
      // Push their center from each other.
      // a.parent.addPos(createVector(-overlapV.x, -overlapV.y));
      // let a_look_at_b = p5.Vector.sub(b.parent.pos, a.parent.pos);
      // // console.log(overlapV);
      // let newMag = 110 / max(a_look_at_b.mag() - 35, 7) ** 2;
      // // let newMag = 150 / max(min(a_look_at_b.mag() - 35, 1), 7) ** 2;
      // a_look_at_b.setMag(-newMag);
      // a.parent.addPos(a_look_at_b);
    }
  });
  // system.checkAll(({ a, overlapV }) => {
  //   let b = system.response.b;
  //   if (a.parent instanceof Player && b.parent instanceof Obstacle) {
  //     // Player inside a obstacle
  //     let l = p5.Vector.sub(a.parent.pos, b.parent.pos);
  //     a.parent.setPos(a.parent.lastPos.copy());

  //     let newMag = 110 / max(l.mag() - 35, 7) ** 2;
  //     l.setMag(newMag);
  //   }
  // });
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
  //       [128, 255, 255, 200],
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
` + talkative
  );

  // Game make
  // by KHANH.

  chatbox.draw();
});
function mouseClicked(event) {
  // console.log("mouseClicked", event.button  )
  // player.startPunch();
  return false;
}
function keyPressed() {
  let start = millis();
  let jump = () => {
    player.health -= player.totalHealth / 120;
    for (let i = 0; i < 14; i++) {
      let particle = sparks.create_particle(player.pos, [0, 0, 0], 3.5);
      particle.move(1.5);
    }
    let delta = p5.Vector.sub(player.pos, player.lastPos);
    let toLookAt = p5.Vector.sub(player.lookAt, player.pos);
    // toLookAt.setMag(15);
    toLookAt.setMag(0);
    // delta.setMag(0);

    if (delta.mag() < 5) {
      delta.setMag(0);
    } else {
      delta.setMag(32.5);
    }
    let deltaT = (millis() - start) / 25 - 0.175;
    let d = p5.Vector.add(delta, toLookAt);
    d.setMag(135 * Curve.f(deltaT)); //

    // console.log("d", d.mag(), deltaT);
    player.addPos(d);
  };
  // console.log("keyPressed", keyCode);
  // if pressed Enter => jump
  if (keyCode === 32) {
    jump();
    let id99 = setInterval(() => {
      jump();
    }, 16);
    setTimeout(() => {
      clearInterval(id99);
    }, 16 * 8);

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
