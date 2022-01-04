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

    if (millis() < 2000) {
      fill(255, 255, 255, 150);
      translate(-500, 500);
      text(
        "How to play?\n Press a, w, s, d, enter, And Left/Right Click, F1 F11,",
        0,
        0
      );
    }

    pop();
  }
}
let menu = new Menu();
