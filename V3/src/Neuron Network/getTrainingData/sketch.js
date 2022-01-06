let img;
let pg;
let pg2;
function preload() {
  img = loadImage("Animation_0.png");
}

function checkCollision(dist, ang1, ang2) {
  // draw collision virtually

  pg.background(0);

  pg.push();
  pg.translate(150 / 8, 100 / 2);
  pg.rotate(ang1);
  pg.image(img, 0, 0);
  pg.pop();
  // image(pg, 100, 100);

  pg2.background(0);

  pg2.push();
  pg2.translate(150 / 8, 100 / 2);
  pg2.translate(dist, 0);
  pg2.rotate(ang2);
  pg2.image(img, 0, 0);
  pg2.pop();

  // image(pg2, 100, 210);
  // // image(pg2, 100, 100);

  // check every pixel to find overlap
  pg.loadPixels();
  pg2.loadPixels();

  for (let y = 0; y < pg.height; y++) {
    for (let x = 0; x < pg.width; x++) {
      let index = (x + y * pg.width) * 4;
      if (
        pg.pixels[index] +
          pg.pixels[index + 1] +
          pg.pixels[index + 2] +
          pg2.pixels[index + 2] +
          pg2.pixels[index + 2] +
          pg2.pixels[index + 2] ===
        255 * 6
      ) {
        return true;
      }
    }
  }
  return false;
}

function setup() {
  pg = createGraphics(110, 100);
  pg2 = createGraphics(110, 100);
  pg.angleMode(DEGREES);
  pg.imageMode(CENTER);
  pg2.angleMode(DEGREES);
  pg2.imageMode(CENTER);
  createCanvas(400, 400);
}
let Z = "";
function draw() {
  console.log("frameCount", frameCount);
  if (frameCount % 100 === 0) {
    download("data.txt", Z);
    window.location.reload();
    Z = "";
  }
  if (frameCount === (360 * 360) / 50) {
    noLoop();
  }
  for (let i = 0; i < 50; i++) {
    let a = Math.round(random(18, 59 * 2));
    let b = Math.round(random(0, 360));
    let c = Math.round(random(0, 360));
    let x = checkCollision(a, b, c);
    Z = Z + `\n${a}, ${b}, ${c}, ${x}`;
  }
}
// 18 < dist < 65
// 0 < ang1 <= 360
// 0 < ang2 <= 360

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Start file download.
