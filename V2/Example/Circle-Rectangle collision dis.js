function pointRectDist(px, py, rx, ry, rwidth, rheight) {
  var cx = Math.max(Math.min(px, rx + rwidth), rx);
  var cy = Math.max(Math.min(py, ry + rheight), ry);
  return Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
}
let [x0, y0, r, x1, y1, x2, y2] = [0, 0, 100, 0, 0, 100, 100];
circle(x0, y0, r);
rect(x1, y1, x2 - x1, y2 - y1);
let r = dis(x0, y0, r, x1, y1, x2, y2);

console.log(r);
