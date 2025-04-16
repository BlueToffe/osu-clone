// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
import changeFileExtension from 'change-file-extension';

const decompress = require('decompress');

changeFileExtension("mapFile.osk", ".zip");

decompress("mapFile.zip", "maps").then(files => {
  console.log("done");
});


let gameState = "mainMenu";

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}
