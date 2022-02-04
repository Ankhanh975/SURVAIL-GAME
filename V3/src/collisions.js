class Collisions2 extends Collisions {
  constructor() {
    super();
  }
  update() {
    super.update();
  }
  getNear(player, range = 1000) {
    const circle = player.circle;
    // Get near object next to this pos
    let near = this._getNeighbors({
      minX: circle.minX - range,
      minY: circle.minY - range,
      maxX: circle.maxX + range,
      maxY: circle.maxY + range,
    });
    near = near.map((neighbor) => neighbor.parent);
    near = near.filter((neighbor) => player.pos.dist(neighbor.pos) < range);

    return near;
  }
  _getNeighbors(AABB) {
    // Get all potentials objects overlap with this rectangle.
    // Speed is O(log N)
    function collideBox(RectA, RectB) {
      return collideRectRect(
        RectA.minX,
        RectA.minY,
        RectA.maxX - RectA.minX,
        RectA.maxY - RectA.minY,
        RectB.minX,
        RectB.minY,
        RectB.maxX - RectB.minX,
        RectB.maxY - RectB.minY
      );
      if (
        RectA.minX < RectB.maxX &&
        RectA.maxX > RectB.minX &&
        RectA.minY < RectB.maxY &&
        RectA.maxY > RectB.minY
      ) {
        return true;
      } else {
        return false;
      }
    }
    let queue = [this.data];
    let overlap = [];
    while (queue.length > 0) {
      const box = queue.shift();
      // console.log(box);
      if (box.children) {
        if (collideBox(box, AABB)) {
          queue.push(...box.children);
        }
      } else {
        overlap.push(box);
      }
    }
    return overlap;
    const o = { minX: -1000, minY: -1000, maxX: 1000, maxY: 1000 };
  }

  getNeighbors(AABB) {
    // Debugging
    // setTimeout(() => {
    //   noLoop();
    // }, 4000);

    function collideRectPoly2(AABB, polygon) {
      // polygon is a object create with collision.createPolygon()
      // collideRectPoly() not work when polygon is completely contained within AABB
      function isInside(x1, y1, w1, h1, x2, y2, w2, h2) {
        // If rect1 is isInside rect2
        // https://stackoverflow.com/questions/27768039/find-out-if-a-rectangle-is-inside-another-rectangle-c

        if (x2 + w2 < x1 + w1 && x2 > x1 && y2 > y1 && y2 + h2 < y1 + h1) {
          return true;
        } else {
          return false;
        }
      }
      if (
        isInside(
          AABB.minX,
          AABB.minY,
          AABB.maxX - AABB.minX,
          AABB.maxY - AABB.minY,
          polygon.minX,
          polygon.minY,
          polygon.maxX - polygon.minX,
          polygon.maxY - polygon.minY
        )
      ) {
        return true;
      }
      const collided = collideRectPoly(
        AABB.minX,
        AABB.minY,
        AABB.maxX - AABB.minX,
        AABB.maxY - AABB.minY,
        polygon.points.map((point) =>
          createVector(point.x + polygon.pos.x, point.y + polygon.pos.y)
        )
        // .reverse()
      );
      return collided;
    }

    // Get all objects overlap with this rectangle.
    let near = this._getNeighbors(AABB);
    // Debugging
    // console.log(near);
    near = near.filter((neighbor) => {
      if (neighbor.type === "Polygon") {
        return collideRectPoly2(AABB, neighbor);
        console.log(
          AABB,
          neighbor,
          neighbor.pos.x,
          neighbor.pos.y,
          neighbor.r,
          neighbor.points.map((point) =>
            createVector(point.x + neighbor.pos.x, point.y + neighbor.pos.y)
          )
          // .reverse()
        );
        console.log(
          collideRectPoly(
            AABB.minX,
            AABB.minY,
            AABB.maxX - AABB.minX,
            AABB.maxY - AABB.minY,
            neighbor.points.map((point) =>
              createVector(point.x + neighbor.pos.x, point.y + neighbor.pos.y)
            )
            // .reverse()
          )
        );
        return collideRectPoly(
          AABB.minX,
          AABB.minY,
          AABB.maxX - AABB.minX,
          AABB.maxY - AABB.minY,
          neighbor.points
            .map((point) =>
              createVector(point.x + neighbor.pos.x, point.y + neighbor.pos.y)
            )
            .reverse()
        );
      } else if (neighbor.type === "Circle") {
        // console.log(
        //   "neighbor.type === Circle",
        //   AABB.minX,
        //   AABB.minY,
        //   AABB.maxX - AABB.minX,
        //   AABB.maxY - AABB.minY,
        //   neighbor.pos.x,
        //   neighbor.pos.y,
        //   neighbor.r
        // );
        const collided = collideRectCircle(
          AABB.minX,
          AABB.minY,
          AABB.maxX - AABB.minX,
          AABB.maxY - AABB.minY,
          neighbor.pos.x,
          neighbor.pos.y,
          neighbor.r
        );
        return collided;
      } else {
        throw new Error("Unknown type of neighbor: " + neighbor.type);
      }
    });
    // Debugging
    // console.log(near);

    return near;
  }

  isFreeLine(startPos, endPos, setting) {
    const all = this.rayCast(...arguments);
    // console.log(all, all.length === 0);
    return all.length === 0;
  }
  rayCast(startPos, endPos, setting) {
    function swap(a, b) {
      return [b, a];
    }
    setting = setting = setting || {};
    const ignore = setting.ignore || [];
    const type = setting.type;

    // console.log(startPos.x, startPos.y, endPos.x, endPos.y);
    {
      // Debugging
      // let near = this.getNeighbors({
      let near = this._getNeighbors({
        minX: min(startPos.x, endPos.x),
        minY: min(startPos.y, endPos.y),
        maxX: max(startPos.x, endPos.x),
        maxY: max(startPos.y, endPos.y),
      });
      // console.log(near);

      near = near.filter((neighbor) => {
        if (neighbor.type === "Polygon") {
          // console.log(
          //   neighbor.points,
          //   neighbor.points.map((point) =>
          //     createVector(point.x + neighbor.pos.x, point.y + neighbor.pos.y)
          //   )
          // );
          const collided = collideLinePoly(
            startPos.x,
            startPos.y,
            endPos.x,
            endPos.y,
            neighbor.points
              .map((point) =>
                createVector(point.x + neighbor.pos.x, point.y + neighbor.pos.y)
              )
              .reverse()
          );
          return collided;
        } else if (neighbor.type === "Circle") {
          return collideLineCircle(
            startPos.x,
            startPos.y,
            endPos.x,
            endPos.y,
            neighbor.pos.x,
            neighbor.pos.y,
            neighbor.r
          );
        } else {
          throw new Error("Unknown type of neighbor: " + neighbor.type);
        }
      });
      // console.log(near);
      near = near.filter((neighbor) => !ignore.includes(neighbor));
      // console.log(near);
      return near;
    }
    return true;

    {
      // this.line = this.createPolygon({ x: startPos.x, y: startPos.y }, [
      // { x: 0, y: 0 },
      // { x: endPos.x - startPos.x, y: endPos.y - startPos.y },
      // ]);

      // this.line.setPoints([
      // { x: 0, y: 0 },
      // { x: endPos.x - startPos.x, y: endPos.y - startPos.y },
      // ]);
      this.line.setPosition(startPos.x, startPos.y);

      this.updateBody(this.line);
      const potentials = this.getPotentials(this.line);
      const collided = potentials.some((body) => {
        for (const each of ignore) {
          if (body === each) {
            return false;
          }
        }
        if (type) {
          if (!(body.parent instanceof Obstacle)) {
            return false;
          }
        }
        // for (const each of type) {
        // if (body.parent instanceof each) {
        // return false;
        // }
        // }
        // console.log(body);

        if (this.checkCollision(this.line, body)) {
          // console.log("Collision detected", body);
          return true;
        }
      });
      // this.remove(this.line);
      return !collided;
    }
  }
  getPunchAble(p) {
    //   From p to anther close player
    let all = [];
    let angle = p.getAngle();
    angle = createVector(0, -1).rotate(angle).rotate(-radians(90)).heading();
    // console.log(angle, degrees(angle));

    const collider = this.createPolygon({ x: p.pos.x, y: p.pos.y }, [
      { x: -152, y: 310 },
      { x: 152, y: 310 },
      { x: -0, y: -10 },
    ]);

    collider.rotate(angle);
    this.updateBody(collider);
    this.checkOne(collider, (response) => {
      const b = response.b.parent;
      if (b !== p && b instanceof Player) {
        if (
          this.isFreeLine(b.pos, p.pos, {
            ignore: [p.circle, b.circle, collider],
          })
        ) {
          all.push(b);
        }
      }
    });
    this.remove(collider);
    // console.log("getPunchAble", all);
    return all;
  }
  isFreeSlot(entity, newPos) {
    // Check if entity place in new position is in possible slot
    // entity = entity.circle;
    newPos = newPos || entity;

    const oldPos = [entity.x, entity.y];
    entity.setPosition(newPos.x, newPos.y);

    const potentials = this.getPotentials(entity);
    const collided = potentials.some((body) => {
      if (this.checkCollision(entity, body)) {
        return true;
      }
    });
    entity.setPosition(...oldPos);
    console.log(entity, collided);
    return !collided;
  }
}

let collisions = new Collisions2();
console.log(collisions);
