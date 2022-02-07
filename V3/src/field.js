// Idea: feel and coordinates chanel of zombie
// Zombie act to this field to do complex things
function throwError(str) {
  throw new Error(str);
}
class Particle {
  constructor(options) {
    this.type = options.type || throwError("type not specified");
    this.parent = options.parent || throwError("parent not specified");
    this.strength = options.strength || 100;
    this.lifeTime = options.lifeTime || 100;
    this.totalLifeTime = options.lifeTime || 100;
    this.source = options.source || undefined;

    {
      this.pos = createVector(0, 0);
      this.syncPos = options.syncPos || false;
      if (options.pos) {
        this.pos.x = options.pos.x;
        this.pos.y = options.pos.y;
      }
      if (options.syncPos === true) {
        this.pos = options.pos;
      }
    }
    {
      this.headTo = createVector(100, 0);
      this.syncHeadTo = options.syncHeadTo || false;
      if (options.headTo) {
        this.headTo.x = options.headTo.x;
        this.headTo.y = options.headTo.y;
      }
      if (options.syncHeadTo === true) {
        this.headTo = options.headTo;
      }
    }

    // For get_near particle efficient using collision detection library
    this.circle = this.parent.collisions.createPolygon(
      { x: this.pos.x, y: this.pos.y },
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ]
    );
    this.circle.parent = this;
  }
  get lifeTimePercent() {
    return this.lifeTime / this.totalLifeTime;
  }
  get haveHeadTo() {
    // Not equals to initialize values
    return this.headTo.x !== 100 && this.headTo.y !== 0;
  }
  setPos(pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    if (this.syncPos) {
      this.circle.pos.x = this.pos.x;
      this.circle.pos.y = this.pos.y;
    }
  }
  update() {
    this.lifeTime -= 1;
    this.lifeTime = max(this.lifeTime, 0);
    if (this.syncPos) {
      this.circle.pos.x = this.pos.x;
      this.circle.pos.y = this.pos.y;
    }
    if (this.syncHeadTo) {
    }
    if (this.lifeTime <= 0) {
      this.die();
    }
  }
  draw() {
    push();
    noStroke();
    const lifeTimePercent = Curve.f3(this.lifeTimePercent)
    if (this.type == "enemy_smell") {
      fill(100, 255, 0, lifeTimePercent * 65);
    } else if (this.type == "friend_smell") {
      fill(255, 255, 255, lifeTimePercent * 80);
    } else if (this.type == "attack_attention") {
      fill(100, 0, 0, lifeTimePercent * 80);
    } else if (this.type == "retreat_attention") {
      fill(128, 255, 128, 25);
    } else if (this.type == "detect_enemy") {
      fill(100, 0, 0, 25);
    } else {
      fill(0, 0, 255, 25);
    }
    translate(this.pos.x, this.pos.y);
    circle(0, 0, 70);

    if (this.haveHeadTo) {
      push();
      stroke(255, 255, 255, 200);
      strokeWeight(3);
      line(0, 0, this.headTo.x, this.headTo.y);
      pop();
    }

    pop();
  }
  die() {
    this.parent.collisions.remove(this.circle);
    // Remove this from class Field done in the Field update()
  }
}
class Field {
  constructor() {
    this.collisions = new Collisions2();
    this.particles = [];
    setTimeout(() => {
      players.players.forEach((player) => {
        this.#createParticleAttachTo(player);
      });
    }, 100);
  }
  #createParticleAttachTo(player) {
    let type = player.AIPlayer ? "friend_smell" : "enemy_smell";
    let lifeTime = 10 ** 10;

    this.createParticle({
      source: player,
      type: type,
      lifeTime: lifeTime,
      pos: player.pos,
      syncPos: true,
      headTo: player.rotation.headTo,
      syncHeadTo: true,
    });
  }
  createParticle(options) {
    options.parent = this;
    const particle = new Particle(options);
    this.particles.push(particle);
  }

  update() {
    this.particles.forEach((each) => each.update());
    this.particles = this.particles.filter((each) => each.lifeTime > 0);

    console.log(this.particles.length);
    players.realPlayers.forEach((player) => {
      const get = this.getNear(player).filter((e) => e.source === player);

      const thisSmell = get
        .filter((e) => e.lifeTimePercent > 0.75)
        .filter((e) => player.pos.dist(e.pos) < 35);

      const close_smell = get.filter((e) => player.pos.dist(e.pos) < 5);

      if (thisSmell.length < 2) {
        if (close_smell.length <= 1) {
          let type = player.AIPlayer ? "friend_smell" : "enemy_smell";
          let lifeTime = player.AIPlayer ? 250 : 250;

          this.createParticle({
            source: player,
            type: type,
            lifeTime: lifeTime,
            syncPos: false,
            pos: player.pos,
          });
        } else {
          const chosen = close_smell[0];
          chosen.lifeTime = chosen.totalLifeTime;
          chosen.setPos(player.pos);
        }
      }
    });
    return;
  }
  draw() {
    this.particles.forEach((each) => each.draw());
  }
  getNear(particle) {
    // TODO
    return this.particles;
    let all = [];
    this.collisions.getNear(
      particle.pos,
      { rangeX: 1000, rangeY: 1000 },
      ([each]) => {
        all.push(each.parent);
      }
    );
    return all;
  }
  tick(zombie) {
    return;
    const smell = this.getNear(zombie)
      .filter((each) => each.pos.dist(zombie.pos) < each.smellRadius)
      .filter((each) =>
        collisions.isFreeLine(each.pos, zombie.pos, {
          ignore: [zombie.circle, player.circle],
          type: Obstacle,
        })
      );
  }
}
