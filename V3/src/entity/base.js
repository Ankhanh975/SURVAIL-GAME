
class Base {
  constructor(parent, pos = [0, 0], name = "", health) {
    this.updates = [];
    
    this.pos = createVector(...pos);
    this.lastPos = createVector(0, 0);

    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.heading = createVector(100, 0);
    this.heading.angle = 0;
    // this.lookAt may be different from this.heading
    // because the heading have limited change in speed when this.lookAt is not
    this.lookAt = createVector(100, 0);
    this.parent = parent;

    this.name = name;

    this.health = health;
    this.totalHealth = health;
    this.recovery = 0.0;
    this.damage = 1;

    // physics in collision detection system
    this.circle = null;
    this.addComponent({
      setPos: (pos) => {
        this.parent.pos = pos;
        this.parent.circle.setPosition(this.parent.pos.x, this.parent.pos.y);
      },

      addPos: (pos) => {
        // pos: p5js vector add to this.parent.pos
        this.parent.setPos(this.parent.pos.add(pos));
      },
      update: () => {
        this.parent.health += this.parent.recovery;
        this.parent.health = constrain(this.parent.health, 0, this.parent.totalHealth);

        this.parent.lastPos = this.parent.pos.copy();
      },
      getNear: (maxDist) => {
        // TODO: Get near object next to this.pos
      },
    });
  }
  addComponent(component) {
    component.parent = this;
    let allFunctions = Object.keys(component);
    allFunctions = allFunctions.filter(
      (key) => typeof component[key] === "function"
    );
    allFunctions = allFunctions.map((key) => component[key]);
    allFunctions.forEach((func) => {
      if (func.name === "constructor") {
        func();
      } else if (func.name === "update") {
        this.updates.push(func);
      } else {
        eval(`this.${func.name}=func`);
      }
    });
    if (component.name) {
      eval(`this.${component.name}=component`);
    }
  }
  update() {
    this.updates.forEach((each) => {
      each();
    });
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
