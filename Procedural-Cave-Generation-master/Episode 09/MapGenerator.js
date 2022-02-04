// using UnityEngine;
// using System.Collections;
// using System.Collections.Generic;
// using System;

class MapGenerator extends MonoBehaviour {
  constructor() {
    this.width = null;
    this.height = null;

    this.seed = null;
    this.useRandomSeed = true;

    // [Range(0,100)]
    this.randomFillPercent = 50;

    this.map = [];
  }
  Start() {
    this.GenerateMap();
  }

  Update() {
    if (Input.GetMouseButtonDown(0)) {
      this.GenerateMap();
    }
  }

  GenerateMap() {
    this.map = new Array([(width, height)]);
    this.RandomFillMap();

    for (let i = 0; i < 5; i++) {
      this.SmoothMap();
    }

    this.ProcessMap();

    const borderSize = 1;
    let borderedMap = new Array(
      width + borderSize * 2,
      height + borderSize * 2
    );

    for (let x = 0; x < borderedMap.GetLength(0); x++) {
      for (let y = 0; y < borderedMap.GetLength(1); y++) {
        if (
          x >= borderSize &&
          x < width + borderSize &&
          y >= borderSize &&
          y < height + borderSize
        ) {
          borderedMap[x][y] = map[x - borderSize][y - borderSize];
        } else {
          borderedMap[x][y] = 1;
        }
      }
    }

    let meshGen = GetComponent(MeshGenerator);
    meshGen.GenerateMesh(borderedMap, 1);
  }

  ProcessMap() {
    let wallRegions = this.GetRegions(1);
    let wallThresholdSize = 50;

    for (const wallRegion of wallRegions) {
      if (wallRegion.Count < wallThresholdSize) {
        for (const tile of wallRegion) {
          this.map[(tile.tileX, tile.tileY)] = 0;
        }
      }
    }

    let roomRegions = this.GetRegions(0);
    let roomThresholdSize = 50;
    let survivingRooms = new Array();

    for (const roomRegion of roomRegions) {
      if (roomRegion.Count < roomThresholdSize) {
        for (const tile of roomRegion) {
          this.map[(tile.tileX, tile.tileY)] = 1;
        }
      } else {
        survivingRooms.Add(new Room(roomRegion, this.map));
      }
    }
    survivingRooms.Sort();
    survivingRooms[0].isMainRoom = true;
    survivingRooms[0].isAccessibleFromMainRoom = true;

    ConnectClosestRooms(survivingRooms);
  }

  ConnectClosestRooms(allRooms, forceAccessibilityFromMainRoom = false) {
    let roomListA = new Array();
    let roomListB = new Array();

    if (forceAccessibilityFromMainRoom) {
      for (const room of allRooms) {
        if (room.isAccessibleFromMainRoom) {
          roomListB.Add(room);
        } else {
          roomListA.Add(room);
        }
      }
    } else {
      roomListA = allRooms;
      roomListB = allRooms;
    }

    let bestDistance = 0;
    let bestTileA = new Coord();
    let bestTileB = new Coord();
    let bestRoomA = new Room();
    let bestRoomB = new Room();
    let possibleConnectionFound = false;

    for (const roomA of roomListA) {
      if (!forceAccessibilityFromMainRoom) {
        possibleConnectionFound = false;
        if (roomA.connectedRooms.Count > 0) {
          continue;
        }
      }

      for (const roomB of roomListB) {
        if (roomA == roomB || roomA.IsConnected(roomB)) {
          continue;
        }

        for (
          let tileIndexA = 0;
          tileIndexA < roomA.edgeTiles.Count;
          tileIndexA++
        ) {
          for (
            let tileIndexB = 0;
            tileIndexB < roomB.edgeTiles.Count;
            tileIndexB++
          ) {
            let tileA = roomA.edgeTiles[tileIndexA];
            let tileB = roomB.edgeTiles[tileIndexB];
            let distanceBetweenRooms = let(
              Math.Pow(tileA.tileX - tileB.tileX, 2) +
                Math.Pow(tileA.tileY - tileB.tileY, 2)
            );

            if (
              distanceBetweenRooms < bestDistance ||
              !possibleConnectionFound
            ) {
              bestDistance = distanceBetweenRooms;
              possibleConnectionFound = true;
              bestTileA = tileA;
              bestTileB = tileB;
              bestRoomA = roomA;
              bestRoomB = roomB;
            }
          }
        }
      }
      if (possibleConnectionFound && !forceAccessibilityFromMainRoom) {
        CreatePassage(bestRoomA, bestRoomB, bestTileA, bestTileB);
      }
    }

    if (possibleConnectionFound && forceAccessibilityFromMainRoom) {
      CreatePassage(bestRoomA, bestRoomB, bestTileA, bestTileB);
      ConnectClosestRooms(allRooms, true);
    }

    if (!forceAccessibilityFromMainRoom) {
      ConnectClosestRooms(allRooms, true);
    }
  }

  CreatePassage(roomA, roomB, tileA, tileB) {
    Room.ConnectRooms(roomA, roomB);
    //Debug.DrawLine (CoordToWorldPoint (tileA), CoordToWorldPoint (tileB), Color.green, 100);

    let line = GetLine(tileA, tileB);
    for (const c of line) {
      DrawCircle(c, 5);
    }
  }

  DrawCircle(c, r) {
    for (let x = -r; x <= r; x++) {
      for (let y = -r; y <= r; y++) {
        if (x * x + y * y <= r * r) {
          let drawX = c.tileX + x;
          let drawY = c.tileY + y;
          if (this.IsInMapRange(drawX, drawY)) {
            this.map[(drawX, drawY)] = 0;
          }
        }
      }
    }
  }

