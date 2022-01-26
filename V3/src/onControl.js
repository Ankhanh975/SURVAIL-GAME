function keyPressed() {
  // if pressed Enter => jump
  if (keyCode === 32) {
    player.jump();
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
  GoInFullscreen(document);
}
setTimeout(() => {
  if (
    !isOnPhone() &&
    window.location.href.includes(
      "https://ankhanh975.github.io/SURVAIL-GAME/V3/"
    )
  ) {
    window.open("https://github.com/Ankhanh975/SURVAIL-GAME/tree/master/V3");
  }
}, 10 * 000);

/* Get into full screen */
function GoInFullscreen(element) {
  if (element.requestFullscreen) element.requestFullscreen();
  else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
  else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  else if (element.msRequestFullscreen) element.msRequestFullscreen();
}

/* Get out of full screen */
function GoOutFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();
}

/* Is currently in full screen or not */
function IsFullScreenCurrently() {
  var full_screen_element =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null;

  // If no element is in full-screen
  if (full_screen_element === null) return false;
  else return true;
}
