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
  {
    sparks.update();
    players.update();
    obstacles.update();
    field.update();
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
        } else if (b instanceof Obstacle2) {
          console.log(1);
          a.addPos({ x: x * 1.1, y: y * 1.1 }, false);
        } else {
          console.log(a, b);
          throwError("Invalid collision");
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
  if (false) {
    queue.update();
    field.draw();
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
  let list = [];
  addFunction("setup", () => {
    let n;
    const n01 = new Obstacle2(0, 0, 0);
    const n02 = new Obstacle2(100, 0, 1);
    const n03 = new Obstacle2(200, 0, 2);
    const n04 = new Obstacle2(300, 0, 3);
    const n05 = new Obstacle2(400, 0, 4);
    const n06 = new Obstacle2(500, 0, 5);
    const n07 = new Obstacle2(600, 0, 6);
    const n08 = new Obstacle2(700, 0, 7);
    const n09 = new Obstacle2(800, 0, 8);
    const n10 = new Obstacle2(900, 0, 9);
    const n11 = new Obstacle2(1000, 0, 10);
    const n12 = new Obstacle2(1100, 0, 11);
    const n13 = new Obstacle2(1200, 0, 12);
    const n14 = new Obstacle2(1300, 0, 13);
    const n15 = new Obstacle2(1400, 0, 14);
    const n16 = new Obstacle2(1500, 0, 15);
    list.push(n01);
    list.push(n02);
    list.push(n03);
    list.push(n04);
    list.push(n05);
    list.push(n06);
    list.push(n07);
    list.push(n08);
    list.push(n09);
    list.push(n10);
    list.push(n11);
    list.push(n12);
    list.push(n13);
    list.push(n14);
    list.push(n15);
    list.push(n16);
  });
  addFunction("draw", () => {
    camera.follow(player.pos);
    list.forEach((element) => {
      element.draw();
    });
  });
})();
