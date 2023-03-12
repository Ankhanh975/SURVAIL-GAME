class template {
  static my = "template";
  constructor() {}
  say() {
    console.log(template.my);
  }
}

let a = new template();
console.log(a.say());
