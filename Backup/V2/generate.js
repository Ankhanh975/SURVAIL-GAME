class GenerateName {
  constructor() {
    this.last = null;
    this.NAMES = [
      "scoutz",
      "dezior",
      "pinch",
      "Goku",
      "gasp",
      "flucket",
      "canon",
      "nabbey9",
      "twister",
      "phrase",
      "crumbles",
      "nettle",
      "carol433",
      "scunken1",
      "wooler",
      "cake",
      "astute7",
      "hairs33",
      "slabz",
      "gases4",
      "scripts",
      "tevict",
      "BadGameDev",
      "nunchy",
      "wink__",
      "foil",
      "pointy",
      "creamy",
      "petchd",
      "floatn",
      "alwaythe0",
      "banshee0",
      "flock",
      "legend78",
      "overdue",
      "trooper",
      "scoutz",
      "consist",
      "graves_",
      "grapes",
      "consist",
      "almost",
      "mop",
      "unclasp11",
      "filled",
      "cashewsR",
      "bubblez",
      "raccon5",
      "basics_j",
      "baa3",
      "peevish66",
      "rehire3",
      "slicchty",
      "scalbyT2",
      "_stove_",
      "blaming",
      "scale1",
      "sombler",
      "lived_",
      "interest4",
      "griefd",
    ];
  }
  __call() {
    return this.NAMES[int(random(0, this.NAMES.length))];
  }
}
let generateName = new GenerateName()