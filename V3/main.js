let sparks;
let camera;
let players;
let player;
let obstacles;
let canvas;
let mouse;
let queue = new Queue();
let killCount = 0;
let mousePos = [];
let field;
var ctx;
// let chunks;
addFunction("setup", () => {
  // frameRate(150);
  frameRate(60);
  // createCanvas(1024, 768, WEBGL);
  createCanvas(windowWidth, windowHeight);
  const defaultCanvas = document.querySelector("canvas");
  // ctx is commonly used but outside of p5js community
  ctx = defaultCanvas.getContext("2d");
  // pixelDensity(1.0);
  imageMode(CENTER);
  // colorMode(HSB, 255);

  // rectMode(CENTER);
  // angleMode(DEGREES);
  // textureWrap(REPEAT);
  // background(100);
});
addFunction("setup", () => {
  // noisejs.seed(Math.random());
  sparks = new Sparks();
  obstacles = new Obstacles();
  camera = new Camera();
  players = new Players();
  field = new Field();
  // chunks = new Chunks();
  // main player, store in players.player but player is a faster way to access
  player = new Player({
    color: 5,
    parent: players,
    health: 1000,
    totalHealth: 1000,
    damage: 4.5,
  });
  player.addComponent(component.onController);
  player.addComponent(component.jump);
  player.addComponent(component.placeObstacle);
  {
    player.recovery = 0.001 * player.health;
    player.health = 1000;
    player.totalHealth = 1000;
    player.damage = 5;
    player.recovery = 0.0015 * player.health;
  }

  for (let i = 0; i < 14 * 4; i++) {
    let particle = sparks.create_particle(player.pos, [0, 0, 0], 5);
    particle.move(i / 12);
  }
  players.players[0] = player;
  players.realPlayers.push(player);
  if (false) {
    let friend = new Player({
      color: 5,
      parent: players,
      health: 1000,
      totalHealth: 1000,
      damage: 2.5,
      name: "friend",
      pos: [100, 0],
    });
    friend.recovery = 0.001 * friend.health;
    players.players.push(friend);
    players.realPlayers.push(friend);
  }
  for (let i = 0; i < 0; i++) {
    // PLAYING
    players.createAIPlayer();
  }
  // TODO: why 2000 obstacles is slow?
  // 1. Collisions check
  // 2. Loop through obstacles.update();
  // ...
  obstacles.initObstacles(35);
  // obstacles.initNormal();
});