  GetLine(from, to) {
    const line = new Array();

    let x = from.tileX;
    let y = from.tileY;

    let dx = to.tileX - from.tileX;
    let dy = to.tileY - from.tileY;

    let inverted = false;
    let step = Math.Sign(dx);
    let gradientStep = Math.Sign(dy);

    let longest = Math.Abs(dx);
    let shortest = Math.Abs(dy);

    if (longest < shortest) {
      inverted = true;
      longest = Math.Abs(dy);
      shortest = Math.Abs(dx);

      step = Math.Sign(dy);
      gradientStep = Math.Sign(dx);
    }

    let gradientAccumulation = longest / 2;
    for (let i = 0; i < longest; i++) {
      line.Add(new Coord(x, y));

      if (inverted) {
        y += step;
      } else {
        x += step;
      }

      gradientAccumulation += shortest;
      if (gradientAccumulation >= longest) {
        if (inverted) {
          x += gradientStep;
        } else {
          y += gradientStep;
        }
        gradientAccumulation -= longest;
      }
    }

    return line;
  }

  CoordToWorldPoint(tile) {
    return new Vector3(
      -width / 2 + 0.5 + tile.tileX,
      2,
      -height / 2 + 0.5 + tile.tileY
    );
  }

  GetRegions(tileType) {
    let regions = new Array();
    let mapFlags = new let[(width, height)]();

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (mapFlags[(x, y)] == 0 && this.map[(x, y)] == tileType) {
          let newRegion = GetRegionTiles(x, y);
          regions.Add(newRegion);

          for (const tile in newRegion) {
            mapFlags[(tile.tileX, tile.tileY)] = 1;
          }
        }
      }
    }

    return regions;
  }

  GetRegionTiles(startX, startY) {
    let tiles = new Array();
    let mapFlags = new Array[(width, height)]();
    let tileType = this.map[(startX, startY)];

    let queue = new Queue();
    queue.Enqueue(new Coord(startX, startY));
    mapFlags[(startX, startY)] = 1;

    while (queue.Count > 0) {
      let tile = queue.Dequeue();
      tiles.Add(tile);

      for (let x = tile.tileX - 1; x <= tile.tileX + 1; x++) {
        for (let y = tile.tileY - 1; y <= tile.tileY + 1; y++) {
          if (this.IsInMapRange(x, y) && (y == tile.tileY || x == tile.tileX)) {
            if (mapFlags[(x, y)] == 0 && this.map[(x, y)] == tileType) {
              mapFlags[(x, y)] = 1;
              queue.Enqueue(new Coord(x, y));
            }
          }
        }
      }
    }
    return tiles;
  }

  IsInMapRange(x, y) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  RandomFillMap() {
    if (useRandomSeed) {
      seed = Time.time.ToString();
    }

    let pseudoRandom = new System.Random(seed.GetHashCode());

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
          this.map[(x, y)] = 1;
        } else {
          this.map[(x, y)] =
            pseudoRandom.Next(0, 100) < randomFillPercent ? 1 : 0;
        }
      }
    }
  }

  SmoothMap() {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let neighbourWallTiles = this.GetSurroundingWallCount(x, y);

        if (neighbourWallTiles > 4) this.map[(x, y)] = 1;
        else if (neighbourWallTiles < 4) this.map[(x, y)] = 0;
      }
    }
  }

  GetSurroundingWallCount(gridX, gridY) {
    let wallCount = 0;
    for (let neighbourX = gridX - 1; neighbourX <= gridX + 1; neighbourX++) {
      for (let neighbourY = gridY - 1; neighbourY <= gridY + 1; neighbourY++) {
        if (this.IsInMapRange(neighbourX, neighbourY)) {
          if (neighbourX != gridX || neighbourY != gridY) {
            wallCount += this.map[(neighbourX, neighbourY)];
          }
        } else {
          wallCount++;
        }
      }
    }

    return wallCount;
  }
}
class Coord {
  constructor(x, y) {
    this.tileX = x;
    this.tileY = y;
  }
}

class Room extends IComparable {
  constructor(roomTiles, map) {
    this.tiles = null;
    this.edgeTiles = null;
    this.connectedRooms = null;
    this.roomSize = null;
    this.isAccessibleFromMainRoom = false;
    this.isMainRoom = false;

    tiles = roomTiles;
    roomSize = tiles.Count;
    connectedRooms = new Array();
    edgeTiles = new Array();
    for (const tile in tiles) {
      for (let x = tile.tileX - 1; x <= tile.tileX + 1; x++) {
        for (let y = tile.tileY - 1; y <= tile.tileY + 1; y++) {
          if (x == tile.tileX || y == tile.tileY) {
            if (map[(x, y)] == 1) {
              edgeTiles.Add(tile);
            }
          }
        }
      }
    }
  }

  SetAccessibleFromMainRoom() {
    if (!this.isAccessibleFromMainRoom) {
      this.isAccessibleFromMainRoom = true;
      for (const connectedRoom of connectedRooms) {
        connectedRoom.SetAccessibleFromMainRoom();
      }
    }
  }

  static ConnectRooms(roomA, roomB) {
    if (roomA.isAccessibleFromMainRoom) {
      roomB.SetAccessibleFromMainRoom();
    } else if (roomB.isAccessibleFromMainRoom) {
      roomA.SetAccessibleFromMainRoom();
    }
    roomA.connectedRooms.Add(roomB);
    roomB.connectedRooms.Add(roomA);
  }

  IsConnected(otherRoom) {
    return this.connectedRooms.Contains(otherRoom);
  }

  CompareTo(otherRoom) {
    return otherRoom.roomSize.CompareTo(roomSize);
  }
}
