// Idea: feel and coordinates chanel of zombie
// Zombie act to this field to do complex things

class Particle {
  constructor(options) {
    this.type = options.type || throwError("type not specified");
    this.parent = options.parent || throwError("parent not specified");
    this.strength = options.strength || 100;
    this.lifeTime = options.lifeTime || 100;
    this.totalLifeTime = options.lifeTime || 100;
    this.source = options.source || null;
    this.referToSource = null;

    {
      this.pos = createVector(0, 0);
      this.syncPos = false;
      if (options.pos) {
        this.pos.x = options.pos.x;
        this.pos.y = options.pos.y;
      }
      if (options.syncPos === true) {
        this.referToSource = options.pos;
        this.syncPos = true;

        // this.pos = options.pos;
      }
    }
    this.referToSource2 = null;

    {
      this.headTo = createVector(99, 101);
      this.syncHeadTo = false;
      if (options.headTo) {
        this.headTo.x = options.headTo.x;
        this.headTo.y = options.headTo.y;
      }
      if (options.syncHeadTo === true) {
        this.referToSource2 = options.headTo;
        this.syncHeadTo = true;
        // this.headTo = options.headTo;
      }
    }

    this.useAbsoluteCoords = false;
    this.headToInAbsoluteCoords = createVector(0, 0);
    if (options.headToInAbsoluteCoords) {
      this.headToInAbsoluteCoords.x = options.headToInAbsoluteCoords.x;
      this.headToInAbsoluteCoords.y = options.headToInAbsoluteCoords.y;
      this.useAbsoluteCoords = true;
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
    this.color = [random(0, 255), random(0, 255), random(0, 255)];
  }
  removeSyncPos() {
    this.syncPos = false;
    this.referToSource = null;
  }
  removeSyncHeadTo() {
    this.syncHeadTo = false;
    this.referToSource2 = null;
  }
  get lifeTimePercent() {
    return this.lifeTime / this.totalLifeTime;
  }
  get haveHeadTo() {
    // Not equals to initialize values
    return this.headTo.x !== 99 && this.headTo.y !== 101;
  }
  setPos(pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
  }
  update() {
    this.lifeTime -= 1;
    this.lifeTime = max(this.lifeTime, 0);
    this.circle.pos.x = this.pos.x;
    this.circle.pos.y = this.pos.y;
    if (this.syncHeadTo) {
      this.headTo.x = this.referToSource2.x;
      this.headTo.y = this.referToSource2.y;
    }
    if (this.syncPos) {
      this.pos.x = this.referToSource.x;
      this.pos.y = this.referToSource.y;
    }
    if (this.useAbsoluteCoords) {
      this.headTo.x = this.headToInAbsoluteCoords.x - this.pos.x;
      this.headTo.y = this.headToInAbsoluteCoords.y - this.pos.y;
    }
    if (this.lifeTime <= 0) {
      this.die();
    }
  }
  draw() {
    push();
    noStroke();
    const lifeTimePercent = Curve.f3(this.lifeTimePercent);
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
    translate(this.pos);
    fill(...this.color, lifeTimePercent * 80);
    circle(0, 0, 70);

    if (this.haveHeadTo) {
      push();

      stroke(...this.color, 150);
      strokeWeight(3);
      line(0, 0, this.headTo.x / 2, this.headTo.y / 2);
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
      players.realPlayers.forEach((player) => {
        this.#createParticleAttachTo(player);
      });
    }, 100);
  }
  #createParticleAttachTo(player) {
    let type = player.AIPlayer ? "friend_smell" : "enemy_smell";
    let lifeTime = 10 ** 6;

    const particle = this.createParticle({
      source: player,
      type: type,
      lifeTime: lifeTime,
      pos: player.pos,
      syncPos: true,
      headTo: player.rotation.headTo,
      syncHeadTo: true,
    });
    return particle;
  }
  createParticle(options) {
    options.parent = this;
    const particle = new Particle(options);
    this.particles.push(particle);
    return particle;
  }

  update() {
    // Debugging
    this.particles.forEach((each) => each.update());
    this.particles = this.particles.filter((each) => each.lifeTime > 0);
    this.collisions.update();
    // for (const player of players.realPlayers) {
    //   const get = this.getNear(player)
    //     .filter((e) => e.source === player)
    //     .filter((e) => e.lifeTime < 1000);

    //   if (
    //     get
    //       .filter((e) => e.lifeTimePercent > 0.75)
    //       .filter((e) => player.pos.dist(e.pos) < 35).length === 0
    //   ) {
    //     // console.log("this");
    //     const closest_smell = this.#getClosest(player.pos, get);
    //     if (!closest_smell) {
    //       continue;
    //     }
    //     const newParticle = this.#createParticleAttachTo(player);

    //     closest_smell.removeSyncPos();
    //     closest_smell.removeSyncHeadTo();

    //     closest_smell.lifeTime = lifeTime;
    //     closest_smell.totalLifeTime = lifeTime;
    //     closest_smell.useAbsoluteCoords = true;
    //     closest_smell.headToInAbsoluteCoords = newParticle.pos;
    //   }
    // }
    return;
  }
  draw() {
    this.particles.forEach((each) => each.draw());
  }
  getNear(particle) {
    // Debugging
    // return this.particles;
    let all = [];
    this.collisions.getNear(
      particle.pos,
      { rangeX: 500, rangeY: 500 },
      (each) => {
        all.push(each.parent);
      }
    );
    return all;
  }
  #getYoungest(list) {
    if (list.length < 0) {
      return null;
    }
    let now = list[0];
    for (const each of list) {
      if (each.lifeTime > now.lifeTime) {
        now = each;
      }
    }
    return now;
  }
  #getStrongest(list) {
    if (list.length < 0) {
      return null;
    }
    let now = list[0];
    for (const each of list) {
      if (each.strength > now.strength) {
        now = each;
      }
    }
    return now;
  }
  #getClosest(pos, list) {
    if (list.length < 0) {
      return null;
    }
    let now = list[0];
    let dist = 10 ** 9;
    for (const each of list) {
      if (pos.dist(each.pos) > dist) {
        now = each;
        dist = pos.dist(each.pos);
      }
    }
    return now;
  }
  tick(zombie) {
    let smell = this.getNear(zombie)
      .filter((each) => each.pos.dist(zombie.pos) > 10)
      .filter((each) => each.pos.dist(zombie.pos) < 500)
      .filter((each) =>
        collisions.isFreeLine(each.pos, zombie.pos, {
          ignore: [zombie.circle, player.circle],
          type: Obstacle,
        })
      );

    let enemy_smell = this.#getStrongest(smell);
    if (enemy_smell) {
      // directly see some enemy
      let headTo = p5.Vector.sub(enemy_smell.pos, zombie.pos);

      // console.log(enemy_smell.lifeTime);
      // headTo.rotate(radians(180));
      
      headTo.limit(3)
      zombie.addPos(headTo);
    }
  }
}
