{
  // let l = [
  //   47.9276099003758, 53.230510905634, 38.068674225439, 18.959853030364,
  //   5.77738839026691, 0.93047110573886, 0.12944123881037, 0.00984526887693,
  // ];
  // let id = setInterval(() => {
  //   let value = l.shift();
  //   a_look_at_b.setMag(value);
  // }, 16);
  // setTimeout(() => {
  //   clearInterval(id);
  // }, 16 * 5);
}
{
  // let x = {
  //   name: "x",
  //   constructor: function constructor() {
  //     this.x = 1;
  //     this.y = 2;
  //     console.log("constructor");
  //   },
  //   update: function update() {
  //     this.x = 1;
  //     this.y = 2;
  //     console.log("constructor");
  //   },
  //   call: function call() {
  //     console.log("call");
  //   },
  // };
  // x.constructor();
  // // x.f();
  // console.log(Object.keys(x));
  // allFunctions = Object.keys(x).filter(
  //   (key) => typeof x[key] === "function"
  // );
  // allFunctions = allFunctions.map((key) => x[key]);
  // console.log(allFunctions);
  // for (let i = 0; i < 8; i++) {console.log(i);
  // }
}

{
  class x {
    constructor() {
      console.log("constructor");
    }
    update() {
      console.log("update");
    }
  }

  let x1 = new x();
  x1.update = function update() {
    super.update();
    console.log("update2");
  };
  x1.update()
}
