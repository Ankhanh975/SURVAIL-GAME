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
  // myFont = loadFont("Resources/Steps-Mono.otf");
  myFont = loadFont("Resources/Minecraft.ttf");
  // song = loadSound("Resources/C418 - Beginning 2.mp3");
  // song.play();
  // img = loadImage(" Zombie.png");
});
