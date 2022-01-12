function onController(player) {
  // The awsd response
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.addPos(createVector(-7, 0));
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.addPos(createVector(7, 0));
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    player.addPos(createVector(0, -7));
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    player.addPos(createVector(0, 7));
  }
}

function mouseClicked(event) {
  // console.log("mouseClicked", event.button  )
  // player.startPunch();
  return false;
}
function keyPressed() {
  let start = millis();
  let jump = () => {
    player.health -= player.totalHealth / 200;
    for (let i = 0; i < 14; i++) {
      let particle = sparks.create_particle(player.pos, [0, 0, 0], 3.5);
      particle.move(1.5);
    }
    let d = createVector(0, 0);
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      d.add(createVector(-32.5, 0));
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      d.add(createVector(32.5, 0));
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      d.add(createVector(0, -32.5));
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      d.add(createVector(0, 32.5));
    }
    let delta = p5.Vector.sub(player.pos, player.lastPos);
    if (delta.mag() < 1) return;

    let deltaT = (millis() - start) / 25 - 0.175;
    d.setMag(150 * Curve.f(deltaT) + 3);

    player.addPos(d);
  };
  // if pressed Enter => jump
  if (keyCode === 32) {
    jump();
    let id99 = setInterval(() => {
      jump();
    }, 16);
    setTimeout(() => {
      clearInterval(id99);
    }, 16 * 8);
  }
}
function isOnPhone() {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return true;
  } else {
    return false;
  }
}
if (isOnPhone()) {
  let manager = nipplejs.create(options);
}
