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
  getPunchAble(player) {
    return [];
    player.pos.x;
    player.pos.y;
    player.getAngle();

    let hitRange;
    if (this.AIPlayer) {
      hitRange = [150, radians(0 - 90) + this.getAngle(), radians(40)];
    } else {
      hitRange = [280, radians(0 - 90) + this.getAngle(), radians(60)];
    }

    this.parent.players.forEach((e, i) => {
      let hit = collidePointArc(
        e.pos.x,
        e.pos.y,
        this.pos.x,
        this.pos.y,
        hitRange[0],
        hitRange[1],
        hitRange[2]
      );
    });
  }
  isFree(entity, newPos) {
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
