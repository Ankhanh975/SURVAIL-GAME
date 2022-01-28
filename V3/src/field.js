// Idea: feel and coordinates chanel of zombie
// Zombie act to this field to do complex things
class Field {
  constructor() {
    this.particles = [];
  }
  update() {
    players.realPlayers.forEach((each) => {
      const p = new SmileParticles(each.pos, "enemy_smell", 75, 60);
      this.particles.push(p);
    });
    this.particles.forEach((each) => each.update());
    this.particles = this.particles.filter((each) => each.lifeTime > 1);
  }
  draw() {
    this.particles.forEach((each) => {
      each.draw();
    });
  }
  tick(zombie) {
    // The brain of the zombie
    let smell = this.particles.filter((each) => {
      return each.pos.dist(zombie.pos) < each.smellRadius;
    });
    let lookAt,
      dist,
      toLookAt = createVector(0, 0);

    smell.some((each) => {
      if (each.name == "enemy_smell" || each.name == "attack_attention") {
        lookAt = each.pos;
        dist = each.size * each.pos.dist(zombie.pos);
        toLookAt.add(p5.Vector.sub(lookAt, zombie.pos));
      }
    });
    // console.log(smell, toLookAt);
    if (toLookAt) {
      toLookAt.limit(3.0);
      zombie.addPos(toLookAt);
    }
  }
  create_particle;
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
      this.smellRadius = 1000;
    } else if (this.name == "friend_smell") {
      this.smellRadius = 1000;
    } else if (this.name == "attack_attention") {
      this.smellRadius = 1000;
    } else if (this.name == "retreat_attention") {
      this.smellRadius = 1000;
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
      fill(255, 0, 0, 25);
    } else if (this.name == "friend_smell") {
      fill(255, 255, 255, 25);
    } else if (this.name == "attack_attention") {
      fill(0, 0, 0, 25);
    } else if (this.name == "retreat_attention") {
      fill(128, 255, 128, 25);
    }
    circle(this.pos.x, this.pos.y, this.size);
    pop();
  }
}
let field = new Field();
