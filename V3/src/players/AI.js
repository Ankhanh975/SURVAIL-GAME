class AIPlayer extends Player {
    constructor(animation, parent, pos = [0, 0]) {
      super(animation, parent, "n", pos);
      this.name = generateName.__call();
      this.AIPlayer = true;
      // this.target = int(random(0, this.parent.realPlayers.length));
      this.target = 0;
      this.path = [];
      this.lastPathFinding = frameCount - 999;
    }
  
    update() {
      let target = this.parent.realPlayers[this.target].pos;
  
      // let target;
      // {
      //   let targetDis = Infinity;
      //   this.parent.realPlayers.forEach((p) => {
      //     let d = this.pos.dist(p.pos);
      //     console.log("d", d, targetDis);
      //     if (d < targetDis) {
      //       targetDis = d;
      //       target = p.pos;
      //     }
      //   });
      // }
  
      {
        let lookAt, dist, toLookAt;
        lookAt = target;
        dist = this.pos.dist(lookAt);
        toLookAt = p5.Vector.sub(lookAt, this.pos);
        super.update(lookAt);
  
        super.update(createVector(0, 0));
        // if (dist < 150) {
        //   if (!this.onPunch()) {
        //     if (random(0, 100) >= 93.5) {
        //       this.startPunch();
        //     }
        //   }
        // }
  
        // if (dist < 130) {
        //   toLookAt.setMag(4.5);
        //   toLookAt.rotate(radians(180));
        //   this.addPos(toLookAt);
        // }
        // if (dist > 175) {
        //   toLookAt.setMag(3.0);
        //   this.addPos(toLookAt);
        // }
      }
      // {
      //   let totalMoveLength = 4.0;
      //   // console.log("path", this.path, this.lastPathFinding - frameCount)
      //   if (this.path.length < 3 && frameCount - this.lastPathFinding > 10) {
      //     this.path = obstacles.FindPath(this.pos, target);
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
      //       this.path = obstacles.FindPath(this.pos, target);
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
      //     this.path = obstacles.FindPath(this.pos, target);
      //     this.lastPathFinding = frameCount;
      //   }
      //   if (target.dist(this.pos) > 100 && this.path.length > 0) {
      //     this.path.pop();
      //     this.path.push([target[0], target[1]]);
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