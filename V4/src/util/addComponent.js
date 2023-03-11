class Base {
  constructor() {
    this.updates = [];
  }

  addComponent(component) {
    component = new component();
    let allFunctions = Object.keys(component);
    allFunctions = allFunctions.map((key) => component[key]);
    allFunctions = allFunctions.filter((key) => typeof key === "function");

    component.parent = this;
    allFunctions.forEach((func) => {
      if (func.name === "constructor") {
        func();
      } else if (func.name === "update") {
        this.updates.push(func);
      } else if (func.name) {
        if (!func.name.startsWith("#")) {
          // Start with a # indicate that the function is a private function.
          eval(`this.${func.name}=func`);
        }
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