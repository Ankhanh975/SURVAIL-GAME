var cnsl = new Console({
  autoComplete: customeAutoComplete,
  hotkey: 27,
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
