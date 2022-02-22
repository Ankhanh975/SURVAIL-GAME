class MapGenerator {
  constructor(settings) {
    this.width = settings.width || 100;
    this.height = settings.height || 100;
    //   seed: string
    this.seed = settings.seed || 100;
    this.useRandomSeed = settings.useRandomSeed || true;
    this.randomFillPercent = settings.randomFillPercent || 70;
    this.randomFillPercent = constrain(this.randomFillPercent, 0, 100);

    this.map = this.#createGrid(this.width, this.height);
    this.GenerateMap();
  }
  #createGrid(n, m) {
    return new Array(n).fill(0).map(() => new Array(m).fill(0));
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
      this.seed = Math.floor(Date.now() / 1000) - 1644438983 - 1000012;
    }

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1) {
          this.map[x][y] = 1;
        } else {
          this.map[x][y] =
            this.#randInt(0, 100) < this.randomFillPercent ? 1 : 0;
        }
      }
    }
  }
  SmoothMap() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let neighbourWallTiles = this.GetSurroundingWallCount(x, y);

        if (neighbourWallTiles > 4) this.map[x][y] = 1;
        else if (neighbourWallTiles < 4) this.map[x][y] = 0;
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
            wallCount += this.map[(neighbourX, neighbourY)];
          }
        } else {
          wallCount++;
        }
      }
    }

    return wallCount;
  }
}
