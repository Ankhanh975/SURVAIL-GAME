class Players {
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

    this.players.push(
      new AIPlayer({ color: color, parent: this, pos: [pos.x, pos.y] })
    );
  }
}
class AIPlayer extends Player {
  constructor(settings) {
    super(settings);
    this.name = generateName.__call();
    this.AIPlayer = true;
    this.addComponent(component.wandering);
    this.addComponent(component.sensor);
  }
  update() {
    super.update();
    this.target = this.parent.realPlayers[0];
    if (!this.target) {
      return;
    }
    let lookAt, dist, toLookAt;
    lookAt = this.target.pos;
    dist = this.pos.dist(lookAt);
    toLookAt = p5.Vector.sub(lookAt, this.pos);

    if (dist < 150) {
      if (!this.onPunch()) {
        if (random(0, 100) >= 93.5) {
          this.startPunch(null, [this.target]);
        }
      }
    }
    this.setAngle(toLookAt.heading());

    if (dist < 1100) {
      if (dist < 130) {
        toLookAt.setMag(3.0);
        toLookAt.rotate(radians(180));
        this.addPos(toLookAt);
      }
      if (dist > 150) {
        toLookAt.rotate(radians(10));
        toLookAt.setMag(3.0);
        this.addPos(toLookAt);
      }
    }

    return;
  }
}
