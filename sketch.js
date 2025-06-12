//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

const HIT_CIRCLE_BOUNDRY = 64;
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
let visableCircle = [];
let hitJudgment = [];

let comboColours =  {
  Combo1: [0, 202, 0],
  Combo2: [18, 124, 255],
  Combo3: [242, 24, 57],
  Combo4: [255, 192, 0],
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

class VisableHitCircles {
  constructor(hitObject, time) {
    this.objectLocation = hitObject;
    this.objectTime = time;
  }
}

function preload() {
  loadStrings("/maps/GenryuuKaiko/higantorrent.osu", loadMap); 

  hitCircleImage = loadImage("/skin/hitcircle.png");
  hitCircleOverlay = loadImage("/skin/hitcircleoverlay.png");
  approachCircleImage = loadImage("/skin/approachcircle.png");
  
  cursorImage = loadImage("/skin/cursor.png");
  cursorTrailImage = loadImage("/skin/cursortrail.png");

  hit100Image = loadImage("/skin/hit100.png");
  hit50Image = loadImage("/skin/hit50.png");
  hit0Image = loadImage("/skin/hit0.png");
  
  soundFormats("mp3");
  mapSong = loadSound("maps/GenryuuKaiko/GennryuuKaiko.mp3");
}

function setup() {
  createCanvas(1158, 902);
  imageMode(CENTER);
  noCursor();
  smooth();
  rectMode(CENTER);
  outputVolume(0.03);
}

function draw() {
  background(0);

  createHitCircles();
  if (visableCircle.length > 0) {  
    showHitCircles();
    showJudgment();
  }

  updateCursor();

  fill("white");
  text(frameRate(), 500, 500);
  
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
      push();
      tint(255, 160);
      image(cursorTrailImage, cursorTrailArray[trailPart][0], cursorTrailArray[trailPart][1], cursorImage.height * CURSOR_PERCENTAGE, cursorImage.width * CURSOR_PERCENTAGE);
      pop();
      if (cursorTrailArray.length >= MAX_TRAIL_COUNT) {
        cursorTrailArray.shift();
      }
    }
  }

  image(cursorImage, mouseX, mouseY, cursorImage.height * CURSOR_PERCENTAGE, cursorImage.width * CURSOR_PERCENTAGE);
}

function keyPressed() {
  if (keyCode === 13 && !mapSong.isPlaying()) {
    mapSong.play();
  }

  if (keyCode === 16) {
    mapSong.pause();
  }

  //detects
  if ((keyIsDown(71) || keyIsDown(72)) && visableCircle.length > 0) {
    if (mouseX <= int(hitCircleLocation[visableCircle[0].objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY) + HIT_CIRCLE_BOUNDRY && mouseX >= int(hitCircleLocation[visableCircle[0].objectLocation][0] * 2) && mouseY <= int(hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY) + HIT_CIRCLE_BOUNDRY  && mouseY >= int(hitCircleLocation[visableCircle[0].objectLocation][1] * 2)) {
      judgementTimer();
    }
  }
}

function createHitCircles() {
  //adds objects to and array for visable objects
  if (Math.round(mapSong.currentTime() * 1000) > hitCirclesTimeStamps[0] - 510) {
    visableCircle.push(new VisableHitCircles(currentHitObject, hitCirclesTimeStamps[0]));
    currentHitObject++;
    hitCirclesTimeStamps.shift();
  }
}

function showHitCircles() {
  //goes through visableCircle array and displays the circles while staying inside the play field
  if (Math.round(mapSong.currentTime() * 1000) > int(visableCircle[0].objectTime) + 120) {
    visableCircle.shift();
  } 

  for (let circle of visableCircle) {
    push();
    tint(comboColours.Combo4[0], comboColours.Combo4[1], comboColours.Combo4[2]);
    image(approachCircleImage, hitCircleLocation[circle.objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[circle.objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, 137 + (circle.objectTime - Math.round(mapSong.currentTime() * 1000)), 137 + (circle.objectTime - Math.round(mapSong.currentTime() * 1000)));
    image(hitCircleImage, hitCircleLocation[circle.objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[circle.objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY );
    pop();
    image(hitCircleOverlay, hitCircleLocation[circle.objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[circle.objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY);
  }
}

function judgementTimer() {
  if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 121 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -121 ) {
    hitJudgment.push(hitCircleLocation[visableCircle[0].objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, "miss");
    console.log(int(hitCircleLocation[visableCircle[0].objectLocation][0] * 2) + HIT_CIRCLE_BOUNDRY, hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, "100");
    visableCircle.shift();
  }
  else if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 120 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -120 ) {
    hitJudgment.push(hitCircleLocation[visableCircle[0].objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, "50");
    visableCircle.shift();
  }
  else if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 76 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -76 ) {
    hitJudgment.push(int(hitCircleLocation[visableCircle[0].objectLocation][0] * 2) + HIT_CIRCLE_BOUNDRY, hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, "100");
    console.log(int(hitCircleLocation[visableCircle[0].objectLocation][0] * 2) + HIT_CIRCLE_BOUNDRY, hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, "100");
    visableCircle.shift();
  }
  else if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 16 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -16 ) {
    console.log(int(hitCircleLocation[visableCircle[0].objectLocation][0] * 2) + HIT_CIRCLE_BOUNDRY, hitCircleLocation[visableCircle[0].objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, "100");
    visableCircle.shift();
  }
}

function showJudgment() {
  for (let judgements in hitJudgment) {
    // if (judgements[2] === "miss") {
    // }
    // if (judgements[2] === "50") {
    //   image(hit50Image, judgements[0], judgements[1]);
    // }
    // if (judgements[2] === "100") {
    //   image(hit100Image, judgements[0], judgements[1]);;
    // }
  }
}