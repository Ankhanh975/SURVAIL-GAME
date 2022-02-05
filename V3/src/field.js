// Idea: feel and coordinates chanel of zombie
// Zombie act to this field to do complex things
class Field {
  constructor() {
    this.particles = [];
    // this.collisions = new Collisions2();
    setTimeout(() => {
      players.players.forEach((each) => {
        if (each.AIPlayer) {
          this.createParticle(each.pos, "friend_smell", 7, 10 ** 10, {
            syncPos: true,
            parent: each,
          });
        } else {
          // this.create  Particle(each.pos, "enemy_smell", 70, 10 ** 10,  {syncPos: true});
        }
      });
    }, 100);
  }
  update() {
    players.realPlayers
      // players.players.filter((player) => !player.AIPlayer)
      .forEach((player) => {
        const smell = this.particles
          .filter((e) => e.name === "enemy_smell")
          .filter((e) => {
            return player.pos.dist(e.pos) < 20;
          });
        // console.log(smell.length);
        if (smell.length < 2) {
          this.createParticle(player.pos, "enemy_smell", 75, 250, {
            parent: player,
          });
          // Debugging
          // this.createParticle(player.pos, "enemy_smell", 75, 2);
        } else {
          const chosen = smell[0];
          chosen.lifeTime = chosen.totalLifeTime;
          chosen.pos.x = player.pos.x;
          // console.log(chosen);
          chosen.pos.y = player.pos.y;
        }
      });
    this.particles.forEach((each) => each.update());
    this.particles = this.particles.filter((each) => each.lifeTime > 0);
  }
  countType(list) {
    let enemy_smell_count = 0;
    let friend_smell_count = 0;
    let attack_attention_count = 0;
    let retreat_attention_count = 0;
    let detect_enemy_count = 0;
    let detect_enemy2_count = 0;

    list.forEach((each) => {
      if (each.name === "enemy_smell") {
        enemy_smell_count += 1;
      } else if (each.name === "friend_smell") {
        friend_smell_count += 1;
      } else if (each.name === "attack_attention") {
        attack_attention_count += 1;
      } else if (each.name === "retreat_attention") {
        retreat_attention_count += 1;
      } else if (each.name === "detect_enemy") {
        detect_enemy_count += 1;
      } else if (each.name === "detect_enemy2") {
        detect_enemy2_count += 1;
      }
    });
    return {
      enemy_smell: enemy_smell_count,
      friend_smell: friend_smell_count,
      attack_attention: attack_attention_count,
      retreat_attention: retreat_attention_count,
      detect_enemy: detect_enemy_count,
      detect_enemy2: detect_enemy2_count,
    };
  }
  getStrongest(list, name = "enemy_smell") {
    let strongestSmell;
    list
      .filter((each) => each.name === name)
      .forEach((each) => {
        if (!strongestSmell) {
          strongestSmell = each;
        } else if (each.size > strongestSmell.size) {
          strongestSmell = each;
        }
      });
    return strongestSmell;
  }
  tick(zombie) {
    // The brain of the zombie
    // if (count.detect_enemy + count.detect_enemy2 > 7) {
    // If 7 zombie players will be attack

    // const smell = chunks
    // .getNear(...zombie.chunkPos, 10)
    // .filter((object) => object instanceof SmileParticles)

    const smell = this.particles
      .filter((each) => each.pos.dist(zombie.pos) < each.smellRadius)
      .filter((each) => each.name === "enemy_smell")
      // Debugging
      .filter((each) =>
        collisions.isFreeLine(each.pos, zombie.pos, {
          ignore: [zombie.circle, player.circle],
          type: Obstacle,
        })
      );
    // Debugging
    // console.log(smell);
    // return
    const count = this.countType(smell);
    if (count.enemy_smell !== 0) {
      if (zombie.wandering.is()) {
        zombie.wandering.end();
      }
      this.createParticle(zombie.pos, "detect_enemy", 100, 2, {
        // heading: null,
      });
      const heading = this.getStrongest(smell, "enemy_smell");
      if (heading) {
        let toLookAt = p5.Vector.sub(heading.pos, zombie.pos);
        // .mult(heading.size);

        toLookAt.limit(3.0);
        zombie.addPos(toLookAt);
        zombie.setAngle(toLookAt.heading());
      }
      return;
    }
    // else if (count.detect_enemy !== 0) {
    //   smell
    //     .filter((each) => each.name === "detect_enemy")
    //     .filter((each) => each.pos.dist(zombie.pos) > 100)
    //     .forEach((each) => {
    //       const lookAt = each.pos;
    //       toLookAt.add(p5.Vector.sub(lookAt, zombie.pos));
    //     });
    //   smell
    //     .filter((each) => each.name === "detect_enemy")
    //     .filter((each) => each.pos.dist(zombie.pos) < 100)
    //     .some((each) => {
    //       this.createParticle(zombie.pos, "detect_enemy2", 100, 2);
    //       return true;
    //     });
    // }
    // else if (count.detect_enemy2 !== 0) {
    //   smell
    //     .filter((each) => each.name === "detect_enemy2")
    //     .filter((each) => each.pos.dist(zombie.pos) > 100)
    //     .forEach((each) => {
    //       const lookAt = each.pos;
    //       const dist = each.size * each.pos.dist(zombie.pos);
    //       toLookAt.add(p5.Vector.sub(lookAt, zombie.pos));
    //     });
    // }

    // TODO: tell other to attack_attention
    // TODO: wandering when dont see anything
    else {
      if (!zombie.wandering.is()) {
        zombie.wandering.start();
      }
      return;
    }
  }
  createParticle() {
    if (this.particles.length < 10000) {
      const p = new SmileParticles(...arguments);
      this.particles.push(p);
    }
  }
  draw() {
    this.particles.forEach((each) => {
      each.draw();
    });
  }
}

