// var myFont;
// addFunction("preload", () => {
//   // myFont = loadFont("Resources/Steps-Mono.otf");
//   myFont = loadFont("Resources/Minecraft.ttf");
//   // song = loadSound("Resources/C418 - Beginning 2.mp3");
//   // song.play();
//   // img = loadImage(" Zombie.png");
// });

// let song;
// let sparks;
// let camera;
// let players;
// let system;
// let player;
// let obstacles;
// let frameCount = 0;
// let mouse;
// addFunction("setup", () => {
//   // createCanvas(1024, 768, WEBGL);
//   createCanvas(1024, 768);
//   frameRate(60); // Attempt to refresh at starting FPS
//   imageMode(CENTER);
//   rectMode(CENTER);
//   // textureMode(IMAGE);
//   // angleMode(DEGREES);
//   // textureWrap(REPEAT);
//   background(100);
// });

// addFunction("setup", () => {
//   system = new DetectCollisions.System();
//   // system.result = system.createResult();
//   camera = new Camera();
//   sparks = new Sparks();
//   // main player, store in players.player but player is a faster way to access
//   players = new Players(system);
//   player = new Player(players.img[5]);
//   obstacles = new Obstacles();
//   players.players.push(player);
// });

// addFunction("draw", () => {
//   frameCount++;
//   translate(width / 2, height / 2);
//   // print("frameRate", round(frameRate()));
//   // background(100);
//   noSmooth();
//   mouse = camera.toWorldCoords();
// });

// addFunction("draw", () => {
//   camera.follow(player.pos);
//   camera.draw_background();

//   if (isPressed2) {
//     sparks.create_particle([mouse.x, mouse.y], [9, 200, 9]);
//     if (frameCount % 3 === 0) {
//       obstacles.createObstacle(mouse);
//     }
//   }

//   if (isPressed && !player.onPunch()) {
//     player.startPunch();
//     setTimeout(() => {
//       obstacles.obstacles.forEach((e, i) => {});

//       players.AIs.forEach((e, i) => {
//         let hit = collidePointArc(
//           e.pos.x,
//           e.pos.y,
//           player.pos.x,
//           player.pos.y,
//           250,
//           radians(0 - 90) + player.angle,
//           radians(80)
//         );

//         if (hit) {
//           // print("Hit players.AIs", i);
//           e.getHit();
//           if (e.health < 0) {
//             system.remove(e.circle);
//             players.AIs.splice(i, 1);
//           } else {
//             let id2 = setInterval(() => {
//               let l = p5.Vector.sub(player.pos, e.pos);
//               l.setMag(-max(18888 / l.mag(), 12));

//               // l.scale(1 / mal.len());
//               e.circle.pos.x += l.x;
//               e.circle.pos.y += l.y;
//               e.pos.add(l);
//             }, 16.6);
//             setTimeout(() => {
//               clearInterval(id2);
//             }, 16.6 * 2);
//           }
//         }
//       });
//     }, 190);
//   }

//   // Should be in this exact order
//   players.update(mouse, null);
//   system.update();
//   obstacles.update();
//   system.checkAll(({ a, overlapV }) => {
//     let b = system.response.b;
//     if (a.parent instanceof Player && b.parent instanceof Player) {
//       let l = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);
//       // console.log(overlapV);
//       let newMag = 110 / max(l.mag() - 35, 7) ** 2;
//       l.setMag(newMag);
//       // l.setMag(50 / l.mag());

//       a.parent.addPos(l);
//     }
//   });
//   system.checkAll(({ a, overlapV }) => {
//     let b = system.response.b;
//     if (a.parent instanceof Player && b.parent instanceof Obstacle) {
//       // Player inside a obstacle
//       let l = createVector(a.pos.x - b.pos.x, a.pos.y - b.pos.y);

//       a.parent.setPos(a.parent.lastPos.copy());

//       let newMag = 110 / max(l.mag() - 35, 7) ** 2;
//       l.setMag(newMag);
//       // l.setMag(50 / l.mag());

//       // a.parent.addPos(l);
//     }
//   });
//   players.draw();
//   obstacles.draw();
//   sparks.draw();
// });

// let isPressed = false;
// let isPressed2 = false;
// function mousePressed(event) {
//   // console.log("mousePressed", event.button  )
//   if (event.button === 0) {
//     isPressed = true;
//   } else if (event.button === 2) {
//     isPressed2 = true;
//   }
//   return false;
// }
// function mouseReleased(event) {
//   // console.log("mouseReleased", event.button )
//   if (event.button === 0) {
//     isPressed = false;
//   } else if (event.button === 2) {
//     isPressed2 = false;
//   }
//   return false;
// }
// function mouseClicked(event) {
//   // console.log("mouseClicked", event.button  )

//   return false;
// }

let grid = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
var aStar = new EasyStar.js();
aStar.setGrid(grid);
aStar.setAcceptableTiles(0);
aStar.setIterationsPerCalculation(1);

// Not find path => nothing is call
// aStar.findPath => findPath from scratch

var instanceId = aStar.findPath(0, 0, 2, 0, (path) => {
  if (path === null) {
    console.log("Path was not found.");
  } else {
    console.log("Path was found.", path);
  }
});
aStar.calculate();
aStar.calculate();
var instanceId = aStar.findPath(0, 0, 4, 0, (path) => {
  if (path === null) {
    console.log("Path2 was not found.");
  } else {
    console.log("Path2 was found.", path);
  }
});
aStar.calculate();
aStar.calculate();
aStar.calculate();
aStar.calculate();
aStar.calculate();
aStar.calculate();


// aStar.avoidAdditionalPoint(x, y);
// aStar.cancelPath(instanceId);
