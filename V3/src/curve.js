// follow a normal curve
let Curve = {
  f(x, variance = 2.75) {
    let mu = 0;
    return (
      Math.exp(-((-x - mu) * (-x - mu)) / (2 * variance * variance)) /
      (variance * sqrt(2 * Math.PI))
    );
  },
};

// Use in player.js
function average(angles) {
    // https://www.youtube.com/watch?v=xHq4UlJiUaE
    let x = 0;
    let y = 0;
    angles.forEach((n) => {
      x += cos(n - 0);
      y += sin(n - 0);
    });
    return atan2(y, x) + 0;
  }