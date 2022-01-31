class Collisions2 extends Collisions {
  getNear(player, range = 1000) {
    player = player.circle;
    // Get near object next to this pos
    let all = [];
    const collider = this.createCircle({ x: player.x, y: player.y }, range);

    this.checkOne(collider, (response) => {
      all.push(response.b.parent);
    });
    this.remove(collider);
    return all;
  }
  getPunchAble(p, callback) {
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
      if (response.b.parent !== p) {
        if (
          response.b.parent.pos &&
          this.isFreeLine(
            response.b.parent.pos.x,
            response.b.parent.pos.y,
            p.pos.x,
            p.pos.y,
            [p, response.b.parent]
          )
        ) {
          all.push(response.b.parent);
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
  isFreeLine(startX, startY, endX, endY, ignore = []) {
    const line = this.createPolygon({ x: startX, y: startY }, [
      { x: 0, y: 0 },
      { x: endX - startX, y: endY - startY },
    ]);
    // this.updateBody(line);
    const potentials = this.getPotentials(line);
    const collided = potentials.some((body) => {
      for (const each of ignore) {
        if (body.parent === each) {
          return false;
        }
      }
      if (!(body.parent instanceof Obstacle)) {
        return false;
      }

      if (this.checkCollision(line, body)) {
        // console.log("Collision detected", body);
        return true;
      }
    });
    this.remove(line);
    return !collided;
  }
}

let collisions = new Collisions2();
console.log(collisions);
