function hashPair(x, y) {
  return (y << 16) ^ x; //((x + y)*(x + y + 1)/2) + y;
}
function generate(cx, cy, tx, ty, layer) {
  layer = typeof layer === "undefined" ? 0 : layer;
  var d = this.generation._delta;
  var s = this.generation._float;
  var n = this.noise.snoise(
    (cx * CHUNK_TILES + tx) / s / d,
    (cy * CHUNK_TILES + ty) / s / d,
    layer
  );
  /*
  var n = this.noise.snoise(
        ((((cx * CHUNK_SIZE) + (tx * TILE_SIZE))) / seed) / delta,
        ((((cy * CHUNK_SIZE) + (ty * TILE_SIZE))) / seed) / delta,
        layer)*/

  return n;
  //return Game.Utils.clampRange(Math.floor(v), min, max);
}

var TILE_SIZE = 32;
var CHUNK_SIZE = 512;

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = CHUNK_SIZE;
canvas.height = CHUNK_SIZE;

var cx = this.x;
var cy = this.y;
var ttype = "";
var subtype = "";

var x = 0;
var y = 0;
var v;
var vv;
var z;
var atx = 0;
aty = 0;

for (y = 0; y < CHUNK_TILES; y++) {
  for (x = 0; x < CHUNK_TILES; x++) {
    atx = x + ((cx * CHUNK_SIZE) / CHUNK_SIZE) * CHUNK_TILES;
    aty = y + ((cy * CHUNK_SIZE) / CHUNK_SIZE) * CHUNK_TILES;
    z = hashPair(atx, aty);
    v = map.generate(cx, cy, x, y);

    ttype = "water";
    subtype = "";
    if (v > 0) {
      if (v <= 0.1) {
        ttype = "sand";
      } else if (v <= 0.4) {
        ttype = "grass";
        if (v >= 0.3 && v <= 0.35) {
          subtype = "tree";
        }
      } else {
        ttype = "stone";
      }
    }

    textureSet.drawTile(
      context,
      "terrain",
      ttype,
      TILE_SIZE * x,
      TILE_SIZE * y,
      TILE_SIZE,
      TILE_SIZE
    );

    this.tiles[z] = new CTileData(atx, aty, x, y, v, ttype, subtype);

    if (subtype) {
      this.objects.push(z);
    }
  }
}
