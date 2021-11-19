const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

console.log(c);

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    f.fillStyle = this.color;
    c.fill();
  }
}
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radius = radius;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "blue");
const projectiles = [];
const enemies = []

function spawner
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
  projectiles.forEach((projectile) => projectile.update());
}
addEventListener("click", (event) => {
  const angle = Math.atan2(
    event.clientX - canvas.height / 2,
    event.clientY - canvas.height / 2
    );
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
  const projectile = new Projectile(
    event.clientX,
    event.clientY,
    5,
    "red",
    null,
    { x: 1, y: 1 }
  );
});
