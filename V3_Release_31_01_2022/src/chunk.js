class Chunk {
  constructor(chunkX, chunkY) {
    this.chunkX = chunkX;
    this.chunkY = chunkY;
  }
  update() {}
  draw() {}
}

class Chunks {
  constructor() {
    this.activeChunks = {};
    this.allChunks = {};
  }
  update() {
    this.activeChunks = {};
    []
      .concat(players.players)
      .concat(obstacles.obstacles)
      .concat(field.particles)
      // .concat(sparks.particles)
      .forEach((each) => {
        const worldCoords = each.pos || each.circle.pos;
        const chunkPos = this.WorldCoordsToChunkCoords(
          worldCoords.x,
          worldCoords.y
        );
        each.chunkPos = chunkPos;
        const chunkIndex = `${chunkPos[0]}, ${chunkPos[1]}`;
        if (this.activeChunks[chunkIndex]) {
          this.activeChunks[chunkIndex].push(each);
        } else {
          this.activeChunks[chunkIndex] = [each];
        }
      });
    // console.log(this.activeChunks);
  }
  getNear(chunkX, chunkY, radius) {
    // console.log(radius, radius instanceof Number, radius.constructor === Array);
    let upLeft, upRight, bottomLeft, bottomRight;
    let all = [];
    if (radius.constructor === Array) {
      upLeft = chunkX - radius[0];
      upRight = chunkX + radius[0];
      bottomLeft = chunkY - radius[1];
      bottomRight = chunkY + radius[1];
    } else {
      upLeft = chunkX - radius;
      upRight = chunkX + radius;
      bottomLeft = chunkY - radius;
      bottomRight = chunkY + radius;
    }
    // console.log(upLeft, upRight, bottomLeft, bottomRight);
    for (let x = upLeft; x < upRight; x++) {
      for (let y = bottomLeft; y < bottomRight; y++) {
        const chunkIndex = `${x}, ${y}`;
        const activeChunks = this.activeChunks[chunkIndex];
        if (activeChunks) {
          all = all.concat(activeChunks);
        }
      }
    }
    return all;
  }
  WorldCoordsToChunkCoords(posx, posy) {
    let returnX, returnY;

    returnX = Math.floor(posx / 100);
    returnY = Math.floor(posy / 100);

    return [returnX, returnY];
  }
  ChunkCoordsToWorldCoords(chunkX, chunkY) {
    return [chunkX * 100, chunkY * 100];
  }
}
