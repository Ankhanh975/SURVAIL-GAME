let ctx;
let matrix;
addFunction("setup", () => {
  createCanvas(windowWidth, windowHeight - 5); //, WEBGL
  imageMode(CENTER);
  box = { x1: 0, y1: 0, x2: width, y2: height };
  ctx = document.querySelector("canvas").getContext("2d");
  translate(width / 2, height / 2);
  matrix = ctx.getTransform();
});
addFunction("draw", () => {
  ctx.setTransform(matrix);
  background(100);

  for (const i of transformQueue) {
    translate(i[0], i[1]);
    scale(i[2], i[2]);
    translate(-i[0], -i[1]);
  }
  if (transformQueue.length > 1) {
    matrix = ctx.getTransform();
    transformQueue.length = 0;
  }
});
addFunction("draw", () => {
  circle(0, 0, 100);
  circle(300, 0, 100);
  circle(0, 300, 100);
  circle(-0, -300, 100);
  circle(-300, 0, 100);
});
let transformQueue = [];

function mouseWheel(event) {
  let scaleVector = 1;
  let delta;
  if (event.delta > 0) {
    delta = 1;
  } else {
    delta = -1;
  }
  delta = 1 - delta / 20;
  transformQueue.push([
    mouseX- width / 2,
    mouseY- height / 2,
    delta,
  ]);
}

function getMousePos() {
  // Mouse position in real world coordinates after transformation
  // [ x']   [ a b c ] [ mouseX ]
  // [ y'] = [ d e f ] [ mouseY ]
  // [ 1 ]   [ 0 0 1 ] [    1   ]
  let current = [
    [matrix.a, matrix.b, matrix.c],
    [matrix.d, matrix.e, matrix.f],
    [0, 0, 1],
  ];
  let mouse = [mouseX, mouseY, 1];
  let [x, y, Null] = muti(mouse, current);
  function muti(position, matrix) {
    const m = matrix;
    const p = position;
    return [
      m[0][0] * p[0] + m[0][1] * p[1] + m[0][2] * p[2],
      m[1][0] * p[0] + m[1][1] * p[1] + m[1][2] * p[2],
      m[2][0] * p[0] + m[2][1] * p[1] + m[2][2] * p[2]
    ];
  }
  return [x, y];
}