addFunction("draw", () => {
  mouse = camera.toWorldCoords();

  if (isPressed && !player.onPunch()) {
    player.startPunch();
    for (let i = 0; i < 1; i++) {
      let particle = sparks.create_particle(player.pos, [255, 0, 0], 4);
      if (particle) {
        particle.move(1);
      }
    }
  }

  mousePos.push([mouse.x, mouse.y]);

  if (mousePos.length > 30) {
    mousePos.shift();
  }

  player.setAngle(p5.Vector.sub(mouse, player.pos).heading());
  // chunks.update();
  {
    sparks.update();
    players.update();
    obstacles.update();
    // field.update();
  }

  // for (const object in this.chunk) {
  //   const chunk = this.chunk[object];
  //   if (chunk) {
  //     chunk.forEach((each) => {
  //       console.log(each);
  //       each.update();
  //     });
  //   }
  // }

  collisions.update();
  for (let i = 0; i < 3; i++) {
    for (const player of players.players) {
      // response.a.parent instanceof Player

      collisions.checkOne(player.circle, (response) => {
        // const a = response.a.parent;
        const a = player;
        const b = response.b.parent;
        let x = -response.overlapV.x;
        let y = -response.overlapV.y;
        x = min(x, 14);
        y = min(y, 14);

        if (b instanceof Player) {
          const effects = 0.4;
          a.addPos({ x: x * (1.01 - effects), y: y * (1.01 - effects) }, false);

          b.addPos({ x: -(x * effects), y: -(y * effects) }, false);
          {
            const vec = a.rotation.headTo.copy();
            vec.rotate(radians(a.random * 90)).setMag(0.4);
            a.addPos(vec);
          }
        } else if (b instanceof Obstacle) {
          {
            // Debugging
            a.addPos({ x: x * 1.1, y: y * 1.1 }, false);
            return;
          }
          if (b.customCollisionHandler === false) {
            a.addPos({ x: x * 1.1, y: y * 1.1 }, false);
            // a.setFreezeFor(16 * 3);
          }
          // else if (x < 13 && y < 13) {
          //   a.addPos({ x: x * 1.1, y: y * 1.1 }, false);
          //   // a.setFreezeFor(16 * 3);
          // }
          else {
            // console.log(1);
            collisions.separateLineCircle(response.b, a.circle);
            a.setFreezeFor(16 * 2);
          }
        } else {
          console.log(a, b);
          throw new Error("Invalid collision");
        }
      });
    }
  }
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
  // Draw spawn at position 0, 0
  push();
  let c = HSVtoRGB((frameCount % 750) / 750, 0.9, 0.7);
  fill(...c, 75);
  circle(0, 0, 100);

  pop();

  // if (isPressed) {
  //   push();
  //   translate(player.pos);
  //   rotate(player.getAngle());
  //   fill(255, 0, 0, 90);
  //   stroke(255, 255, 0, 180);
  //   strokeWeight(4);
  //   arc(-0, 0, 2 * 300, 2 * 300, -radians(40) / 2, radians(40) / 2, PIE);
  //   pop();
  // }
  // PLAYING
  if (true) {
    // queue.update();
    // field.draw();
  }
  if (true) {
    sparks.draw();
    players.draw();
  }
  obstacles.draw();
  queue.update();
  // if (players.players[1]) {
  //   let path = players.players[1].path;
  //   path.forEach((e, i) => {
  //     push();
  //     fill(0, 0, 255, 90);
  //     circle(e[0], e[1], 40 + i * 3);
  //     pop();
  //   });
  // }
  pop();
  fpsMeter.tick();
  menu.display(
    `\
Players: ${players.players.length}
Obstacles: ${obstacles.obstacles.length}
Kill: ${killCount}
Pos: ${Math.round(player.pos.x)}, ${Math.round(player.pos.y)}
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

(function () {
  function drawTriangle() {
    const points = arguments;
    if (points.length >= 3) {
      triangle(...points[0], ...points[1], ...points[2]);
      // console.log(...points[0], ...points[1], ...points[2]);
    }
    if (points.length >= 4) {
      triangle(...points[0], ...points[2], ...points[3]);
      // console.log(...points[0], ...points[2], ...points[3]);
    }
    if (points.length >= 5) {
      triangle(...points[0], ...points[3], ...points[4]);
      // console.log(...points[0], ...points[3], ...points[4]);
    }
    if (points.length >= 6) {
      triangle(...points[0], ...points[4], ...points[5]);
      // console.log(...points[0], ...points[4], ...points[5]);
    }
  }
  function block(x, y, state = 1) {
    const centerX = x;
    const centerY = y;
    const w = 50;
    const h = 50;

    const topRight = [100, 100];
    const bottomLeft = [0, 0];
    const centreLeft = [50, 0];

    const topLeft = [100, 0];
    const centreTop = [100, 50];
    const centreRight = [50, 100];

    const bottomRight = [0, 100];
    const centreBottom = [0, 50];

    topRight[0] += centerX;
    bottomLeft[0] += centerX;
    centreLeft[0] += centerX;
    topLeft[0] += centerX;
    centreTop[0] += centerX;
    centreRight[0] += centerX;
    bottomRight[0] += centerX;
    centreBottom[0] += centerX;

    topRight[1] += centerY;
    bottomLeft[1] += centerY;
    centreLeft[1] += centerY;
    topLeft[1] += centerY;
    centreTop[1] += centerY;
    centreRight[1] += centerY;
    bottomRight[1] += centerY;
    centreBottom[1] += centerY;

    push();
    switch (state) {
      case 0:
        break;
      case 1:
        drawTriangle(centreBottom, bottomLeft, centreLeft);
        break;
      case 2:
        drawTriangle(centreRight, bottomRight, centreBottom);
        break;
      case 4:
        drawTriangle(centreTop, topRight, centreRight);
        break;
      case 8:
        drawTriangle(topLeft, centreTop, centreLeft);
        break;

      // 2 points:
      case 3:
        drawTriangle(centreRight, bottomRight, bottomLeft, centreLeft);
        break;
      case 6:
        drawTriangle(centreTop, topRight, bottomRight, centreBottom);
        break;
      case 9:
        drawTriangle(topLeft, centreTop, centreBottom, bottomLeft);
        break;
      case 12:
        drawTriangle(topLeft, topRight, centreRight, centreLeft);
        break;
      case 5:
        drawTriangle(
          centreTop,
          topRight,
          centreRight,
          centreBottom,
          bottomLeft,
          centreLeft
        );
        break;
      case 10:
        drawTriangle(
          topLeft,
          centreTop,
          centreRight,
          bottomRight,
          centreBottom,
          centreLeft
        );
        break;

      // 3 point:
      case 7:
        drawTriangle(centreTop, topRight, bottomRight, bottomLeft, centreLeft);
        break;
      case 11:
        drawTriangle(topLeft, centreTop, centreRight, bottomRight, bottomLeft);
        break;
      case 13:
        drawTriangle(topLeft, topRight, centreRight, centreBottom, bottomLeft);
        break;
      case 14:
        drawTriangle(topLeft, topRight, bottomRight, centreBottom, centreLeft);
        break;

      // 4 point:
      case 15:
        drawTriangle(topLeft, topRight, bottomRight, bottomLeft);
        break;
    }

    pop();
  }

  addFunction("draw", () => {
  camera.follow(player.pos);
    
    block(0, 0, 0);
    block(100, 0, 1);
    block(200, 0, 2);
    block(300, 0, 3);
    block(400, 0, 4);
    block(500, 0, 5);
    block(600, 0, 6);
    block(700, 0, 7);
    block(800, 0, 8);
    block(900, 0, 9);
    block(1000, 0, 10);
    block(1100, 0, 11);
    block(1200, 0, 12);
    block(1300, 0, 13);
    block(1400, 0, 14);
    block(1500, 0, 15);
  });
})();
