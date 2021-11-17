// var myFont;
// function preload() {
//   // myFont = loadFont("Resources/Steps-Mono.otf");
//   myFont = loadFont("Resources/Minecraft.ttf");

//   // song = loadSound("Resources/C418 - Beginning 2.mp3");
//   // song.play();
//   // img = loadImage(" Zombie.png");

//   img[0].push(loadImage("Resources/Animation_0.png"));
//   img[0].push(loadImage("Resources/Animation_1.png"));
//   img[0].push(loadImage("Resources/Animation_2.png"));
//   img[0].push(loadImage("Resources/Animation_3.png"));
//   img[0].push(loadImage("Resources/Animation_4.png"));
//   img[0].push(loadImage("Resources/Animation_5.png"));
// }

// let img = [[], [], [], [], [], []];
// let song;
// let player;
// let sparks;
// let enemy = [];

// let camera;

// function setup() {
//   createCanvas(1024, 768, WEBGL);
//   // frameRate(30); // Attempt to refresh at starting FPS
//   frameRate(60); // Attempt to refresh at starting FPS
//   imageMode(CENTER);
//   // rectMode(CENTER);
//   // textureMode(IMAGE);
//   // angleMode(DEGREES);
//   // textureWrap(REPEAT);
//   background(100);
//   [
//     [255, 255, 0],
//     [0, 0, 255],
//     [248, 147, 29],
//     [0, 255, 0],
//     [255, 0, 0],
//   ].forEach((color, ii) => {
//     for (let i = 0; i < img[0].length; i++) {
//       img[ii + 1].push(createImage(img[0][0].width, img[0][0].height));
//       img[ii + 1][i].copy(
//         img[0][i],
//         0,
//         0,
//         img[0][0].width,
//         img[0][0].height,
//         0,
//         0,
//         img[0][0].width,
//         img[0][0].height
//       );
//       change(img[ii + 1][i], [255, 255, 255], color);
//     }
//   });

//   camera = new Camera();
//   sparks = new Sparks();
//   player = new Player(img[5]);

//   for (let index = 0; index < 2; index++) {
//     let pos = p5.Vector.random2D().setMag(210);
//     // print(pos);
//     enemy.push(new AIPlayer(img[int(random(0, 5))], [pos.x, pos.y]));
//   }
// }

// function draw() {
//   // print("frameRate", round(frameRate()));
//   // translate(-width / 2, -height / 2);
//   // background(100);
//   noSmooth();

//   camera.follow(player.pos);
//   camera.draw_background();

//   let mouse = camera.toWorldCoords();
//   if (isPressed) {
//     sparks.create_particle([mouse.x, mouse.y], (num = 1));
//   }

//   if (isPressed && !player.onPunch()) {
//     player.startPunch();
//     enemy.forEach((e) => {
//       let dist = player.pos.dist(e.pos);
//       if (dist < 140) {
//         print("Hit enemy");
//       }
//     });
//   }
//   sparks.draw();
//   player.update(mouse, (onController = true));
//   player.drawPlayer();
//   player.drawNameTag();

//   enemy.forEach((e) => {
//     e.update(enemy, [player]);
//     e.drawPlayer();
//     // e.drawNameTag();
//   });
// }

// let isPressed = false;
// function mousePressed(event) {
//   if (event.button === 0) {
//     isPressed = true;
//   }
// }
// function mouseReleased(event) {
//   if (event.button === 0) {
//     isPressed = false;
//   }
// }

// // function preload() {
// //   img = loadImage("Resources/Animation_0.png");
// // }
// // let img, img2;

// // function setup() {
// //   createCanvas(400, 400);
// //   background(100);
// //   img2 = createImage(img.width, img.height);
// //   img2.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

// //   change(img2, [255, 255, 255], [255, 255, 0]);

// //   image(img, 0, 0);
// //   image(img2, 100, 100);
// // }

const system = new DetectCollisions.System();

const circle = new DetectCollisions.Circle({ x: 100, y: 100 }, 10);
const circle2 = new DetectCollisions.Circle({ x: 110, y: 110 }, 10);
system.insert(circle);
system.insert(circle2);
console.log("system", system);
system.update();
console.log("system", system);

// system.checkAll(({ a, overlapV }) => {
//   console.log("overlap", a, overlapV);
// });
// console.log("system", system);
