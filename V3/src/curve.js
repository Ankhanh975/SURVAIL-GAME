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

function lineBresenham_1(x1, y1, x2, y2) {
  if (x1 === NaN || y1 === NaN || x2 === NaN || y2 === NaN) {
    return [];
  }
  x1 = Math.floor(x1);
  y1 = Math.floor(y1);
  x2 = Math.floor(x2);
  y2 = Math.floor(y2);
  // Draw line between two points
  let pixels = [];
  let c2, c, Dx, Dy, x, y;
  Dx = Math.abs(x2 - x1);
  Dy = Math.abs(y2 - y1);
  c = Dx - Dy;
  c2 = 2 * c;
  x = x1;
  y = y1;

  let x_unit = 1,
    y_unit = 1;

  if (x2 - x1 < 0) x_unit = -x_unit;
  if (y2 - y1 < 0) y_unit = -y_unit;

  if (x1 == x2) {
    // duong thang dung
    while (y != y2) {
      y += y_unit;
      pixels.push([x, y]);
    }
  } else if (y1 == y2) {
    // duong ngang
    while (x != x2) {
      x += x_unit;
      pixels.push([x, y]);
    }
  } else if (x1 != x2 && y1 != y2) {
    // duong xien
    while (x != x2 + 1) {
      c2 = 2 * c;
      if (c2 > -Dy) {
        c = c - Dy;
        x = x + x_unit;
      }
      if (c2 < Dx) {
        c = c + Dx;
        y = y + y_unit;
      }
      pixels.push([x, y]);
    }
  }
  return pixels;
}
