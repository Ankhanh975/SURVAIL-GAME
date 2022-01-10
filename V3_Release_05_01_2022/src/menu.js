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


