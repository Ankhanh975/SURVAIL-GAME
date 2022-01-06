Objective:
Simple, Creative, Infinity, Cooperative, Realistic, and Functional, Interactive

finalizing
done: find font, main character animation, background, suonds
~12 2021: fill background image, camera object following player
done: Add health, particle effects
05 01 2021: finalizing the player objects and finalizing AI code
06 01 2021: Fix the player rotation limit speed algorithm
06 01 2021: Profile the performance
06 01 2021: Add ellipse collision detection

Explained folder structure:

"V1", "V2", ...: I make a new copy when a major refactored version happens.
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
