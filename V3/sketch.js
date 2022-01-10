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
  system = new DetectCollisions.System();
  // system.result = system.createResult();
  sparks = new Sparks();
  obstacles = new Obstacles();
  camera = new Camera();
  players = new Players(system);

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
  // translate(0.5, 0.5);
  translate(width / 2, height / 2);
  if (player.health < 0) {
    scale(0.75);
  }
  if (width < 500) {
    scale(0.5);
  }
  // print("frameRate", round(frameRate()));
  // background(100);
  noSmooth();
  mouse = camera.toWorldCoords();
});

addFunction("draw", () => {
  if (isPressed2) {
    sparks.create_particle(mouse, [9, 200, 9]);
    obstacles.createObstacle(mouse);
  }
  {
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

  // onController need to after players.update

  queue.updatePro();
  players.update(mouse);
  onController(player);
  system.update();
  obstacles.update();
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b;
    if (a.parent instanceof Player && b.parent instanceof Player) {
      // Check that 2 ellipses overlap

      let xy0 = a.parent.pos
        .copy()
        .add(
          createVector(-3.5, 0).rotate(a.parent.heading.angle + radians(90))
        );

      let xy1 = b.parent.pos
        .copy()
        .add(
          createVector(-3.5, 0).rotate(b.parent.heading.angle + radians(90))
        );
      let [hw0, hw1] = [46 / 88.0, 46 / 88.0];

      let wxy0 = createVector(0, 88 / 2).rotate(
        a.parent.heading.angle + radians(90)
      );

      let wxy1 = createVector(0, 88 / 2).rotate(
        b.parent.heading.angle + radians(90)
      );

      if (
        ellipseCollisionTest.collide(
          xy0.x,
          xy0.y,
          wxy0.x,
          wxy0.y,
          hw0,
          xy1.x,
          xy1.y,
          wxy1.x,
          wxy1.y,
          hw1
        )
      ) {
        // Push their center from each other.
        // console.log("overlap");

        let a_look_at_b = p5.Vector.sub(b.parent.pos, a.parent.pos);
        // console.log(overlapV);
        let newMag = 150 / max(min(a_look_at_b.mag() - 35, 1), 7) ** 2;
        a_look_at_b.setMag(-newMag);

        a.parent.addPos(a_look_at_b);

        // let a_look_at_b = p5.Vector.sub(b.parent.pos, a.parent.pos);
        // a_look_at_b.setMag(1); // + (a_look_at_b.mag() - 10) ** 2 / 3000
        // b.parent.addPos(a_look_at_b);
        // a.parent.addPos(a_look_at_b.rotate(radians(180)));
      }
    }
  });
  system.checkAll(({ a, overlapV }) => {
    let b = system.response.b;
    if (a.parent instanceof Player && b.parent instanceof Obstacle) {
      // Player inside a obstacle
      let l = p5.Vector.sub(a.parent.pos, b.parent.pos);
      a.parent.setPos(a.parent.lastPos.copy());

      let newMag = 110 / max(l.mag() - 35, 7) ** 2;
      l.setMag(newMag);
    }
  });

  let friendPos = players.realPlayers[1].pos;
  let totalMoveLength = 4;
  // path = obstacles.FindPath(players.realPlayers[1].pos, player.pos);
  if (path && friendPos.dist(player.pos) > 100) {
    path.pop();
    path.push([player.pos.x, player.pos.y]);
    path.every((each) => {
      if (totalMoveLength < 0.01) {
        if (friendPos.dist(createVector(path[0][0], path[0][1])) < 7.5) {
          path.shift();
        }
        return false;
      }
      let moveTo = p5.Vector.sub(createVector(each[0], each[1]), friendPos);
      moveTo.limit(totalMoveLength);
      totalMoveLength -= moveTo.mag();
      players.realPlayers[1].addPos(moveTo);

      return true;
    });
  }
});
let path;
setInterval(() => {
  path = obstacles.FindPath(players.realPlayers[1].pos, player.pos);
}, 16 * 15);
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
  if (path) {
    path.forEach((e, i) => {
      push();
      fill(255, 255, 255, 90);
      circle(e[0], e[1], 40 + i * 4);
      pop();
    });
  }
  queue.updateDraw();
  sparks.draw();
  players.draw();
  obstacles.draw();

  pop();
  menu.display(
    `\
Players: ${players.players.length}
Kill: ${killCount}
Pos: ${int(player.pos.x)}, ${int(player.pos.y)}
FPS: ${int(frameRate())}
` + talkative
  );

  // Game make
  // by KHANH.

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
    let deltaT = (millis() - start) / 16 / 4;
    let d = p5.Vector.add(delta, toLookAt);
    d.setMag(d.mag() * 10 * Curve.f(deltaT, 3, 0.42)); //
    // console.log("d", deltaT, f(deltaT));
    // console.log("d", d.x, d.y);
    // idea: only follow in x-axis or y-axis
    // if (abs(d.x) > abs(d.y)) d.y = 0;
    // else d.x = 0;

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
