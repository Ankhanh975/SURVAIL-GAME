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


let talkative = "\nGame make \nby KHANH";
setInterval(() => {
  let t = [
    "\nStay close to\nthe origin\nto find more\npeople.\n",
    "\nPress F1 you \ncan turn off\nthis panel.\n",
    "\nPress F11 to\nplay in \nfullscreen \nmode!\n",
    "\nHow to play?\nPress awsd \nto move",
    "\nNew to \nthe game? Read \ngithub.com/\nAnkhanh975/\nSURVAIL-GAME",
    // "\nYou can now \nplay the game\nin multiplier!\n\n",
    // "\nYou should now \nset zoom to 100%",
    "\nTry to \n survive!",
    "\nTry to \n survive!",
    "\nPress space\nor right click\nto use ability!",
    "\nPress space\nor right click\nto use ability!",
    "\nGame make by \nKHANH",
    "\nGame make by \nKHANH",
    "",
    "",
    "",
    "",
    "",
  ];
  talkative = t[int(random(0, t.length))];
}, 3500);