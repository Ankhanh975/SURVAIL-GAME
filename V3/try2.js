let l = [0, 10, 20, 30, 0, 0];
let id = setInterval(() => {
  let value = l.shift();
  a_look_at_b.setMag(value);
}, 16);

setTimeout(() => {
  clearInterval(id);
}, 16 * 5);
