function preload() {
  PRELOAD.forEach((f) => {
    f();
  });
}

function setup() {
  SETUP.forEach((f) => {
    f();
  });
}
function draw() {
  DRAW.forEach((f) => {
    f();
  });
}
const PRELOAD = [];
const SETUP = [];
const DRAW = [];
function addFunction(NAME, f) {
  if (NAME === "preload") {
    PRELOAD.push(f);
  } else if (NAME === "draw") {
    DRAW.push(f);
  } else if (NAME === "setup") {
    SETUP.push(f);
  }
}

var myFont;
addFunction("preload", () => {
  // myFont = loadFont("Assets/Steps-Mono.otf");
  myFont = loadFont("Assets/Minecraft.ttf");
  // song = loadSound("Assets/C418 - Beginning 2.mp3");
  // song.play();
  // img = loadImage("Assets/Zombie.png");
});

addFunction("draw", () => {
  // translate(0.5, 0.5);
  translate(width / 2, height / 2);
  // background(100);
  noSmooth();
});

class Queue {
  constructor() {
    this.queue1 = [];
    this.queue2 = [];
  }
  addDraw(event) {
    this.queue1.push(event);
  }
  addPro(event) {
    this.queue2.push(event);
  }
  update() {
    this.queue1.forEach((q) => {
      eval(q);
    });
    this.queue1 = [];
  }
  updatePro() {
    this.queue2.forEach((q) => {
      eval(q);
    });
    this.queue2 = [];
  }
}

function throwError(str) {
  throw new Error(str);
}
