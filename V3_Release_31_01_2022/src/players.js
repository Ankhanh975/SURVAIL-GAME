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
    //   if (this.players.length < 100) {
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
      // if (e.AIPlayer) {
      // e.update();
      // } else if (e === player) {
      // e.update();
      // } else {
      // e.update();
      // }
    }
  }
  draw() {
    this.players.forEach((e, i) => {
      if (
        player.pos.x - e.pos.x > 1000 ||
        player.pos.x - e.pos.x < -1000 ||
        player.pos.y - e.pos.y > 600 ||
        player.pos.y - e.pos.y < -600
      ) {
        // console.log("too far");
        return;
      }
      e.draw({ healthBar: true, nameTag: !e.AIPlayer || i <= 1, body: true });
    });
  }
  createAIPlayer(pos, color) {
    pos = pos || p5.Vector.random2D().setMag(random(200, 500));
    color = int(((color % 5) + 5) % 5) || int(random(0, 5));

    if (this.players[0]) {
      // pos.add(this.players[0].pos);
      // pos.add(this.AIs[int(random(0, this.AIs.length))].pos);
    }

    this.players.push(new AIPlayer(color, this, [pos.x, pos.y]));
  }
}
