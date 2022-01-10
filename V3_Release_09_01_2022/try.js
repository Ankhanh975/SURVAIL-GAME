
{
  function keyPressed() {
    console.log("keyPressed", keyCode);
  }
  function keyTyped() {
    console.log("keyTyped", key);
  }
  function keyReleased() {
    console.log("keyReleased", key);
  }

  function mousePressed(event) {
    console.log("mousePressed", event.button);
  }
  function mouseReleased(event) {
    console.log("mouseReleased", event.button);
  }
  function mouseClicked(event) {
    console.log("mouseClicked", event.button);
  }
  // a 65
  // d 68
  // w 87
  // s 83
  //   https://keycode.info/
}
{
  const wrapper = document.getElementById("wrapper");
  const canvas = document.getElementById("canvas1");
  const fullscreenButton = document.getElementById("fullscreenButton");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  fullscreenButton.addEventListener("click", toggleFullscreen);
  window.addEventListener("resize", resizeCanvas);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      console.log("enter fullscreen");
      wrapper
        .requestFullscreen()
        .then(resizeCanvas)
        .catch((err) => {
          alert(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
          resizeCanvas();
        });
    } else {
      console.log("exit fullscreen");
      document.exitFullscreen().then(resizeCanvas);
    }
  }

  let angle = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle);
    ctx.fillRect(-50, -50, 100, 100);
    angle += 0.005;
    ctx.restore();
    requestAnimationFrame(animate);
  }
  animate();
}
