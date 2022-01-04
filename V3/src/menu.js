class Menu {
  constructor() {}
  display(txt) {
    if (toggleF1 === true) {
      return;
    }
    if (millis() < 5000) {
      txt += "\n\nHow to play?\nPress awsd, \nspace\nAnd L/R Click, \nF1, F11";
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
class Chatbox {
  constructor(chatbox) {
    this.message = [];
  }
  sayMessage(txt) {
    this.message.push("You: " + txt);
    console.log("this.message", this.message);
  }
  draw() {
    push();

    pop();
  }
}
let menu = new Menu();
let chatbox = new Chatbox();

// Stay close to the origin to find more people.
// Press F1 if you find out that it cramped.
// Press F11 to play in fullscreen mode!
// You can now play the game in multiplier!
// New to the game? Read introduction at https://github.com/Ankhanh975/SURVAIL-GAME
