//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

//show the hit judgment baised on frame cound as the animation will run for 60 frames and create and object to accomplish that

const HIT_CIRCLE_BOUNDRY = 64;
const CURSOR_PERCENTAGE = 0.85;
const MAX_TRAIL_COUNT = 5;

let soft;
let normal;
let drum;
let missTotal = 0;
let sixthTotal = 0;
let thirdTotal = 0;
let oneTotal = 0;
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
let comboColours = [[0, 202, 0], [18, 124, 255], [242, 24, 57], [255, 192, 0]];
let newCombo = 0;
let previousComboColour = 0;

// let accuracy = (totalOne, totalTwo, totalThree, totalMiss) => ((300 * totalOne + 100 * totalOne + 50 * totalOne) / (300 * (totalOne + totalThree + totalTwo + totalMiss))) * 100;
let clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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
  constructor(hitObject, time, comboColour) {
    this.objectLocation = hitObject;
    this.objectTime = time;
    this.comboColour = this.changeComboColour(comboColour);
    this.previousValue = this.comboColour;
  }

  changeComboColour(colourValue) {
    if (colourValue === 2 || colourValue === 4 || colourValue === 5 || colourValue === 6) {
      if (colourValue === 2) {
        previousComboColour = 0;
        return 0;
      }
      else if (colourValue === 4) {
        previousComboColour = 1;
        return 1;
      }
      else if (colourValue === 5) {
        previousComboColour = 2;
        return 2;
      }
      else if (colourValue === 6) {
        previousComboColour = 3;
        return 3;
      }
      
    }
    else {
      return previousComboColour;
    }
  }
}

function preload() {
  loadStrings("maps/GenryuuKaiko/higantorrent.osu", loadMap); 

  hitCircleImage = loadImage("skin/hitcircle.png");
  hitCircleOverlay = loadImage("skin/hitcircleoverlay.png");
  approachCircleImage = loadImage("skin/approachcircle.png");
  
  cursorImage = loadImage("skin/cursor.png");
  cursorTrailImage = loadImage("skin/cursortrail.png");

  hit100Image = loadImage("skin/hit100.png");
  hit50Image = loadImage("skin/hit50.png");
  hit0Image = loadImage("skin/hit0.png");
  
  soundFormats("mp3", "wav");
  mapSong = loadSound("maps/GenryuuKaiko/GennryuuKaiko.mp3");
  soft = loadSound("skin/soft-hitnormal.wav");
  drum = loadSound("skin/drum-hitfinish.wav");
  normal = loadSound("skin/normal-hitwhistle.wav");
}

function setup() {
  createCanvas(1158, 902);
  imageMode(CENTER);
  noCursor();
  smooth();
  rectMode(CENTER);
  outputVolume(0.03);
  setBPM(173);
}

function draw() {
  background(0);

  createHitCircles();
  if (visableCircle.length > 0) {  
    showHitCircles();
  }

  if (!mapSong.isPlaying()) {
    text("press enter to start and shift to pause", width/2, 500);
    text("press g or h to click on the circle when the smaller circle encloses it", width/2, 550);
  }

  updateCursor();
  fill("white");
  text("accruacy" + str(accuracy()) + "%", width-60, 60, 25, 25);
  text("300 " + oneTotal, width-60, 90, 25, 25);
  text("100 " + thirdTotal, width-60, 120, 25, 25);
  text("50 " + sixthTotal, width-60, 150, 25, 25);
  text("miss " + missTotal, width-60, 180, 25, 25);
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
    visableCircle.push(new VisableHitCircles(currentHitObject, hitCirclesTimeStamps[0], int(hitCircleLocation[currentHitObject][3])));
    currentHitObject++;
    hitCirclesTimeStamps.shift();
  }
}

function showHitCircles() {
  //goes through visableCircle array and displays the circles while staying inside the play field
  if (Math.round(mapSong.currentTime() * 1000) > int(visableCircle[0].objectTime) + 120) {
    missTotal++;
    visableCircle.shift();
  } 

  for (let circle of visableCircle) {
    push(); 
    if (visableCircle.length > 0) {
      tint(comboColours[circle.comboColour][0], comboColours[circle.comboColour][1], comboColours[circle.comboColour][2]);
    }
    else {
      tint(comboColours[previousComboColour][0], comboColours[previousComboColour][1], comboColours[previousComboColour][2]);
    }
    image(approachCircleImage, hitCircleLocation[circle.objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[circle.objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY, 137 + (circle.objectTime - Math.round(mapSong.currentTime() * 1000)), 137 + (circle.objectTime - Math.round(mapSong.currentTime() * 1000)));
    image(hitCircleImage, hitCircleLocation[circle.objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[circle.objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY );
    pop();  
    image(hitCircleOverlay, hitCircleLocation[circle.objectLocation][0] * 2 + HIT_CIRCLE_BOUNDRY, hitCircleLocation[circle.objectLocation][1] * 2 + HIT_CIRCLE_BOUNDRY);
  }
}

function judgementTimer() {
  if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 121 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -121 ) {
    visableCircle.shift();
    missTotal++;
    playHitsound();
  }
  else if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 120 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -120 ) {
    visableCircle.shift();
    sixthTotal++;
    playHitsound();
  }
  else if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 76 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -76 ) {    
    visableCircle.shift();
    thirdTotal++;
    playHitsound();
  }
  else if (Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) >= 16 || Math.round(visableCircle[0].objectTime - mapSong.currentTime() * 1000) <= -16 ) {
    visableCircle.shift();
    oneTotal++;
    playHitsound();
  }
}

function accuracy() {
  if (oneTotal + thirdTotal + sixthTotal  + missTotal === 0) {
    return 100;
  } 
  else {
  // eslint-disable-next-line no-extra-parens
    return ((300 * oneTotal + 100 * thirdTotal + 50 * sixthTotal) / (300 * (oneTotal + thirdTotal + sixthTotal  + missTotal))) * 100;
  }
}

function playHitsound() {
  if (visableCircle.length <=  2) {
    soft.play();
  }
  else if (visableCircle. length > 2) {
    drum.play();
  }
}