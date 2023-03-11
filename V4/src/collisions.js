class Collisions2 extends Collisions {
  getNear(point, options, callback) {
    // Very similar to this,getNeighbors but faster since we don't' run polygon to polygon collision detection
    const rangeX = options.rangeX || 1000;
    const rangeY = options.rangeY || 1000;
    const guaranteed = options.guaranteed || true;

    // Get near object next to this pos
    this.#_getNeighbors(
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
    return collideLinePoly(
      startPos.x - polygon.pos.x,
      startPos.y - polygon.pos.y,
      endPos.x - polygon.pos.x,
      endPos.y - polygon.pos.y,
      polygon.points
    );
  }
  #_getNeighbors(AABB, callback) {
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
    this.#_getNeighbors(AABB, (neighbor) => {
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
    this.#_getNeighbors(
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
      this.#_getNeighbors(
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
    angle = createVector(0, -1).rotate(angle).heading();
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
  separateLineCircle(line, circle) {
    // Separate circle out of the line, (solve collision)
    // Based on normal vector of the line
    // Normal vector is perpendicular to the line
    // And point to the left region of the line, if count from line starts position
    {
      // Debugging
      let moveTo = createVector(line.normals[0].x, line.normals[0].y).setMag(
        20
      );
      circle.parent.addPos(moveTo);
      return;
    }
    function LineEquationFrom2Points(P1, P2) {
      return {
        a: P2.y - P1.y,
        b: -(P2.x - P1.x),
        c: P1.y * P2.x - P1.x * P2.y,
      };
    }
    function distLinePoint(line, point) {
      const x0 = point.x;
      const y0 = point.y;
      const a = line.a;
      const b = line.b;
      const c = line.c;

      const d = Math.abs(a * x0 + b * y0 + c) / Math.sqrt(a * a + b * b);
      return d;
    }
    function distLineCircle(line, circle) {
      return distLinePoint(line, circle.pos) - circle.r;
    }
    function distLineCircle2(line, circle, normal) {
      // Now line have a direction like surface of water.
      const x = circle.pos.x + normal.x * 500;
      const y = circle.pos.y + normal.y * 500;
      const re = distLineCircle(line, {
        pos: { x: x, y: y },
        r: circle.r,
      });
      return re - 500;
    }
    const start = {
      x: line.pos.x + line.points[0].x,
      y: line.pos.y + line.points[0].y,
    };
    const end = {
      x: line.pos.x + line.points[1].x,
      y: line.pos.y + line.points[1].y,
    };
    const LineEquation = LineEquationFrom2Points(start, end);
    const normal = line.normals[0];

    let dist = distLineCircle2(LineEquation, circle, normal);
    if (dist > 0) {
      // No intersection
      return;
    }
    dist = -dist;
    console.log(dist);
    dist = min(dist, 14);
    let moveTo = createVector(normal.x, normal.y).setMag(dist);

    // else {
    // console.log(circle);
    circle.parent.addPos(moveTo);
    // const normalVector = createVector(x, y).normalize();
    // a.pos.x += x;
    // a.pos.y += y;
    // a.circle.setPosition(a.pos.x, a.pos.y);
    // return [x, y];
    // }
  }
  createLine = function (x1, y1, x2, y2) {
    const line = this.createPolygon({ x: x1, y: y1 }, [
      { x: 0, y: 0 },
      { x: x2 - x1, y: y2 - y1 },
    ]);
    return line;
  };
}