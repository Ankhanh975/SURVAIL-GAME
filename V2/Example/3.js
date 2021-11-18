clock = pygame.time.Clock()
win = pygame.display.set_mode((800, 600))
particles = []
colors = [[255, 0, 0], [255, 215, 0], [255, 69, 0]]


class Particle {
    constructor(this, x, y, xvel, yvel, radius, color, gravity = null) {
        this.x = x
        this.y = y
        this.xvel = xvel
        this.yvel = yvel
        this.radius = radius
        this.color = color
        this.gravity = gravity
    }
    render(this, win) {
        this.x += this.xvel
        this.y += this.yvel
        if (this.gravity != null) {
            this.yvel += this.gravity
            this.radius -= 0.1

            pygame.draw.circle(win, this.color, (this.x, this.y), this.radius)

        }
    }
}

function DrawParticles() {
    for (particle of particles) {
        particle.render(win)
        if (particle.radius <= 0) {
            particles.remove(particle)
        }
    }
}
function draw() {
    for (event in pygame.event.get()) {
        pos = pygame.mouse.get_pos()
        if (event.type == pygame.QUIT) {
            pygame.quit()
            sys.exit(0)

            for (x in range(random.randint(15, 25))) {
                particle = Particle(pos[0], pos[1], random.randint(0, 20) / 10, random.randint(-3, -1), random.randint(2, 5), random.choice(colors))
                particles.append(particle)

                win.fill((0, 0, 0))
                DrawParticles()
                pygame.display.update()
            }
        }
    }
}
