let chunks;

function createChunk(chunkX = 0, chunkY = 0, seed = random(0, 1)) {
  noisejs.seed(seed);
  let chunk = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  for (x = 0; x < chunk[0].length; x++) {
    for (y = 0; y < chunk.length; y++) {
      chunk[x][y] = noisejs.simplex2(
        x / 40 + chunkX * 16,
        y / 40 + chunkY * 16
      );
      // chunk[x][y] += noisejs.simplex2(x / 5, y / 5) / 20;
    }
  }
  return chunk;
}
function setup() {
  createCanvas(800, 800);
  noisejs.seed(random(0, 1));
  chunks = { "0,0": createChunk(0, 0) };

  console.log(chunks);
}

function draw() {
  background(100);
  let chunk = chunks["0,0"];
  for (var i = 0; i < chunk.length; i++) {
    for (var j = 0; j < chunk[i].length; j++) {
      var x = i * 30;
      var y = j * 30;
      let v = chunk[i][j];
      if (v > 0 && v <= 0.1) {
        fill(128, 128, 0);
      } else if (v > 0.1 && v <= 0.5) {
        fill(0, 255, 0);
      } else if (v > 0.5 && v < 1) {
        fill(150 + v * 5, 150 + v * 5, 150 + v * 5);
      } else if (v > -0.2 && v <= 0) {
        fill(0, 0, 245);
      } else {
        fill(10 - v * 5, 10 - v * 5, 202 - v * 5);
      }
      stroke(0, 0, 0, 180);
      rect(x, y, 30, 30);
    }
  }
}
