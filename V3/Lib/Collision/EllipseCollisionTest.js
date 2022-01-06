// source: https://math.stackexchange.com/questions/1114879/detect-if-two-ellipses-intersect
// https://math.stackexchange.com/questions/1114879/detect-if-two-ellipses-intersect
class EllipseCollisionTest {
  constructor(maxIterations) {
    this.maxIterations = maxIterations;
    // https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript
    this.innerPolygonCoef = Array.apply(null, Array(maxIterations + 1)).map(
      function () {}
    );
    this.outerPolygonCoef = Array.apply(null, Array(maxIterations + 1)).map(
      function () {}
    );
    for (let t = 0; t <= maxIterations; t++) {
      let numNodes = 4 << t;
      this.innerPolygonCoef[t] =
        0.5 / Math.cos((4 * Math.acos(0.0)) / numNodes);
      this.outerPolygonCoef[t] =
        0.5 /
        (Math.cos((2 * Math.acos(0.0)) / numNodes) *
          Math.cos((2 * Math.acos(0.0)) / numNodes));
    }
  }
  // Test for collision between two ellipses, "0" and "1". Ellipse is at (x, y) with major or minor radius
  // vector (wx, wy) and the other major or minor radius perpendicular to that vector and hw times as long.
  collide(x0, y0, wx0, wy0, hw0, x1, y1, wx1, wy1, hw1) {
    let rr =
      hw1 *
      hw1 *
      (wx1 * wx1 + wy1 * wy1) *
      (wx1 * wx1 + wy1 * wy1) *
      (wx1 * wx1 + wy1 * wy1);
    let x =
      hw1 * wx1 * (wy1 * (y1 - y0) + wx1 * (x1 - x0)) -
      wy1 * (wx1 * (y1 - y0) - wy1 * (x1 - x0));
    let y =
      hw1 * wy1 * (wy1 * (y1 - y0) + wx1 * (x1 - x0)) +
      wx1 * (wx1 * (y1 - y0) - wy1 * (x1 - x0));
    let temp = wx0;
    wx0 = hw1 * wx1 * (wy1 * wy0 + wx1 * wx0) - wy1 * (wx1 * wy0 - wy1 * wx0);
    let temp2 = wy0;
    wy0 = hw1 * wy1 * (wy1 * wy0 + wx1 * temp) + wx1 * (wx1 * wy0 - wy1 * temp);
    let hx0 =
      hw1 * wx1 * (wy1 * (temp * hw0) - wx1 * temp2 * hw0) -
      wy1 * (wx1 * (temp * hw0) + wy1 * temp2 * hw0);
    let hy0 =
      hw1 * wy1 * (wy1 * (temp * hw0) - wx1 * temp2 * hw0) +
      wx1 * (wx1 * (temp * hw0) + wy1 * temp2 * hw0);

    if (wx0 * y - wy0 * x < 0) {
      x = -x;
      y = -y;
    }

    if ((wx0 - x) * (wx0 - x) + (wy0 - y) * (wy0 - y) <= rr) {
      return true;
    } else if ((wx0 + x) * (wx0 + x) + (wy0 + y) * (wy0 + y) <= rr) {
      return true;
    } else if ((hx0 - x) * (hx0 - x) + (hy0 - y) * (hy0 - y) <= rr) {
      return true;
    } else if ((hx0 + x) * (hx0 + x) + (hy0 + y) * (hy0 + y) <= rr) {
      return true;
    } else if (
      x * (hy0 - wy0) + y * (wx0 - hx0) <= hy0 * wx0 - hx0 * wy0 &&
      y * (wx0 + hx0) - x * (wy0 + hy0) <= hy0 * wx0 - hx0 * wy0
    ) {
      return true;
    } else if (
      x * (wx0 - hx0) - y * (hy0 - wy0) >
        hx0 * (wx0 - hx0) - hy0 * (hy0 - wy0) &&
      x * (wx0 - hx0) - y * (hy0 - wy0) <
        wx0 * (wx0 - hx0) - wy0 * (hy0 - wy0) &&
      (x * (hy0 - wy0) + y * (wx0 - hx0) - hy0 * wx0 + hx0 * wy0) *
        (x * (hy0 - wy0) + y * (wx0 - hx0) - hy0 * wx0 + hx0 * wy0) <=
        rr * ((wx0 - hx0) * (wx0 - hx0) + (wy0 - hy0) * (wy0 - hy0))
    ) {
      return true;
    } else if (
      x * (wx0 + hx0) + y * (wy0 + hy0) >
        -wx0 * (wx0 + hx0) - wy0 * (wy0 + hy0) &&
      x * (wx0 + hx0) + y * (wy0 + hy0) <
        hx0 * (wx0 + hx0) + hy0 * (wy0 + hy0) &&
      (y * (wx0 + hx0) - x * (wy0 + hy0) - hy0 * wx0 + hx0 * wy0) *
        (y * (wx0 + hx0) - x * (wy0 + hy0) - hy0 * wx0 + hx0 * wy0) <=
        rr * ((wx0 + hx0) * (wx0 + hx0) + (wy0 + hy0) * (wy0 + hy0))
    ) {
      return true;
    } else {
      if (
        (hx0 - wx0 - x) * (hx0 - wx0 - x) + (hy0 - wy0 - y) * (hy0 - wy0 - y) <=
        rr
      ) {
        return iterate(x, y, hx0, hy0, -wx0, -wy0, rr);
      } else if (
        (hx0 + wx0 - x) * (hx0 + wx0 - x) + (hy0 + wy0 - y) * (hy0 + wy0 - y) <=
        rr
      ) {
        return iterate(x, y, wx0, wy0, hx0, hy0, rr);
      } else if (
        (wx0 - hx0 - x) * (wx0 - hx0 - x) + (wy0 - hy0 - y) * (wy0 - hy0 - y) <=
        rr
      ) {
        return iterate(x, y, -hx0, -hy0, wx0, wy0, rr);
      } else if (
        (-wx0 - hx0 - x) * (-wx0 - hx0 - x) +
          (-wy0 - hy0 - y) * (-wy0 - hy0 - y) <=
        rr
      ) {
        return iterate(x, y, -wx0, -wy0, -hx0, -hy0, rr);
      } else if (
        wx0 * y - wy0 * x < wx0 * hy0 - wy0 * hx0 &&
        abs(hx0 * y - hy0 * x) < hy0 * wx0 - hx0 * wy0
      ) {
        if (hx0 * y - hy0 * x > 0) {
          return iterate(x, y, hx0, hy0, -wx0, -wy0, rr);
        }
        return iterate(x, y, wx0, wy0, hx0, hy0, rr);
      } else if (
        wx0 * x + wy0 * y > wx0 * (hx0 - wx0) + wy0 * (hy0 - wy0) &&
        wx0 * x + wy0 * y < wx0 * (hx0 + wx0) + wy0 * (hy0 + wy0) &&
        (wx0 * y - wy0 * x - hy0 * wx0 + hx0 * wy0) *
          (wx0 * y - wy0 * x - hy0 * wx0 + hx0 * wy0) <
          rr * (wx0 * wx0 + wy0 * wy0)
      ) {
        if (wx0 * x + wy0 * y > wx0 * hx0 + wy0 * hy0) {
          return iterate(x, y, wx0, wy0, hx0, hy0, rr);
        }
        return iterate(x, y, hx0, hy0, -wx0, -wy0, rr);
      } else {
        if (hx0 * y - hy0 * x < 0) {
          x = -x;
          y = -y;
        }
        if (
          hx0 * x + hy0 * y > -hx0 * (wx0 + hx0) - hy0 * (wy0 + hy0) &&
          hx0 * x + hy0 * y < hx0 * (hx0 - wx0) + hy0 * (hy0 - wy0) &&
          (hx0 * y - hy0 * x - hy0 * wx0 + hx0 * wy0) *
            (hx0 * y - hy0 * x - hy0 * wx0 + hx0 * wy0) <
            rr * (hx0 * hx0 + hy0 * hy0)
        ) {
          if (hx0 * x + hy0 * y > -hx0 * wx0 - hy0 * wy0) {
            return iterate(x, y, hx0, hy0, -wx0, -wy0, rr);
          }
          return iterate(x, y, -wx0, -wy0, -hx0, -hy0, rr);
        }
        return false;
      }
    }
  }
  iterate(x, y, c0x, c0y, c2x, c2y, rr) {
    for (let t = 1; t <= maxIterations; t++) {
      let c1x = (c0x + c2x) * this.innerPolygonCoef[t];
      let c1y = (c0y + c2y) * this.innerPolygonCoef[t];
      let tx = x - c1x;
      let ty = y - c1y;
      if (tx * tx + ty * ty <= rr) {
        return true;
      }
      let t2x = c2x - c1x;
      let t2y = c2y - c1y;
      if (
        tx * t2x + ty * t2y >= 0 &&
        tx * t2x + ty * t2y <= t2x * t2x + t2y * t2y &&
        (ty * t2x - tx * t2y >= 0 ||
          rr * (t2x * t2x + t2y * t2y) >=
            (ty * t2x - tx * t2y) * (ty * t2x - tx * t2y))
      ) {
        return true;
      }
      let t0x = c0x - c1x;
      let t0y = c0y - c1y;
      if (
        tx * t0x + ty * t0y >= 0 &&
        tx * t0x + ty * t0y <= t0x * t0x + t0y * t0y &&
        (ty * t0x - tx * t0y <= 0 ||
          rr * (t0x * t0x + t0y * t0y) >=
            (ty * t0x - tx * t0y) * (ty * t0x - tx * t0y))
      ) {
        return true;
      }
      let c3x = (c0x + c1x) * outerPolygonCoef[t];
      let c3y = (c0y + c1y) * outerPolygonCoef[t];
      if ((c3x - x) * (c3x - x) + (c3y - y) * (c3y - y) < rr) {
        c2x = c1x;
        c2y = c1y;
        continue;
      }
      let c4x = c1x - c3x + c1x;
      let c4y = c1y - c3y + c1y;
      if ((c4x - x) * (c4x - x) + (c4y - y) * (c4y - y) < rr) {
        c0x = c1x;
        c0y = c1y;
        continue;
      }
      let t3x = c3x - c1x;
      let t3y = c3y - c1y;
      if (
        ty * t3x - tx * t3y <= 0 ||
        rr * (t3x * t3x + t3y * t3y) >
          (ty * t3x - tx * t3y) * (ty * t3x - tx * t3y)
      ) {
        if (tx * t3x + ty * t3y > 0) {
          if (
            abs(tx * t3x + ty * t3y) <= t3x * t3x + t3y * t3y ||
            (x - c3x) * (c0x - c3x) + (y - c3y) * (c0y - c3y) >= 0
          ) {
            c2x = c1x;
            c2y = c1y;
            continue;
          }
        } else if (
          -(tx * t3x + ty * t3y) <= t3x * t3x + t3y * t3y ||
          (x - c4x) * (c2x - c4x) + (y - c4y) * (c2y - c4y) >= 0
        ) {
          c0x = c1x;
          c0y = c1y;
          continue;
        }
      }
      return false;
    }
    return false; // Out of iterations so it is unsure if there was a collision. But have to return something.
  }
}
let ellipseCollisionTest = new EllipseCollisionTest(2);
