class Ground {
  // Set background base on player position
  constructor(img) {
    this.img = img;
  }
  draw(playerPos, offset = [0, 0]) {
    this.size = [this.img[0].width, this.img[0].height];
    playerPos = [round(playerPos[0]), round(playerPos[1])];
    print("this.size", this.size, playerPos);
    for (let x = playerPos[0]; x < playerPos[0] + 6; x++) {
      for (let y = playerPos[1]; y < playerPos[1] + 6; y++) {
        let x1 = x * this.size[0];
        let y1 = y * this.size[1];
        // img = random.choice(this.img)
        // let img = this.img[round (random(0,this.img.length ))];
        let img = this.img[0];
        image(img, x1, y1);
      }
    }
  }
}
