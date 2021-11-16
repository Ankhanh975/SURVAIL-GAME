const system = new System();

const player = system.createCircle({ x: 100, y: 100 }, 10);

const points = [
  { x: -60, y: -20 },
  { x: 60, y: -20 },
  { x: 60, y: 20 },
  { x: -60, y: 20 },
];
const wall1 = system.createPolygon({ x: 400, y: 500 }, points, 1.7);
const wall2 = system.createPolygon({ x: 200, y: 100 }, points, 2.2);
const wall3 = system.createPolygon({ x: 400, y: 50 }, points, 0.7);

system.update();

console.log(
  system.checkOne(player, ({ overlapV }) => {
    player.pos.x -= overlapV.x;
    player.pos.y -= overlapV.y;
  })
);
console.log(
  system.checkAll(({ a, overlapV }) => {
    a.pos.x -= overlapV.x;
    a.pos.y -= overlapV.y;
  })
);

system.separate();
