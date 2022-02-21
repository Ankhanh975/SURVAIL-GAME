class MapGenerator {
  constructor(width, height, seed, useRandomSeed, randomFillPercent) {
    this.width = width;
    this.height = height;
    //   seed: string
    this.seed = seed;
    this.useRandomSeed = useRandomSeed;
    this.randomFillPercent = randomFillPercent;
    this.map = this.#createGrid(this.width, this.height);
    this.GenerateMap();
  }
  #createGrid(n, m) {
    let grid = [];
    let grid0 = [];
    for (let i = 0; i < n; i++) {
      grid.push(0);
    }
    for (let i = 0; i < m; i++) {
      grid0.push(0);
    }
    grid = grid.map(function (grid) {
      return grid0;
    });
    return grid;
  }
  #randInt(min, max) {
    // if (useRandomSeed) {
    //   this.seed = Math.floor(Date.now() / 1000);
    // }
    if (!this.useRandomSeed) {
      return 52;
    } else {
      // TODO: use seed
      // https://github.com/davidbau/seedrandom
      // const pseudoRandom = new Math.seedrandom(this.seed);

      // // Make a predictable pseudorandom number generator.
      // var myrng = new Math.seedrandom('hello.');
      // console.log(myrng());                // Always 0.9282578795792454
      // console.log(myrng());                // Always 0.3752569768646784

      // // Use "quick" to get only 32 bits of randomness in a float.
      // console.log(myrng.quick());          // Always 0.7316977467853576

      // // Use "int32" to get a 32 bit (signed) integer
      // console.log(myrng.int32());          // Always 1966374204

      // // Calling seedrandom with no arguments creates an ARC4-based PRNG
      // // that is autoseeded using the current time, dom state, and other
      // // accumulated local entropy.
      // var prng = new Math.seedrandom();
      // console.log(prng());                // Reasonably unpredictable.

      // // Seeds using the given explicit seed mixed with accumulated entropy.
      // prng = new Math.seedrandom('added entropy.', { entropy: true });
      // console.log(prng());                // As unpredictable as added entropy.

      // // Warning: if you call Math.seedrandom without `new`, it replaces
      // // Math.random with the predictable new Math.seedrandom(...), as follows:
      // Math.seedrandom('hello.');
      // console.log(Math.random());          // Always 0.9282578795792454
      // console.log(Math.random());          // Always 0.3752569768646784

      let next = random(min, max);
      next = Math.floor(next);
      return next;
    }
  }
  GenerateMap() {
    this.map = this.#createGrid(this.width, this.height);
    this.RandomFillMap();
    for (let i = 0; i < 5; i++) {
      this.SmoothMap();
    }
  }

  RandomFillMap() {
    if (this.useRandomSeed) {
      this.seed = Math.floor(Date.now() / 1000);
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
          map[x][y] = 1;
        } else {
          map[x][y] = this.#randInt(0, 100) < randomFillPercent ? 1 : 0;
        }
      }
    }
  }
  SmoothMap() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let neighbourWallTiles = GetSurroundingWallCount(x, y);

        if (neighbourWallTiles > 4) map[x][y] = 1;
        else if (neighbourWallTiles < 4) map[x][y] = 0;
      }
    }
  }
  GetSurroundingWallCount(gridX, gridY) {
    let wallCount = 0;
    for (let neighbourX = gridX - 1; neighbourX <= gridX + 1; neighbourX++) {
      for (let neighbourY = gridY - 1; neighbourY <= gridY + 1; neighbourY++) {
        if (
          neighbourX >= 0 &&
          neighbourX < this.width &&
          neighbourY >= 0 &&
          neighbourY < this.height
        ) {
          if (neighbourX != gridX || neighbourY != gridY) {
            wallCount += map[(neighbourX, neighbourY)];
          }
        } else {
          wallCount++;
        }
      }
    }

    return wallCount;
  }
}
