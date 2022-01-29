class Base {
  constructor() {
    this.updates = [];
  }

  addComponent(component) {
    component = new component();
    let allFunctions = Object.keys(component);
    allFunctions = allFunctions.map((key) => component[key]);
    allFunctions = allFunctions.filter((key) => typeof key === "function");

    // console.log(allFunctions);
    component.parent = this;
    allFunctions.forEach((func) => {
      if (func.name === "constructor") {
        func();
      } else if (func.name === "update") {
        this.updates.push(func);
      } else if (func.name) {
        eval(`this.${func.name}=func`);
      }
    });
    if (component.name) {
      eval(`this.${component.name}=component`);
    }
  }
  update() {
    for (const each of this.updates) {
      each();
    }
  }
}
// let base = new Base();
// base.addComponent({
//   name: "position",
//   constructor: () => {
//     this.x = 1;
//     this.y = 2;
//     console.log("component constructor");
//   },

//   update: () => {
//     this.x = 1;
//     this.y = 2;
//     console.log("component update", this);
//   },
//   setPos: () => {
//     console.log("component setPos");
//   },
// });
// console.log(base);
// base.setPos();
// base.update();
