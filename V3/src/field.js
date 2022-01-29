// Idea: feel and coordinates chanel of zombie
// Zombie act to this field to do complex things
class Field {
  constructor() {
    this.particles = [];
    // this.collisions = new Collisions2();
    setTimeout(() => {
      players.players.forEach((each) => {
        if (each.AIPlayer) {
          this.createParticle(each.pos, "friend_smell", 7, 10 ** 10, true);
        } else {
          this.createParticle(each.pos, "enemy_smell", 70, 10 ** 10, true);
        }
      });
    }, 100);
  }
  update() {
    // players.players.forEach((each) => {
    // if (each.AIPlayer) {
    // } else {
    // this.createParticle(each.pos, "enemy_smell", 75, 60);
    // }
    // });
    this.particles.forEach((each) => each.update());
    this.particles = this.particles.filter((each) => each.lifeTime > 0);
  }
  draw() {
    this.particles.forEach((each) => {
      each.draw();
    });
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
  tick(zombie) {
    // The brain of the zombie
    let smell = this.particles.filter((each) => {
      return each.pos.dist(zombie.pos) < each.smellRadius;
    });
    const count = this.countType(smell);
    let toLookAt = createVector(0, 0);
    if (count.enemy_smell !== 0) {
      this.createParticle(zombie.pos, "detect_enemy", 100, 2);
      // if (count.detect_enemy + count.detect_enemy2 > 70) {
      // If 7 zombie players will be attack
      smell
        .filter((each) => each.name === "enemy_smell")
        .forEach((each) => {
          const lookAt = each.pos;
          const dist = each.size * (1 / each.pos.dist(zombie.pos));
          toLookAt.add(p5.Vector.sub(lookAt, zombie.pos).mult(each.size));
        });
      // }
    } else if (count.detect_enemy !== 0) {
      smell
        .filter((each) => each.name === "detect_enemy")
        .filter((each) => each.pos.dist(zombie.pos) > 100)
        .forEach((each) => {
          const lookAt = each.pos;
          toLookAt.add(p5.Vector.sub(lookAt, zombie.pos));
        });
      smell
        .filter((each) => each.name === "detect_enemy")
        .filter((each) => each.pos.dist(zombie.pos) < 100)
        .some((each) => {
          this.createParticle(zombie.pos, "detect_enemy2", 100, 2);
          return true;
        });
    } else if (count.detect_enemy2 !== 0) {
      smell
        .filter((each) => each.name === "detect_enemy2")
        .filter((each) => each.pos.dist(zombie.pos) > 100)
        .forEach((each) => {
          const lookAt = each.pos;
          const dist = each.size * each.pos.dist(zombie.pos);
          toLookAt.add(p5.Vector.sub(lookAt, zombie.pos));
        });
    }

    // TODO: tell other to attack_attention
    // TODO: wandering when dont see anything
    if (toLookAt) {
      toLookAt.limit(3.0);
      zombie.addPos(toLookAt);
    }
  }
  createParticle() {
    if (this.particles.length < 10000) {
        const p = new SmileParticles(...arguments);
        this.particles.push(p);
    }
  }
}

class SmileParticles {
  constructor(pos, name, size, lifeTime, _pos = false) {
    this.name = name;
    if (_pos) {
      this.pos = pos;
    } else {
      this.pos = createVector(pos.x, pos.y);
    }
    this.size = size;
    this.totalSize = size;
    this.lifeTime = lifeTime || 100;
    this.totalLifeTime = lifeTime || 100;

    // this.name == enemy_smell: zombie follow and keep distance to enemy
    // this.name == friend_smell: zombie follow friend group
    // this.name == attack_attention: zombie follow this particle aggressive attack
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
      fill(100, 255, 0, 25);
    } else if (this.name == "friend_smell") {
      fill(255, 255, 255, 25);
    } else if (this.name == "attack_attention") {
      fill(100, 0, 0, 25);
    } else if (this.name == "retreat_attention") {
      fill(128, 255, 128, 25);
    } else if (this.name == "detect_enemy") {
      fill(100, 0, 0, 25);
    }
    circle(this.pos.x, this.pos.y, 70);
    pop();
  }
}
