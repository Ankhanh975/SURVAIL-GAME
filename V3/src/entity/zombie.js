class AIPlayer extends Player {
  constructor(settings) {
    super(settings);
    this.name = generateName.__call();
    this.AIPlayer = true;
    // this.recovery = -0.00001 * player.health;

    this.addComponent(component.wandering);
    this.addComponent(component.sensor);

    // this.target = int(random(0, this.parent.realPlayers.length));
    // this.target = null;
    // this.target = this.parent.realPlayers[0];
  }
  startPunch(hand, target) {
    super.startPunch(hand, target);
    field.createParticle({
      source: this,
      pos: {
        x: (this.pos.x + this.target.pos.x) / 2,
        y: (this.pos.y + this.target.pos.y) / 2,
      },
      type: "attack_attention",
    });
  }
  update() {
    super.update();

    // field.tick(this);
    // return

    this.target = this.parent.realPlayers[0];
    // if (
    //   !collisions.isFreeLine(this.pos, this.target.pos, {
    //     ignore: [this.circle, this.target.circle],
    //     // type: Obstacle,
    //   })
    // ) {
    //   return;
    // }
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
        // let rotate = constrain(dist, 30, 1000);
        // rotate = 1 / rotate ** 2;
        // rotate = rotate / 200;
        // rotate = radians(10) * rotate;
        // rotate = constrain(rotate, radians(0), radians(20));

        toLookAt.rotate(radians(10));
        toLookAt.setMag(3.0);
        this.addPos(toLookAt);
      }
    }

    return;
    //   a* pathfinding
    // if (this.target) {
    //   let totalMoveLength = 4.0;
    //   // console.log("path", this.path, this.lastPathFinding - frameCount)
    //   if (this.path.length < 3 && frameCount - this.lastPathFinding > 10) {
    //     this.path = obstacles.FindPath(this.pos, this.target.pos);
    //     this.lastPathFinding = frameCount;
    //   }
    //   if (this.path.length >= 2) {
    //     if (
    //       abs(
    //         this.path[this.path.length - 2][0] -
    //           this.path[this.path.length - 1][0]
    //       ) > 52 ||
    //       abs(
    //         this.path[this.path.length - 2][1] -
    //           this.path[this.path.length - 1][1]
    //       ) > 52
    //     ) {
    //       // If last node is too far away from the this.path
    //       // So: run pathfinding
    //       this.path = obstacles.FindPath(this.pos, this.target.pos);
    //       this.lastPathFinding = frameCount;
    //     }
    //   }

    //   // If path is not valid then recalculate
    //   let isValid = true;
    //   [...Array(min(this.path.length, 5)).keys()].forEach((i) => {
    //     let pos = obstacles.grid.WorldCoordsToGridCoords(...this.path[i]);
    //     if (obstacles.grid.get(...pos) === true) {
    //       isValid = false;
    //     }
    //   });

    //   if (isValid === false) {
    //     this.path = obstacles.FindPath(this.pos, this.target.pos);
    //     this.lastPathFinding = frameCount;
    //   }
    //   if (this.target.pos.dist(this.pos) > 100 && this.path.length > 0) {
    //     this.path.pop();
    //     this.path.push([this.target.pos.x, this.target.pos.y]);
    //     this.path.every((each) => {
    //       if (totalMoveLength < 0.01) {
    //         if (
    //           this.pos.dist(createVector(this.path[0][0], this.path[0][1])) <
    //           4.0 + 0.1
    //         ) {
    //           this.path.shift();
    //         }
    //         return false;
    //       }
    //       let moveTo = p5.Vector.sub(createVector(each[0], each[1]), this.pos);
    //       moveTo.limit(totalMoveLength);
    //       totalMoveLength -= moveTo.mag();
    //       this.addPos(moveTo);

    //       return true;
    //     });
    //   }
    // }
  }
}
