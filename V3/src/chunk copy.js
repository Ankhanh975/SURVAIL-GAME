class Chunk {
  constructor(chunkX, chunkY) {
    this.chunkX = chunkX;
    this.chunkY = chunkY;
  }
  update() {}
  draw() {}
}
// String.prototype.hashCode = function() {
//   var hash = 0, i, chr;
//   if (this.length === 0) return hash;
//   for (i = 0; i < this.length; i++) {
//     chr   = this.charCodeAt(i);
//     hash  = ((hash << 5) - hash) + chr;
//     hash |= 0; // Convert to 32bit integer
//   }
//   return hash;
// };
const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
function lengthOfNumber(num) {
  if (num > 0) {
    return Math.ceil(Math.log10(num + 1));
  } else {
    return Math.ceil(Math.log10(-num + 1));
  }
}

const hashCode = function (x, y) {
  return x + y / 10 ** lengthOfNumber(y);
};
class Chunks {
  constructor() {
    this.activeChunks = new Map();

    this.allChunks = {};
    this.cache = [];
    this.cache_value = [];
    this.key = new Set();
    this.update();
  }
  update() {
    // this.activeChunks = {};
    this.key = new Set();
    this.cache = [];
    this.cache_value = [];
    this.activeChunks.clear();
    // this.activeChunks.entries().forEach((name, chunk) => {
      // this.activeChunks.set(name, []);
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
        let chunkIndex = `${chunkPos[0]},${chunkPos[1]}`;
        // chunkIndex = hashCode(chunkIndex);
        if (this.activeChunks.has(chunkIndex)) {
          const list = this.activeChunks.get(chunkIndex);
          list.push(each);
        } else {
          this.activeChunks.set(chunkIndex, [each]);
          this.key.add(chunkIndex);
        }
      });
  }
  getNear(chunkX, chunkY, radius) {
    // console.log(radius, radius instanceof Number, radius.constructor === Array);
    // let index = -1;
    // for (const cache of this.cache) {
    //   index += 1;
    //   if (cache[0] === chunkX && cache[1] === chunkY && cache[2] === radius) {
    //     return this.cache_value[index];
    //   }
    // }

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
        let chunkIndex = `${x},${y}`;
        // chunkIndex = hashCode(chunkIndex);
        // if (this.key.has(chunkIndex)) {
        if (this.activeChunks.has(chunkIndex)) {
          const list = this.activeChunks.get(chunkIndex);
          all.push(...list);
        } else {
          this.activeChunks.set(chunkIndex, []);
        }
      }
    }
    // this.cache.push([chunkX, chunkY, radius]);
    // this.cache_value.push(all);
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