class SmileParticles {
  constructor(pos, name, size, lifeTime, settings) {
    this.pos = createVector(pos.x, pos.y);
    this.name = name;
    this.size = size;
    this.lifeTime = lifeTime || 100;

    this.totalSize = this.size;
    this.totalLifeTime = this.lifeTime;

    this.parent = null;

    if (settings) {
      if (settings.syncPos) {
        this.pos = pos;
      }

      if (settings.parent) {
        this.parent = settings.parent;
      }
    }

    // this.name == enemy_smell: zombie follow and keep distance to enemy
    // this.name == friend_smell: zombie follow friend group
    // this.name == attack_attention: zombie follow this particle and aggressive attack
    // this.name == retreat_attention
    if (this.name == "enemy_smell") {
      this.smellRadius = 700;
    } else if (this.name == "friend_smell") {
      this.smellRadius = 500;
    } else if (this.name == "attack_attention") {
      this.smellRadius = 500;
    } else if (this.name == "retreat_attention") {
      this.smellRadius = 500;
    } else if (this.name == "detect_enemy") {
      this.smellRadius = 500;
    } else if (this.name == "detect_enemy2") {
      // this.name == "detect_enemy2" mean see a anther detect_enemy
      this.smellRadius = 500;
    }
  }
  update() {
    this.lifeTime -= 1;
    this.lifeTime = max(this.lifeTime, 0);
    this.size = (this.lifeTime / this.totalLifeTime) * this.totalSize;
  }
  draw() {
    push();
    noStroke();
    if (this.name == "enemy_smell") {
      fill(100, 255, 0, (this.lifeTime / this.totalLifeTime) * 75);
    } else if (this.name == "friend_smell") {
      fill(255, 255, 255, 25);
    } else if (this.name == "attack_attention") {
      fill(100, 0, 0, (this.lifeTime / this.totalLifeTime) * 100);
    } else if (this.name == "retreat_attention") {
      fill(128, 255, 128, 25);
    } else if (this.name == "detect_enemy") {
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
  // getDirection() {
  //   if (this.parent) {
  //     if (this.parent.target) {
  //       return this.parent.target.heading();
  //     }
  //   }
  //   return null;
  // }
}
