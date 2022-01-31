class Menu {
  constructor() {}
  display(txt) {
    if (toggleF1 === true) {
      return;
    }

    push();
    // translate(310, -160);
    translate(width / 2 - 205, height / 4 - 400);
    // scale(windowWidth / 1024);

    stroke(50, 50, 50, 125);
    strokeWeight(3);
    fill(200, 200, 200, 125);
    rect(0, 0, 200, 325, 3);

    translate(20, 45);
    textFont(myFont);

    textSize(25);
    strokeWeight(0);
    fill(0, 0, 0, 255);
    text(txt, 0, 0);

    pop();
  }
}
let menu = new Menu();
var fpsMeter = new FPSMeter(null, {
  graph: 1,
  // interval: 1000,
  decimals: 0,
  heat: 1,
  smoothing: 1,
  // theme:"transparent",
  // Meter position
  position: "absolute", // Meter position.
  zIndex: 10, // Meter Z index.
  left: "17px", // Meter left offset.
  top: "8px", // Meter top offset.
  right: "auto", // Meter right offset.
  bottom: "auto", // Meter bottom offset.
  margin: "0 0 0 0", // Meter margin. Helps with centering the counter when left: 50%;
});

var cnsl = new Console({
  autoComplete: customeAutoComplete,
  hotkey: 27, // <kbd>ESC</kbd>
  
  // caseSensitive: false,
});
cnsl.register("/help", (input) => {
  return "/help";
});
cnsl.register("/setname", (input) => {
  return "/setname";
});
cnsl.register((input) => {
  return `You: ${input}`;
});

function customeAutoComplete(inputString) {
  const availableCommands = Object.keys(cnsl.handlers);
  cnsl.log(availableCommands.join(" "));

  return inputString;
}

cnsl.log("Welcome! Use /l <password> to start the game");
setInterval(() => {
  let t = [
    "HOW TO PLAY? Stay close to the origin to find more people. ",
    "HOW TO PLAY? Press F1 you can turn off this panel. ",
    "HOW TO PLAY? Press F11 to play in fullscreen  mode! ",
    "HOW TO PLAY? How to play? Press awsd  to move",
    "HOW TO PLAY? New to  the game? Read  github.com/ Ankhanh975/ SURVAIL-GAME",
    "HOW TO PLAY? You can now  play the game in multiplier! ",
    "HOW TO PLAY? You should set zoom to default 100%",
    "HOW TO PLAY? Try to survive!",
    "HOW TO PLAY? Try to survive!",
    "HOW TO PLAY? Press space or right click to use ability!",
    "HOW TO PLAY? Press space or right click to use ability!",
    "HOW TO PLAY? Game make byKHANH",
    "HOW TO PLAY? Game make by KHANH",
  ];
  let talkative = t[int(random(0, t.length))];
  cnsl.log(talkative);
}, 4000);

// setTimeout(() => {
//   if (keyIsDown(65)) {
//     console.log("toggle on");
//     cnsl.toggle("on");
//   } else {
//     console.log("toggle off");
//     cnsl.toggle("off");
//   }
// }, 1000);
