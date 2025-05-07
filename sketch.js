//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate



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
  hitCircleImage = loadImage("/hitcircles/hitcircle.png");
  hitCircleOverlay = loadImage("/hitcircles/hitcircleoverlay.png");
  approachCircleImage = loadImage("/hitcircles/approachcircle.png");
  loadStrings("/maps/GenryuuKaiko/higantorrent.osu", loadMap); 
}

function setup() {
  createCanvas(1024, 768);
  imageMode(CENTER);
}

function draw() {
  background(220);

  circle(mouseX, mouseY, 15);

  image(hitCircleImage, Number(hitCircleLocation[0][0]) * 2, Number(hitCircleLocation[0][1]) * 2);

  for (let hitCircleArrayPointer = 0; hitCircleArrayPointer < hitCircleLocation.length; hitCircleArrayPointer++) {
    image(hitCircleImage, Number(hitCircleLocation[hitCircleArrayPointer][0]) * 2, Number(hitCircleLocation[hitCircleArrayPointer][1]) * 2);
    image(hitCircleOverlay, hitCircleLocation[hitCircleArrayPointer][0] * 2, hitCircleLocation[hitCircleArrayPointer][1] * 2);
    console.log("image loaded");
  }
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
  hitCircleLocation.findHitCircleLocation(hitCircles);
}
