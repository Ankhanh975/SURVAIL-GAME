class Obstacle {
  constructor(settings) {
    //  pos, parent, lifeTime = true
    // parent: the Obstacles object this Obstacle belongs to
    this.size = 51.9;

    this.pos = createVector(0, 0);
    this.pos.x = settings.pos.x;
    this.pos.y = settings.pos.y;
    this.pos.x += this.size / 2;
    this.pos.y += this.size / 2;

    this.circle = collisions.createPolygon({ x: this.pos.x, y: this.pos.y }, [
      { x: 0 - this.size / 2, y: 0 - this.size / 2 },
      { x: 0 - this.size / 2, y: this.size - this.size / 2 },
      { x: this.size - this.size / 2, y: this.size - this.size / 2 },
      { x: this.size - this.size / 2, y: 0 - this.size / 2 },
    ]);
    // Debugging
    // this.circle.normals[0].x = 1;
    // this.circle.normals[0].y = 0;
    // this.circle.normals[1].x = 1;
    // this.circle.normals[1].y = 0;
    // this.circle.normals[2].x = 1;
    // this.circle.normals[2].y = 0;
    // this.circle.normals[3].x = 1;
    // this.circle.normals[3].y = 0;

    // this.circle.isStatic = true;
    this.circle.parent = this;
    this.color = settings.color || [220, 220, 10, 200];
    this.parent = settings.parent || throwError("Invalid parent");
    this.life = settings.life || 60 * 16; //(frame)
    this.surface =
      this.parent.obstacles_surface || throwError("Invalid image surface");
    this.customCollisionHandler = false;
    if (settings.lifeTime) {
      setTimeout(() => {
        // Remove the obstacle from the world
        const index = obstacles.obstacles.indexOf(this);
        if (index > -1) {
          obstacles.obstacles.splice(index, 1);
        }

        collisions.remove(this.circle);
        let gridPos = obstacles.grid.WorldCoordsToGridCoords(
          this.pos.x,
          this.pos.y
        );

        obstacles.grid.set(gridPos[0], gridPos[1], false);
      }, 18 * 1000);
    }
    if (settings.lifeTime) {
      setTimeout(() => {
        this.surface = this.parent.obstacles_surface2;
      }, 17.1 * 1000);
    }

    // anime({
    //   targets: this,
    //   translateX: 270,
    //   size: 51.9,
    // });
  }
  setPos(pos) {
    this.pos = pos;
    // this.circle.pos.x = this.pos.x;
    // this.circle.pos.y = this.pos.y;
    this.circle.setPosition(this.pos.x, this.pos.y);
  }
  setNormal(vec) {
    if (vec) {
      this.customCollisionHandler = true;
      this.circle.normals[0].x = vec.x;
      this.circle.normals[0].y = vec.y;
    }
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    // translate(this.size / 2, this.size / 2);

    image(this.surface, 0, 0);
    // strokeWeight(1.5);
    // stroke(0, 0, 0);
    // fill(...this.color);
    // rect(0, 0, this.size, this.size, 3.5);
    pop();
  }
  update() {
    // this.life -= 1;
    // if (this.life <= 0) {
    // }
  }
  getHit() {}
}
class Obstacle2 {
  constructor(x, y, state) {
    this.centerX = x;
    this.centerY = y;
    this.state = state;
    this.size = 75;
    this.circle = [];
    this.points = [];

    this.init();
    this.#initCollisions();
  }
  init() {
    const size = this.size;
    {
      this.topRight = [size, size];
      this.bottomLeft = [0, 0];
      this.centreLeft = [size / 2, 0];

      this.topLeft = [size, 0];
      this.centreTop = [size, size / 2];
      this.centreRight = [size / 2, size];

      this.bottomRight = [0, size];
      this.centreBottom = [0, size / 2];
    }
    {
      this.topRight[0] -= size / 2;
      this.bottomLeft[0] -= size / 2;
      this.centreLeft[0] -= size / 2;
      this.topLeft[0] -= size / 2;
      this.centreTop[0] -= size / 2;
      this.centreRight[0] -= size / 2;
      this.bottomRight[0] -= size / 2;
      this.centreBottom[0] -= size / 2;

      this.topRight[1] -= size / 2;
      this.bottomLeft[1] -= size / 2;
      this.centreLeft[1] -= size / 2;
      this.topLeft[1] -= size / 2;
      this.centreTop[1] -= size / 2;
      this.centreRight[1] -= size / 2;
      this.bottomRight[1] -= size / 2;
      this.centreBottom[1] -= size / 2;
    }
    {
      this.topRight[0] += this.centerX;
      this.bottomLeft[0] += this.centerX;
      this.centreLeft[0] += this.centerX;
      this.topLeft[0] += this.centerX;
      this.centreTop[0] += this.centerX;
      this.centreRight[0] += this.centerX;
      this.bottomRight[0] += this.centerX;
      this.centreBottom[0] += this.centerX;

      this.topRight[1] += this.centerY;
      this.bottomLeft[1] += this.centerY;
      this.centreLeft[1] += this.centerY;
      this.topLeft[1] += this.centerY;
      this.centreTop[1] += this.centerY;
      this.centreRight[1] += this.centerY;
      this.bottomRight[1] += this.centerY;
      this.centreBottom[1] += this.centerY;
    }

    const p0 = this.topRight;
    const p1 = this.bottomLeft;
    const p2 = this.centreLeft;
    const p3 = this.topLeft;
    const p4 = this.centreTop;
    const p5 = this.centreRight;
    const p6 = this.bottomRight;
    const p7 = this.centreBottom;
    switch (this.state) {
      case 0:
        break;
      case 1:
        this.points = [p7, p1, p2];
        break;
      case 2:
        this.points = [p5, p6, p7];
        break;
      case 4:
        this.points = [p4, p0, p5];
        break;
      case 8:
        this.points = [p3, p4, p2];
        break;
      case 3:
        this.points = [p5, p6, p1, p2];
        break;
      case 6:
        this.points = [p4, p0, p6, p7];
        break;
      case 9:
        this.points = [p3, p4, p7, p1];
        break;
      case 12:
        this.points = [p3, p0, p5, p2];
        break;
      case 5:
        this.points = [p4, p0, p5, p7, p1, p2];
        break;
      case 10:
        this.points = [p3, p4, p5, p6, p7, p2];
        break;
      case 7:
        this.points = [p4, p0, p6, p1, p2];
        break;
      case 11:
        this.points = [p3, p4, p5, p6, p1];
        break;
      case 13:
        this.points = [p3, p0, p5, p7, p1];
        break;
      case 14:
        this.points = [p3, p0, p6, p7, p2];
        break;
      case 15:
        this.points = [p3, p0, p6, p1];
        break;
    }
  }
  #createTriangle(a, b, c) {
    // const circle = collisions.createPolygon({ x: a[0], y: a[1] }, [
    //   { x: 0, y: 0 },
    //   { x: b[0], y: b[1] },
    //   { x: c[0], y: c[1] },
    // ]);
    const circle = collisions.createPolygon({ x: a[0], y: a[1] }, [
      { x: 0, y: 0 },
      { x: b[0] - a[0], y: b[1] - a[1] },
      { x: c[0] - a[0], y: c[1] - a[1] },
    ]);
    circle.parent = this;
    collisions.updateBody(circle);
    this.circle.push(circle);
    return circle;
  }
  #initCollisions() {
    const points = this.points;

    if (points.length >= 3) {
      this.#createTriangle(points[0], points[1], points[2]);
    }
    if (points.length >= 4) {
      this.#createTriangle(points[0], points[2], points[3]);
    }
    if (points.length >= 5) {
      this.#createTriangle(points[0], points[3], points[4]);
    }
    if (points.length >= 6) {
      this.#createTriangle(points[0], points[4], points[5]);
    }
  }
  #drawTriangle() {
    const points = this.points;
    if (points.length >= 3) {
      triangle(...points[0], ...points[1], ...points[2]);
    }
    if (points.length >= 4) {
      triangle(...points[0], ...points[2], ...points[3]);
    }
    if (points.length >= 5) {
      triangle(...points[0], ...points[3], ...points[4]);
    }
    if (points.length >= 6) {
      triangle(...points[0], ...points[4], ...points[5]);
    }
  }
  draw() {
    push();
    strokeWeight(1.5);
    stroke(0, 0, 0, 240);
    fill([220, 220, 10, 220]);

    this.#drawTriangle();
    pop();
  }
}
