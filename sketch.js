//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

const HIT_CIRCLE_BOUNDRY = 67;
const CURSOR_PERCENTAGE = 0.85;
const MAX_TRAIL_COUNT = 5;

let cursorTrailArray = [];
let lastMillis = 0;
let cursorTrailDelay = 30;
let apporachRate;
let mapDifficuty;
let hitCircleLocation;
let hitCirclesTimeStamps;
let currentHitObject = 0;

let comboColours =  {
  Combo1: [184, 213, 255],
  Combo2: [231, 189, 255],
  Combo3: [199, 240, 255],
  Combo4: [255, 194, 255],
};

class HitCircleInfo {
  constructor() {
    this.objectString = [];
    this.timeStampArray = [];
  }
  // use split to section off the array into its part the from there wer will be assiging a pointer to object x and y

  findHitCircleLocation(hitObjects) {
    for (let circlePointer = 0; circlePointer < hitObjects.length; circlePointer++) {
      this.objectString.push(hitObjects[circlePointer].split(","));
    }
    return this.objectString;
  }

  findTimeStamp(hitObjects) {
    for (let timePointer = 0; timePointer < hitObjects.length; timePointer++) {
      this.timeStampArray.push(hitObjects[timePointer][2]);
    }
    return this.timeStampArray;
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
  mapSong = loadSound("maps/GenryuuKaiko/GennryuuKaiko.mp3");
}

function setup() {
  createCanvas(1158, 902);
  imageMode(CENTER);
  noCursor();
  smooth();
  mapSong.play();
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
  // creates an array storing all map data
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

  hitCirclesTimeStamps = new HitCircleInfo();
  hitCirclesTimeStamps = hitCirclesTimeStamps.findTimeStamp(hitCircleLocation);
}

function updateCursor() {
  // updates and creates the cursor and cursor trail
  if (millis() - lastMillis > cursorTrailDelay) {
    cursorTrailArray.push([]);
    for (let trailPart = 0; trailPart < cursorTrailArray.length; trailPart++) {
      if (cursorTrailArray[trailPart].length < 2) {
        cursorTrailArray[trailPart].push(mouseX, mouseY);
      }
      image(cursorTrailImage, cursorTrailArray[trailPart][0], cursorTrailArray[trailPart][1], cursorImage.height * CURSOR_PERCENTAGE, cursorImage.width * CURSOR_PERCENTAGE);

      if (cursorTrailArray.length >= MAX_TRAIL_COUNT) {
        cursorTrailArray.shift();
      }
    }
  }

  image(cursorImage, mouseX, mouseY, cursorImage.height * CURSOR_PERCENTAGE, cursorImage.width * CURSOR_PERCENTAGE);
}

function createHitCircles() {
  if (Math.round(mapSong.currentTime() * 1000) > hitCirclesTimeStamps[0] - 450) {
    image(hitCircleImage, hitCircleLocation[currentHitObject][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[currentHitObject][1] * 2 + HIT_CIRCLE_BOUNDRY);
    image(hitCircleOverlay, hitCircleLocation[currentHitObject][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[currentHitObject][1] * 2 + HIT_CIRCLE_BOUNDRY);
    
    if (Math.round(mapSong.currentTime() * 1000) > hitCirclesTimeStamps[0]) {
      currentHitObject++;
      hitCirclesTimeStamps.shift();
    }
  }
}

function mousePressed() {
  mapSong.play();

}