let x = 0;

var console = new Console({
  hotkey: 27, // <kbd>ESC</kbd>
  welcome: "Welcome! Use /l <password> to start the game",
  autoComplete: true,

});
console.register("/help", (input) => {
  return "/help";
});

console.register((input) => {
  console.log(input);
  return input + "  123_" + JSON.stringify(x);
});

function customeAutoComplete (inputString) {
  const availableCommands = Object.keys(console.handlers)
  console.log(availableCommands.join(' '))

  return inputString
}
console.log("/help", "23") 
// .register(command, handler[, config])
// .register(command, handler) Register a handler to command
// .register(command, handler, config) Register a handler to cmd with a config object
// .register(handler) Register a defaultHandler
// .log(msg[, cmd])
// .log(msg) Write a message to console
// .log(msg, cmd) Write a message with an instruction to console
// .clear()
// .clear() Clear history
// .toggle([switch])
// .toggle() Toggle the console
// .toggle("on") Open it
// .toggle("off") Close it
// .destroy()
// .destroy() Suicide.
