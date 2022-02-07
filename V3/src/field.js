// Idea: feel and coordinates chanel of zombie
// Zombie act to this field to do complex things
function throwError(str) {
  throw new Error(str);
}
class Particle {
  constructor(options) {
    this.type = options.type || throwError("type not specified");
    this.parent = options.parent || throwError("parent not specified");
    this.strength = options.strength || 20;
    this.lifeTime = options.lifeTime || 100;
    this.totalLifeTime = options.lifeTime || 100;
    this.source = options.source || undefined;

    this.pos = createVector(0, 0);
    this.syncPos = options.syncPos || false;
    if (options.pos) {
      this.pos.x = options.pos.x;
      this.pos.y = options.pos.y;
    }
    if (options.syncPos === true) {
      this.pos = options.pos;
    }
    this.headTo = createVector(0, 0);
    this.syncHeadTo = options.syncHeadTo || false;
    if (options.headTo) {
      this.headTo.x = options.headTo.x;
      this.headTo.y = options.headTo.y;
    }
    if (options.syncHeadTo === true) {
      this.headTo = options.headTo;
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
  update() {
    this.lifeTime -= 1;
    this.lifeTime = max(this.lifeTime, 0);
    if (this.syncPos) {
      this.circle.pos.x = this.pos.x;
      this.circle.pos.y = this.pos.y;
    }
    if (this.syncHeadTo) {
    }
  }
  draw() {
    push();
    noStroke();
    if (this.type == "enemy_smell") {
      fill(100, 255, 0, this.lifeTimePercent * 75);
    } else if (this.type == "friend_smell") {
      fill(255, 255, 255, this.lifeTimePercent * 100);
    } else if (this.type == "attack_attention") {
      fill(100, 0, 0, this.lifeTimePercent * 100);
    } else if (this.type == "retreat_attention") {
      fill(128, 255, 128, 25);
    } else if (this.type == "detect_enemy") {
      fill(100, 0, 0, 25);
    } else {
      fill(0, 0, 255, 25);
    }
    translate(this.pos.x, this.pos.y);
    circle(0, 0, 70);

    // const direction = this.getDirection();
    // if (direction) {
    //   push();
    //   stroke(255, 255, 255, 255);
    //   strokeWeight(4);
    //   rotate(direction);
    //   line(0, 0, this.heading.x, this.heading.y);
    //   pop();
    // }

    pop();
  }
}
class Field {
  constructor() {
    this.collisions = new Collisions2();
    this.particles = [];
    setTimeout(() => {
      players.players.forEach((player) => {
        let type = player.AIPlayer ? "friend_smell" : "enemy_smell";
        let lifeTime = 10 ** 10;

        this.createParticle({
          source: player,
          type: type,
          lifeTime: lifeTime,
          headTo: undefined,
          syncPos: true,
          pos: player.pos,
        });
      });
    }, 100);
  }
  createParticle(options) {
    options.parent = this;
    const particle = new Particle(options);
    this.particles.push(particle);
  }

  update() {
    console.log(this.particles.length);
    this.particles.forEach((each) => each.update());
    this.particles = this.particles.filter((each) => each.lifeTime > 0);

    players.realPlayers.forEach((player) => {
      const thisSmell = this.particles
        .filter((e) => e.source === player)
        .filter((e) => e.lifeTimePercent > 0.9)
        .filter((e) => player.pos.dist(e.pos) < 35);
      // console.log(thisSmell);

      if (thisSmell.length < 2) {
        let type = player.AIPlayer ? "friend_smell" : "enemy_smell";
        let lifeTime = player.AIPlayer ? 250 : 250;

        this.createParticle({
          source: player,
          type: type,
          strength: 100,
          lifeTime: lifeTime,
          headTo: undefined,
          syncPos: false,
          pos: player.pos,
        });
      } else {
        const chosen = thisSmell[0];
        chosen.lifeTime = chosen.totalLifeTime;
        chosen.pos.x = player.pos.x;
        // console.log(chosen);
        chosen.pos.y = player.pos.y;
      }
    });
    return;
    players.players.forEach((player) => {
      let type = player.AIPlayer ? "friend_smell" : "enemy_smell";
      let lifeTime = player.AIPlayer ? 100 : 100;

      this.createParticle({
        source: player,
        type: type,
        strength: 100,
        lifeTime: lifeTime,
        headTo: undefined,
        syncPos: false,
        pos: player.pos,
      });
    });
  }
  draw() {
    this.particles.forEach((each) => each.draw());
  }
  getNear(particle) {
    // TODO
    return;
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
