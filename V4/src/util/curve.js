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
// C program to implement
// Cubic Bezier Curve

/* Function that take input as Control Point x_coordinates and
Control Point y_coordinates and draw bezier curve */
function bezierCurve(x1, y1, x2, y2, x3, y3, return_point = 10) {
  // x: array, y: array
  // point: number of points to return
  let all = [];
  for (let t = 0; t <= 1; t += 1 / return_point) {
    let t2 = t * t;

    let A = 2 * t - 2 * t2;
    let B = t2 - 2 * t + 1;

    let x = t2 * x3 + A * x2 + B * x1;
    let y = t2 * y3 + A * y2 + B * y1;
    all.push([x, y]);
  }
  return all;
}

function drawCircle(xc, yc, r) {
  function put8pixel(xc, yc, x, y) {
    allPoints.push(x + xc, y + yc);
    allPoints.push(-x + xc, y + yc);
    allPoints.push(x + xc, -y + yc);
    allPoints.push(-x + xc, -y + yc);
    allPoints.push(y + xc, x + yc);
    allPoints.push(-y + xc, x + yc);
    allPoints.push(y + xc, -x + yc);
    allPoints.push(-y + xc, -x + yc);
  }
  let allPoints = [];
  x = 0;
  let y = r;
  let f = 1 - r;
  put8pixel(xc, yc, x, y);
  while (x < y) {
    if (f < 0) {
      f += (x << 1) + 3;
    } else {
      y--;
      f += ((x - y) << 1) + 5;
    }
    x++;
    put8pixel(xc, yc, x, y);
  }
  return allPoints;
}
