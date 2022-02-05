class Collisions2 extends Collisions {
  constructor() {
    super();
  }
  update() {
    super.update();
  }
  // TODO: dont use call back
  getNear(point, options, callback) {
    // Very similar to this,getNeighbors but faster since we don't' run polygon to polygon collision detection
    const rangeX = options.rangeX || 1000;
    const rangeY = options.rangeY || 1000;
    const guaranteed = options.guaranteed || true;

    // Get near object next to this pos
    this._getNeighbors(
      {
        minX: point.x - rangeX,
        minY: point.y - rangeY,
        maxX: point.x + rangeX,
        maxY: point.y + rangeY,
      },
      (neighbor) => {
        if (guaranteed) {
          if (
            point.x - neighbor.pos.x > rangeX ||
            neighbor.pos.x - point.x > rangeX ||
            point.y - neighbor.pos.y > rangeY ||
            neighbor.pos.y - point.y > rangeY
          ) {
            return false;
          }
        }
        callback(neighbor);
      }
    );
    // near = near.map((neighbor) => neighbor.parent);
  }
  #collideBox(RectA, RectB) {
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
  }
  #isInside(x1, y1, w1, h1, x2, y2, w2, h2) {
    // If rect1 is isInside rect2
    // https://stackoverflow.com/questions/27768039/find-out-if-a-rectangle-is-inside-another-rectangle-c

    if (x2 + w2 < x1 + w1 && x2 > x1 && y2 > y1 && y2 + h2 < y1 + h1) {
      return true;
    } else {
      return false;
    }
  }
  #collideRectPoly(AABB, polygon) {
    // polygon is a object create with collision.createPolygon()
    // collideRectPoly() not work when polygon is completely contained within AABB
    if (
      this.#isInside(
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
      polygon.points.map((point) => {
        return { x: point.x + polygon.pos.x, y: point.y + polygon.pos.y };
      })
      // .reverse()
    );
    return collided;
  }
  #AABBFOfLine(startPos, endPos) {
    return {
      minX: min(startPos.x, endPos.x),
      minY: min(startPos.y, endPos.y),
      maxX: max(startPos.x, endPos.x),
      maxY: max(startPos.y, endPos.y),
    };
  }
  #collideLinePoly(startPos, endPos, polygon) {
    const collided = collideLinePoly(
      startPos.x - polygon.pos.x,
      startPos.y - polygon.pos.x,
      endPos.x - polygon.pos.x,
      endPos.y - polygon.pos.x,
      polygon.points.map((point) => {
        return {
          x: point.x,
          y: point.y,
        };
      })
    );

    return collided;
  }
  _getNeighbors(AABB, callback) {
    // Get all potentials objects overlap with this rectangle.
    // Speed is O(log N)

    let queue = [this.data];
    while (queue.length > 0) {
      const box = queue.shift();
      // console.log(box);
      if (box.height >= 2) {
        if (this.#collideBox(box, AABB)) {
          queue.push(...box.children);
        }
      } else {
        box.children.forEach((each) => {
          if (this.#collideBox(each, AABB)) {
            // box is a object like player.circle
            const v = callback(each);
            if (v === true) {
              return v;
            }
          }
        });
      }
    }

    // const o = { minX: -1000, minY: -1000, maxX: 1000, maxY: 1000 };
  }
  getNeighbors(AABB) {
    let all = [];
    // Get all objects overlap with this rectangle.
    this._getNeighbors(AABB, (neighbor) => {
      if (neighbor.type === "Polygon") {
        if (!this.#collideRectPoly(AABB, neighbor)) {
          return false;
        }
      } else if (neighbor.type === "Circle") {
        const collided = collideRectCircle(
          AABB.minX,
          AABB.minY,
          AABB.maxX - AABB.minX,
          AABB.maxY - AABB.minY,
          neighbor.pos.x,
          neighbor.pos.y,
          neighbor.r
        );
        if (!collided) {
          return false;
        }
      } else {
        throw new Error("Unknown type of neighbor: " + neighbor.type);
      }
      all.push(neighbor);
      return true;
    });
    return all;
  }
  isFreeLine(startPos, endPos, setting) {
    setting = setting || {};
    const ignore = setting.ignore || [];
    const type = setting.type;
    let isFree = true;
    this._getNeighbors(
      this.#AABBFOfLine(startPos, endPos),

      (neighbor) => {
        if (neighbor.type === "Polygon") {
          const collided = this.#collideLinePoly(startPos, endPos, neighbor);
          if (!collided) {
            return false;
          }
        } else if (neighbor.type === "Circle") {
          const collided = collideLineCircle(
            startPos.x,
            startPos.y,
            endPos.x,
            endPos.y,
            neighbor.pos.x,
            neighbor.pos.y,
            neighbor.r
          );
          if (!collided) {
            return false;
          }
        } else {
          throw new Error("Unknown type of neighbor: " + neighbor.type);
        }

        if (ignore.includes(neighbor)) {
          return false;
        }
        if (type) {
          if (!(neighbor.parent instanceof type)) {
            return false;
          }
        }
        isFree = false;
        return true;
      }
    );

    return isFree;
  }
  rayCast(startPos, endPos, setting) {
    setting = setting || {};
    const ignore = setting.ignore || [];

    // console.log(startPos.x, startPos.y, endPos.x, endPos.y);
    {
      let near = [];
      this._getNeighbors(
        {
          minX: min(startPos.x, endPos.x),
          minY: min(startPos.y, endPos.y),
          maxX: max(startPos.x, endPos.x),
          maxY: max(startPos.y, endPos.y),
        },
        (neighbor) => {
          near.push(neighbor);
        }
      );

      near = near.filter((neighbor) => {
        if (neighbor.type === "Polygon") {
          const collided = this.#collideLinePoly(startPos, endPos, neighbor);
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
    return null;

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
