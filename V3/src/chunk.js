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
    this.activeChunks = new Map();

    this.allChunks = {};
    this.cache = [];
    this.cache_value = [];
    this.update();
  }
  update() {
    // this.activeChunks = {};
    this.activeChunks.clear();
    // Object.keys(this.activeChunks).forEach((name) => {
    //   this.activeChunks[name] = [];
    // });

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
        const chunkIndex = `${chunkPos[0]},${chunkPos[1]}`;
        if (this.activeChunks.has(chunkIndex)) {
          const list = this.activeChunks.get(chunkIndex);
          list.push(each);
        } else {
          this.activeChunks.set(chunkIndex, [each]);
        }
      });
    this.cache = [];
    this.cache_value = [];
  }
  getNear(chunkX, chunkY, radius) {
    // console.log(radius, radius instanceof Number, radius.constructor === Array);
    let index = -1;
    for (const cache of this.cache) {
      index += 1;
      if (cache[0] === chunkX && cache[1] === chunkY && cache[2] === radius) {
        return this.cache_value[index];
      }
    }
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
        // const chunkIndex = { x: x, y: y };
        const chunkIndex = `${x},${y}`;
        if (this.activeChunks.has(chunkIndex)) {
          const list = this.activeChunks.get(chunkIndex);
          all.push(...list);
        }
      }
    }
    this.cache.push([chunkX, chunkY, radius]);
    this.cache_value.push(all);
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
