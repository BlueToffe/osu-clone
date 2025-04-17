
import decompress from "decompress";

let gameState = "mainMenu";

function setup() {
  createCanvas(windowWidth, windowHeight);  
  decompress("mapFile.zip", "maps");
}

function draw() {
  background(220);
}
