let l = [20, 40, 60, 80, 60, 40, 20, 0];
let id = setInterval(() => {
  let value = l.shift();
  a_look_at_b.setMag(value);
}, 16);

setTimeout(() => {
  clearInterval(id);
}, 16 * 5);
