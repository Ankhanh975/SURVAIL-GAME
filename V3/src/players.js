class Players {
  constructor() {
    this.parent = globalThis;
    this.players = [];
    this.realPlayers = [];

    // while (this.players.length < 1) {
    //   let pos = p5.Vector.random2D().setMag(random(950, 1100));
    //   for (let index = 0; index < Prob.normal(10, 2)(); index++) {
    //     // setTimeout(() => {
    //     this.createAIPlayer(
    //       pos.add(p5.Vector.random2D().setMag(random(0, 100)))
    //     );
    //     // }, Prob.normal(16, 16 * 40)());
    //   }
    // }

    // gameTick
    // setInterval(() => {
    //   if (this.players.length < 10) {
    //     // while (this.AIs.length < 35) {
    //     let pos = p5.Vector.random2D().setMag(random(300, 1000));
    //     for (let index = 0; index < Prob.normal(10, 2)(); index++) {
    //       // setTimeout(() => {
    //       this.createAIPlayer(
    //         pos.add(p5.Vector.random2D().setMag(random(0, 100)))
    //       );
    //       // }, Prob.normal(16, 16 * 40)());
    //     }
    //   }
    // }, 3 * 1000);

    // // setInterval(() => {
    // // this.players.shuffle();
    // // }, 125);
  }
  update() {
    for (const e of this.players) {
      e.update();
    }
  }
  draw() {
    for (const e of this.players) {
      if (
        player.pos.x - e.pos.x > 1000 ||
        player.pos.x - e.pos.x < -1000 ||
        player.pos.y - e.pos.y > 600 ||
        player.pos.y - e.pos.y < -600
      ) {
        continue;
      }
      let healthBar = false;

      const angle = player.rotation.lookAt.angleBetween(e.rotation.lookAt);
      if (angle > radians(140) || angle < radians(-140)) {
        if (
          collisions.isFreeLine(e.pos, player.pos, {
            ignore: [e.circle, player.circle],
            type: Obstacle,
          })
        ) {
          if (player.pos.dist(e.pos) < 400) {
            healthBar = true;
          }
        }
      }
      e.draw({
        healthBar: !e.AIPlayer || healthBar,
        nameTag: !e.AIPlayer,
        body: true,
      });
    }
  }
  createAIPlayer(pos, color) {
    pos = pos || p5.Vector.random2D().setMag(random(200, 500));
    color = int(((color % 5) + 5) % 5) || int(random(0, 5));

    if (this.players[0]) {
      // pos.add(this.players[0].pos);
      // pos.add(this.AIs[int(random(0, this.AIs.length))].pos);
    }

    this.players.push(
      new AIPlayer({ color: color, parent: this, pos: [pos.x, pos.y] })
    );
  }
}
