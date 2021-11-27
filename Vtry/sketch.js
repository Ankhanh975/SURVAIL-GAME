function createChunk(chunkX = 0, chunkY = 0) {
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
        x / 40 + (chunkX * 16) / 40,
        y / 40 + (chunkY * 16) / 40
      );
      // chunk[x][y] += noisejs.simplex2(x / 5, y / 5) / 20;
    }
  }
  return chunk;
}
function distance(p1, p2) {
  // dx = p2.x - p1.x;
  // dx *= dx;
  // dy = p2.y - p1.y;
  // dy *= dy;
  // return Math.sqrt(dx + dy);
  return min(p1.x - p2.x, p1.y - p2.y);
}

function getPoints(x, y, r) {
  // https://stackoverflow.com/questions/14611782/using-midpoint-circle-algorithm-to-generate-points-of-a-filled-circle
  var ret = [];
  for (var j = x - r; j <= x + r; j++)
    for (var k = y - r; k <= y + r; k++)
      if (distance({ x: j, y: k }, { x: x, y: y }) <= r)
        ret.push({ x: j, y: k });
  return ret;
}
function setup() {
  createCanvas(800, 800);
  noisejs.seed(random(0, 1));
}
let chunks = {};
let frame = 0;
// Player position in chunks coordinates
let playerX = 0;
let playerY = 0;

let radius = 1;
let chunkSize = 30;
function draw() {
  frame++;
  // playerX = round((mouseX - width / 2) / (chunkSize * 16) - 0.5);
  // playerY = round((mouseY - width / 2) / (chunkSize * 16) - 0.5);
  // playerY = mouseY;
  console.log("draw", frameRate(), playerX, playerY);
  background(0);
  translate(width / 2, height / 2);
  let drawChunks = getPoints(playerX, playerY, radius);
  // update chunk
  drawChunks.forEach((c) => {
    let chunk = chunks[`${c.x},${c.y}`];
    if (chunk !== undefined) {
      return;
    } else {
      chunks[`${c.x},${c.y}`] = createChunk(c.x, c.y);
    }
  });
  // drawChunks
  drawChunks.forEach((c) => {
    let chunk = chunks[`${c.x},${c.y}`];
    if (chunk === undefined) {
      return;
    }
    push();
    translate(c.x * chunkSize * 16, c.y * chunkSize * 16);
    for (var i = 0; i < chunk.length; i++) {
      for (var j = 0; j < chunk[i].length; j++) {
        var x = i * chunkSize;
        var y = j * chunkSize;
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
        if (v > 0.3) {
          fill(128, 128, 0);
        } else {
          fill(0, 0, 0);
        }
        stroke(0, 0, 0, 180);
        rect(x, y, chunkSize, chunkSize);
      }
    }
    pop();
  });
}
