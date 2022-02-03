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
      const x1 = AABB.minX;
      const y1 = AABB.minY;
      const x2 = AABB.maxX;
      const y2 = AABB.maxY;
      function collideBox(RectA, RectB) {
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
      // Get all objects overlap with this rectangle.
      let near = this._getNeighbors(AABB);
      near = near.filter((neighbor) => {
        if (neighbor.type === "Polygon") {
          return collideRectPoly(
            AABB.minX,
            AABB.minY,
            AABB.maxX - AABB.minX,
            AABB.maxY - AABB.minY,
            neighbor.calcPoints
          );
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
          return collided;
        } else {
          throw new Error("Unknown type of neighbor: " + neighbor.type);
        }
      });
      return near;
    }
  
    isFreeLine(startPos, endPos, setting) {
      const all = this.rayCast(...arguments);
      
      return all.length === 0;
    }
    rayCast(startPos, endPos, setting) {
      setting = setting || {};
      const ignore = setting.ignore || [];
      const type = setting.type;
      {
        let near = this._getNeighbors({
          minX: startPos.x,
          minY: startPos.y,
          maxX: endPos.x,
          maxY: endPos.y,
        });
  
        near = near.filter((neighbor) => {
          if (neighbor.type === "Polygon") {
            const collided = collideLinePoly(
              startPos.x,
              startPos.y,
              endPos.x,
              endPos.y,
              neighbor.calcPoints
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
        near = near.filter((neighbor) => !ignore.includes(neighbor));
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
      console.log("getPunchAble", all);
  
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
  