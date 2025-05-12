//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

const HIT_CIRCLE_BOUNDRY = 67;
const CURSOR_PERCENTAGE = 0.85;
const MAX_TRAIL_COUNT = 4;

let cursorTrailArray = [];
let lastMillis = 0;
let cursorTrailDelay = 30;
let apporachRate;
let mapDifficuty;
let hitCircleLocation;

let comboColours =  {
  Combo1: [184, 213, 255],
  Combo2: [231, 189, 255],
  Combo3: [199, 240, 255],
  Combo4: [255, 194, 255],
};

class HitCircleInfo {
  constructor() {
    this.objectString = [];
  }
  // use split to section off the array into its part the from there wer will be assiging a pointer to object x and y

  findHitCircleLocation(hitObjects) {
    for (let circlePointer = 0; circlePointer < hitObjects.length; circlePointer++) {
      this.objectString.push(hitObjects[circlePointer].split(","));
    }
    return this.objectString;
  }
}

function preload() {
  loadStrings("/maps/GenryuuKaiko/higantorrent.osu", loadMap); 

  hitCircleImage = loadImage("/skin/hitcircle.png");
  hitCircleOverlay = loadImage("/skin/hitcircleoverlay.png");
  approachCircleImage = loadImage("/skin/approachcircle.png");
  
  cursorImage = loadImage("/skin/cursor.png");
  cursorTrailImage = loadImage("/skin/cursortrail.png");
  
  soundFormats("mp3");
  mapSong = loadSound("/maps/GenryuuKaiko/GenryuuKaiko");
}

function setup() {
  createCanvas(1158, 902);
  imageMode(CENTER);
  noCursor();
  smooth();
}

function draw() {
  background(0);


  createHitCircles();
  updateCursor();

  // for (let hitCircleArrayPointer = 0; hitCircleArrayPointer < hitCircleLocation.length; hitCircleArrayPointer++) {
  //   image(hitCircleImage, hitCircleLocation[hitCircleArrayPointer][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[hitCircleArrayPointer][1] * 2 + HIT_CIRCLE_BOUNDRY);
  //   image(hitCircleOverlay, hitCircleLocation[hitCircleArrayPointer][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[hitCircleArrayPointer][1] * 2 + HIT_CIRCLE_BOUNDRY);
  // }


}



function loadMap(data) {
  for (let mapStats = 0; mapStats < data.length; mapStats++) {
    let previousSection = null;
    if (data[mapStats] === "[Difficulty]") {
      mapDifficuty = data.splice(mapStats + 1, 6);
    }

    if (data[mapStats] === "[HitObjects]") {
      hitCircles = data.splice(mapStats + 1, data.length - mapStats);
    }
  }


  hitCircleLocation = new HitCircleInfo();
  hitCircleLocation = hitCircleLocation.findHitCircleLocation(hitCircles);
}

function updateCursor() {

  if (millis() - lastMillis > cursorTrailDelay) {
    cursorTrailArray.push([]);
    for (let trailposition = 0; trailposition < cursorTrailArray.length; trailposition++) {
      cursorTrailArray[trailposition].push(mouseX, mouseY);
    }
    
    for (let trailPart = 0; trailPart < cursorTrailArray.length; trailPart++) {
      image(cursorTrailImage, cursorTrailArray[trailPart][0], cursorTrailArray[trailPart][1], cursorImage.height * CURSOR_PERCENTAGE, cursorImage.width * CURSOR_PERCENTAGE);
    }
    
    if (cursorTrailArray.length > MAX_TRAIL_COUNT) {
      cursorTrailArray.shift();
    }
  }
  image(cursorImage, mouseX, mouseY, cursorImage.height * CURSOR_PERCENTAGE, cursorImage.width * CURSOR_PERCENTAGE);
}

function createHitCircles() {

}