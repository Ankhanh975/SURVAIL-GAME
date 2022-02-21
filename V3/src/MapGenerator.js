 class MapGenerator{
     constructor(options) {
            	 this. width;
	 this. height;

	 this. seed;
	 this. useRandomSeed;

	 this. randomFillPercent;

	this.map = new Array(width,height);
        }


	 Start() {
		GenerateMap();
	}

	 update() {
		if (Input.GetMouseButtonDown(0)) {
			GenerateMap();
		}
	}

	 GenerateMap() {
		this.map = new Array(width,height);
		this.RandomFillMap();

		for (let i = 0; i < 5; i ++) {
			this.SmoothMap();
		}

		meshGen.GenerateMesh(map, 1);
	}


	 RandomFillMap() {
		if (useRandomSeed) {
			seed = Time.time.ToString();
		}

		System.Random pseudoRandom = new System.Random(seed.GetHashCode());

		for (let x = 0; x < width; x ++) {
			for (let y = 0; y < height; y ++) {
				if (x == 0 || x == width-1 || y == 0 || y == height -1) {
					map[x,y] = 1;
				}
				else {
					map[x,y] = (pseudoRandom.Next(0,100) < randomFillPercent)? 1: 0;
				}
			}
		}
	}

	 SmoothMap() {
		for (let x = 0; x < width; x ++) {
			for (let y = 0; y < height; y ++) {
				let neighbourWallTiles = GetSurroundingWallCount(x,y);

				if (neighbourWallTiles > 4)
					map[x,y] = 1;
				else if (neighbourWallTiles < 4)
					map[x,y] = 0;

			}
		}
	}

	 GetSurroundingWallCount(let gridX, let gridY) {
		let wallCount = 0;
		for (let neighbourX = gridX - 1; neighbourX <= gridX + 1; neighbourX ++) {
			for (let neighbourY = gridY - 1; neighbourY <= gridY + 1; neighbourY ++) {
				if (neighbourX >= 0 && neighbourX < width && neighbourY >= 0 && neighbourY < height) {
					if (neighbourX != gridX || neighbourY != gridY) {
						wallCount += map[neighbourX,neighbourY];
					}
				}
				else {
					wallCount ++;
				}
			}
		}

		return wallCount;
	}
}