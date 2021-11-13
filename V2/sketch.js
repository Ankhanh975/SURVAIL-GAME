let img;
function preload() {
  img = loadImage("Animation_0.png");
}
function setup() {
  createCanvas(400, 400);
  background(100);
}

function draw() {
  // background(255, 255, 255, 25);
  rotate(PI / 3.0);
  image(img, 100, 100);

}
