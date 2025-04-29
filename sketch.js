//https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
//https://osu.ppy.sh/wiki/en/Beatmap/Circle_size
//https://osu.ppy.sh/wiki/en/Beatmap/Approach_rate

let osuScaleY;
let osuScaleX;

function preload() {
  hitCircleImage = loadImage("/hitcircles/hitcircle.png");
  approachCircleImage = loadImage("/hitcircles/approachcircle.png");
}

function setup() {
  createCanvas(1024, 768);
  imageMode(CENTER);
}

function draw() {
  background(220);
  image(hitCircleImage, width/2, height/2);
  rect(0, 0, );
}
