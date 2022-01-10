let Curve = {
  f(x, variance = 1, mu = 1) {
    // \frac{1}{m\sqrt{2\pi}}e^{-\frac{1}{2}\frac{\left(x-s\right)}{m}^{2}}
    // normal-distribution curve
    return (
      Math.exp(-0.5 * Math.pow((x - mu) / variance, 2)) /
      (variance * sqrt(2 * Math.PI))
    );
  },
  f2(x, m = 0.1, s = 0.6, c = 0.7) {
    x = x + c;
    // https://www.desmos.com/calculator/yi1n3eiyiw
    // https://www.google.com/search?q=lognormal+curve+equation&newwindow=1&sxsrf=AOaemvINDJwzkX7BsNfUxfey_rE4JJleag:1641362510009&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiw3Ozq95n1AhWLCIgKHQvfCqQQ_AUoAXoECAEQAw&biw=1920&bih=973&dpr=1#imgrc=3lGck9Z8g1kW5M
    // \frac{\exp\left(-\frac{1}{2}\left(\frac{\ln\left(x-m\right)}{s}\right)^{2}\right)}{xs\sqrt{2\pi}}
    if (x <= 0) return 0;
    else
      return (
        Math.exp(-0.5 * (1 / (s * s)) * Math.pow(Math.log(x - m), 2)) /
        (x * s * Math.sqrt(2 * Math.PI))
      );
  },
  // https://math.stackexchange.com/questions/1114879/detect-if-two-ellipses-intersect
};

// Use in player.js
function average(angles) {
  // https://www.youtube.com/watch?v=xHq4UlJiUaE
  let x = 0;
  let y = 0;
  angles.forEach((n) => {
    x += Math.cos(n - 0);
    y += Math.sin(n - 0);
  });
  return Math.atan2(y, x) + 0;
}
