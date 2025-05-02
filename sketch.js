//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

let mapInfo;

class MapData {
  constructor() {
    this.apporachRate;
    this.circleSize;
    this.overallDifficulty;
    this.hpDrain;
    this.mapArray;
  }

  addData(infoPointer, data) {
    if (ApproachRate in data[infoPointer]) {
    }
  }
}

function preload() {
  hitCircleImage = loadImage("/hitcircles/hitcircle.png");
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
}

function loadMap(data) {
  for (let mapStats in data) {
    MapData.addData(mapStats, data);
  }
}