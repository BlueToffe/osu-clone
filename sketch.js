const zl = require("zip-lib");

zl.extract("/mapFile.zip", "/maps/");

function setup() {
  createCanvas(windowWidth, windowHeight);  
}

function draw() {
  background(220);
}
