const system = new DetectCollisions.System();

const circle = new DetectCollisions.Circle({ x: 0, y: 0 }, 10);
const circle2 = new DetectCollisions.Circle({ x: 0, y: 19 }, 10);
system.insert(circle);
system.insert(circle2);
system.update();

system.checkAll(({ a, overlapV }) => {
  // overlapV: Number | overlap distance between 2 circles
  console.log("overlap", a, overlapV);
});
console.log("system", system);
