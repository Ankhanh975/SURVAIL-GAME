// old https://github.com/Prozi/detect-collisions
// const DetectCollisions = require("detect-collisions");
// global.DetectCollisions = DetectCollisions;

import Collisions from "./node_modules/collisions/src/Collisions.mjs";
// const {Collisions} = require("collisions");

// new: https://github.com/Sinova/Collisions
const system = new Collisions();
console.log(system);
global.DetectCollisions = DetectCollisions;

// browserify main.js -o bundle.js
// to get bundle.js and use that in index.html