const cnsl = new Console({ hotkey: 192 })

cnsl.register('addbots', function (num) {
    // Add some bots, then tell player:
    return num + ' bots added.'
})
Advance Usage
Options
var cnsl = new Console({
    hotkey: 27, // <kbd>ESC</kbd>
    welcome: 'Hello User.',
    caseSensitive: true,
    autoComplete: true,
    defaultHandler: function () {},
    onShow: function () {},
    onHide: function () {}
}, {
  'cmd1': function (args) {/*...*/},
  'cmd2': function (args) {/*...*/}
});
hotkey : {Number|Boolean} The keyCode of hotkey. 192(the ~) by default.
welcome: {String} The welcome message. '' by default.
caseSensitive: {Boolean} If you want to. false by default.
autoComplete: {Boolean|Function} Enable tab for auto completion.
defaultHandler: {Function} The fallback handler for all commands. noop by default.
onShow : {Function} On show callback. noop by default.
onHide : {Function} On hide callback. noop by default.
Register command with extra config
.register(commandName, commandHandler, commandConfig)

var cnsl = new Console()

cnsl.register('say', function () {
  return player.name + ': "' + Array.prototype.join.call(arguments, ' ') + '"'
}, {
  usage: 'SAY <message string>: Broadcast a message to other players in the game.'
})

cnsl.register('help', function () {
  return Object.keys(cnsl.handlers).map(function (name) {
    return ' - ' + cnsl.handlers[name].cfg.usage
  }).join('\n')
}, {
  usage: 'HELP: Show help messages.'
})
Custome autoComplete function
var cnsl = new Console({
  hotkey: 27,
  autoComplete: customeAutoComplete
})

function customeAutoComplete (inputString) {
  const availableCommands = Object.keys(cnsl.handlers)
  cnsl.log(availableCommands.join(' '))

  return inputString
}
API
Create a Console
new Console() Create a console instance (with default options)
new Console(options) Create a console with options. (see Basic Usage)
Instance Methods
Note: Console instances on https://amio.github.io/console.js/ were exposed on window. You can fiddle with them(window.cnsl and window.smtc) in devtools.

.register(command, handler[, config])
.register(command, handler) Register a handler to command
.register(command, handler, config) Register a handler to cmd with a config object
.register(handler) Register a defaultHandler
.log(msg[, cmd])
.log(msg) Write a message to console
.log(msg, cmd) Write a message with an instruction to console
.clear()
.clear() Clear history
.toggle([switch])
.toggle() Toggle the console
.toggle("on") Open it
.toggle("off") Close it
.destroy()
.destroy() Suicide.