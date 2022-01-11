let l = [
  47.9276099003758, 53.230510905634, 38.068674225439, 18.959853030364,
  5.77738839026691, 0.93047110573886, 0.12944123881037, 0.00984526887693,
];
let id = setInterval(() => {
  let value = l.shift();
  a_look_at_b.setMag(value);
}, 16);

setTimeout(() => {
  clearInterval(id);
}, 16 * 5);
