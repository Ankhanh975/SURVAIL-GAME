- Objective:
- Simple, Creative, Infinity, Cooperative, Realistic, and Functional, Interactive
- 
- finalizing
- done: find font, main character animation, background, suonds
- ~12 2021: fill background image, camera object following player
- done: Add health, particle effects
- 04 01 2021: Log local when player open the game
- 04 01 2021: Spawn player is following a normal distribution
- 04 01 2021: Punch player pushback is following a lognormal curve
- 05 01 2021: finalizing the player objects and finalizing AI code
- 06 01 2021: Fix the player rotation limit speed algorithm
- 06 01 2021: Profile the performance
- 06 01 2021: Add ellipse collision detection
- Demo: https://youtu.be/NoWH5l08dMM
- TODO: pathfinding: https://github.com/qiao/PathFinding.js
- TODO: More particles effects
- TODO: Sound
- TODO: Preset obstacles as topographic (simplex2 noise)
- 
- 
- 
- Explained folder structure:
- 
- "V1", "V2", ...: I make a new copy when a major refactored version happens.
- {
-     "Example": list of examples tutorials / game
-     "src": main source code directory
-     "Lib": 3rd library directory
-     {
-         "bower_components": bower management
-         "node_modules": node management
-         else: manually copy
-     }
-     "Resources": .png & .mp3, font, ...
-     "index.html": main file path to executed
-     "sketch.js": main file path to code
-     "README.md": main file path to documentation
- }
Dependent:
p5js documentation:
https://p5js.org/reference/#/p5.Vector
https://p5js.org/reference/
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
Feel free to make commits and push requests!

Development
The first few lines of code is done in 2020 Jan, because I found this game https://github.com/Ankhanh975/SURVAIL-GAME/tree/master/V1/Example/OnlinePuch
is really cool!
Layout:

.
|-- setup.js        # helper function
|-- menu.js         # responding for menu selection
|-- Camera.js       # responding of following player, blur effect, ...
|-- particles.js    # particles effects
|-- obstacles.js    # the yellow obstacles 
|-- player.js       # The code for a player object or AIs behaviour
|-- players.js      # Group 
|-- curve.js"       # curve use for animation
|-- generate.js     # Generate fake data.
|-- sketch.js"      # Main flow