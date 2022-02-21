// The Prime Spiral (aka Ulam Spiral)f
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/167-prime-spiral.html
// https://youtu.be/a35KWEjRvc0

// Prime Spiral: https://editor.p5js.org/codingtrain/sketches/0Ud-XsaYb
// Number Spiral: https://editor.p5js.org/codingtrain/sketches/Zs65bV-Al
// Prime vs Random Spiral: https://editor.p5js.org/codingtrain/sketches/3np1hBlXD
// Shapes and Color: https://editor.p5js.org/codingtrain/sketches/mCvvSKpZ5
// Prime Spiral 3D: https://editor.p5js.org/codingtrain/sketches/-eX078HZ5

// State of spiral
function getSpiral(___step, _stepSize) {
  let x = 0;
  let y = 0;
  let step = 1;
  let state = 0;
  let numSteps = 1;
  let turnCounter = 1;
  let stepSize = _stepSize || 1;

  function draw() {
    // Move according to state
    switch (state) {
      case 0:
        x += stepSize;
        break;
      case 1:
        y -= stepSize;
        break;
      case 2:
        x -= stepSize;
        break;
      case 3:
        y += stepSize;
        break;
    }

    // Change state
    if (step % numSteps == 0) {
      state = (state + 1) % 4;
      turnCounter++;
      if (turnCounter % 2 == 0) {
        numSteps++;
      }
    }
    step++;
    return [x, y];
  }
  for (var i = 0; i < ___step; i++) {
    draw();
  }
  return draw();
}

if (true) {
  for (var i = 0; i < 20; i++) {
    // const x = getSpiral(i);
    const x = getSpiral(i, 2);
    console.log(x);
  }
}
