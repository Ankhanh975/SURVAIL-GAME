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
  for (let i = 0; i < 0; i++) {
    // PLAYING
    players.createAIPlayer();
  }
  obstacles.initObstacles(35);
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
  sparks.update();
  players.update();
  obstacles.update();
  field.update();

  collisions.update();
  for (let i = 0; i < 3; i++) {
    for (const player of players.players) {
      collisions.checkOne(player.circle, (response) => {
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
          
          const vec = a.rotation.headTo.copy();
          vec.rotate(radians(a.random * 90)).setMag(0.4);
          a.addPos(vec);
        } else if (b instanceof Obstacle) {
          a.addPos({ x: x * 1.1, y: y * 1.1 }, false);
        } else if (b instanceof Obstacle2) {
          // console.log(1);
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

  if (true) {
    sparks.draw();
    players.draw();
  }
  obstacles.draw();
  queue.update();
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
});
function keyPressed() {
  // if pressed Enter => jump
  if (keyCode === 32) {
    player.jump();
  }
}