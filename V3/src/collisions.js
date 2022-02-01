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
  isFreeLine(startPos, endPos, setting) {
    setting = setting || {};
    const ignore = setting.ignore || [];
    const type = setting.type;

    const line = this.createPolygon({ x: startPos.x, y: startPos.y }, [
      { x: 0, y: 0 },
      { x: endPos.x - startPos.x, y: endPos.y - startPos.y },
    ]);
    // this.updateBody(line);
    const potentials = this.getPotentials(line);
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
