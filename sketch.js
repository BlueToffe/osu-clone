//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate



let apporachRate;
let mapDifficuty;
let comboColours =  {
  Combo1: [184, 213, 255],
  Combo2: [231, 189, 255],
  Combo3: [199, 240, 255],
  Combo4: [255, 194, 255],
};

class hitCircleInfo {
  constructor() {
    this.objectString;
  }
  // use split to section off the array into its part the from there wer will be assiging a pointer to object x and y
  
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
  image(hitCircleImage, width/2, height/2);
  image(hitCircleOverlay, width/2, height/2);
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
}
