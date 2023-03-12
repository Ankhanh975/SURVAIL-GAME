component.placeObstacle = class {
  // DONE: Add continuous handling for box placement (before when fast movement is may miss )
  // DONE: check to fill isInIsolate part of the world
  constructor() {
    this.mousePos = createVector(0, 0);
    this.mouseDown = false;
    this.mousePosHistory = [];
    this.to_fill = [];
    this.getRealPos = (x, y) => {
      x = x - width / 2 + this.parent.pos.x;
      y = y - height / 2 + this.parent.pos.y;
      return { x: x, y: y };
    };
  }
  update = () => {
    // Fill all positions from current mouse position and last mouse position
    // console.log(this.mouseDown, this.mousePos);
    // console.log(this.to_fill.length);
    let solve = 0;
    if (this.to_fill.length > 100) {
      // Emergecy patch if necessary
      this.to_fill = [];
    }
    for (let i = 0; i < this.to_fill.length; i++) {
      if (solve >= 2) {
        break;
      }
      let pos = this.to_fill.shift();
      // console.log(pos);
      let ob = obstacles.createObstacle({
        x: obstacles.grid.GridCoordsToWorldCoords(...pos)[0],
        y: obstacles.grid.GridCoordsToWorldCoords(...pos)[1],
      });
      if (ob) {
        solve += 1;
        if (obstacles.grid.get(pos[0] - 1, pos[1]) === false) {
          this.to_fill.push([pos[0] - 1, pos[1]]);
        }
        if (obstacles.grid.get(pos[0], pos[1] - 1) === false) {
          this.to_fill.push([pos[0], pos[1] - 1]);
        }
        if (obstacles.grid.get(pos[0], pos[1] + 1) === false) {
          this.to_fill.push([pos[0], pos[1] + 1]);
        }
        if (obstacles.grid.get(pos[0] + 1, pos[1]) === false) {
          this.to_fill.push([pos[0] + 1, pos[1]]);
        }
      }
    }

    if (!this.mouseDown) {
      return;
    }
    let path;

    if (this.mousePosHistory.length === 1) {
      path = [this.mousePosHistory[0]];
    } else if (this.mousePosHistory.length >= 2) {
      path = lineBresenham_1(
        this.mousePosHistory[this.mousePosHistory.length - 1].x,
        this.mousePosHistory[this.mousePosHistory.length - 1].y,
        this.mousePosHistory[this.mousePosHistory.length - 2].x,
        this.mousePosHistory[this.mousePosHistory.length - 2].y
      );
      path = path.map((each) => {
        each = { x: each[0], y: each[1] };
        return each;
      });
    }
    sparks.create_particle(this.mousePos, [9, 200, 9]);

    path.forEach((point) => {
      const ob = obstacles.createObstacle(point);
      if (!ob) {
        return;
      }
      const ob_pos = obstacles.grid.WorldCoordsToGridCoords(ob.pos.x, ob.pos.y);
      setTimeout(() => {
        if (obstacles.grid.isInIsolate(ob_pos[0] - 1, ob_pos[1] - 1)) {
          this.to_fill.push([ob_pos[0] - 1, ob_pos[1] - 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] - 1, ob_pos[1])) {
          this.to_fill.push([ob_pos[0] - 1, ob_pos[1]]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] - 1, ob_pos[1] + 1)) {
          this.to_fill.push([ob_pos[0] - 1, ob_pos[1] + 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0], ob_pos[1] - 1)) {
          this.to_fill.push([ob_pos[0], ob_pos[1] - 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0], ob_pos[1] + 1)) {
          this.to_fill.push([ob_pos[0], ob_pos[1] + 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] + 1, ob_pos[1] - 1)) {
          this.to_fill.push([ob_pos[0] + 1, ob_pos[1] - 1]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] + 1, ob_pos[1])) {
          this.to_fill.push([ob_pos[0] + 1, ob_pos[1]]);
        } else if (obstacles.grid.isInIsolate(ob_pos[0] + 1, ob_pos[1] + 1)) {
          this.to_fill.push([ob_pos[0] + 1, ob_pos[1] + 1]);
        }
      }, 20);
    });
  };
};
