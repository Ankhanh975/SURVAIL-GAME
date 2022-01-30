**Objective**

- Simple, Complex, Creative, Infinity, Cooperative, Realistic, and Functional, Interactive
- 
- finalizing
- done: find font, main character animation, background, sound
- ~12 2021: fill background image, camera object following player
- done: Add health, particle effects
- 04/01/2022: Log local when player open the game
- 04/01/2022: Spawn player is following a normal distribution
- 04/01/2022: Punch player pushback is following a lognormal curve
- 05/01/2022: finalizing the player objects and finalizing AI code
- 06/01/2022: Fix the player rotation limit speed algorithm
- 06/01/2022: Profile the performance
- 06/01/2022: Add ellipse collision detection
- 11/01/2022: Use font from google fonts
- 11/01/2022: Proper jump dicection detection 
- 11/01/2022: Proper collision detection handling!
Done: this check is every move => slow

- 19/01/2022: reFerter code
- 19/01/2022: Add continuous handling for box placement (before when fast movement is may miss )
- TODO: pathfinding: https://github.com/qiao/PathFinding.js
- TODO: More particles effects
- TODO: Sound
- TODO: Preset obstacles as topographic (simplex2 noise)
<!-- - TODO: Đặt obstacles vào thành 1 convex polygons  -->
- 30/01/2022: TODO: a surface obstacles.surface for static obstacles 
- Zombie behavior: Following it friend, wander
- 29/01/2022: TODO: freeze on push back
- 29/01/2022: TODO: on push back: push back on the path back.
Demo: https://youtu.be/NoWH5l08dMM
# Explained folder structure:
```
"V1", "V2", V3: I make a new copy when a major refactored version happens.
{
    "Example": list of examples tutorials / game
    "src": main source code directory
    "Lib": 3rd library directory
    {
        "bower_components": bower management
        "node_modules": node management
        else: manually copy
    }
    "Resources": .png & .mp3, font, ...
    "index.html": main file path to executed
    "sketch.js": main file path to code
    "README.md": main file path to documentation
}
```js
# Dependent:
- p5js documentation:
- https://p5js.org/reference/#/p5.Vector
- https://p5js.org/reference/
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
- Feel free to make commits and push requests!
- 
# Development
- The first few lines of code is done in 2020 Jan, because I found this game https://github.com/Ankhanh975/SURVAIL-GAME/tree/master/V1/Example/OnlinePuch
- is really cool!
- Layout:

```
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
|-- sketch.js       # Main flow
|-- onControl.js    # Attack keyboard & move event movement to some variable.
```js

Libraries
two.js
paper.js
anime.js
particles.js
pts.js
p5.js
three.js

FPSMeter (http://darsa.in/fpsmeter/)
https://ncase.me/sight-and-light/

https://github.com/hiiambradkim/sketches/tree/master/geometry
https://github.com/Bastl34/pixi-websocket-webpack-boilerplate
// https://www.google.com/search?q=js+foreach+performance&oq=js++f&aqs=chrome.2.69i57j69i59l3j0i512j69i60l3.5279j0j1&sourceid=chrome&ie=UTF-8
// "You probably wealthier than a king 200 years ago!" ~Economics Explained
