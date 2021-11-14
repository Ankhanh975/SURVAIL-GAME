
class Spark{
    //  By https://www.youtube.com/watch?v=wNMRq_uoWM0
    constructor(this, loc, angle, speed, color, scale=1){
        this.loc = list(loc)
        this.angle = angle
        this.speed = speed
        this.scale = scale
        this.color = color
        this.alive = true

        point_towards(this, angle, rate){
            rotate_direction = ((angle - this.angle + math.pi * 3) %
                (math.pi * 2)) - math.pi
            try {
                rotate_sign = abs(rotate_direction) / rotate_direction
            }
        catch{
                    rotate_sing = 1
                    if (abs(rotate_direction) < rate) {
                        this.angle = angle
                    }
                    else {
                        this.angle += rate * rotate_sign
                    }
                }
            }
        }
            
    calculate_movement(this, dt){
        return [math.cos(this.angle) * this.speed * dt, math.sin(this.angle) * this.speed * dt]
    }
     move(this, dt){
        movement = this.calculate_movement(dt)
        this.loc[0] += movement[0]
        this.loc[1] += movement[1]
        this.speed -= 0.085+ 0.025*this.speed
                    if (this.speed <= 0){
                        this.alive = False
                    }
        }
    draw(this, surf) {
        if (this.alive{
            points = [
                [this.loc[0] + math.cos(this.angle) * this.speed * this.scale,
                this.loc[1] + math.sin(this.angle) * this.speed * this.scale],
                [this.loc[0] + math.cos(this.angle + math.pi / 2) * this.speed * this.scale * 0.3,
                this.loc[1] + math.sin(this.angle + math.pi / 2) * this.speed * this.scale * 0.3],
                [this.loc[0] - math.cos(this.angle) * this.speed * this.scale * 3.5,
                this.loc[1] - math.sin(this.angle) * this.speed * this.scale * 3.5],
                [this.loc[0] + math.cos(this.angle - math.pi / 2) * this.speed * this.scale * 0.3,
                this.loc[1] - math.sin(this.angle + math.pi / 2) * this.speed * this.scale * 0.3],
            ]
            pygame.draw.polygon(surf, this.color, points)
        }
    }
class Sparks{
    constructor(this){
        this.particles = []
    }
     update(this){
        l = len(this.particles)
         for (i in range(l)) {
             this.particles[l - i - 1].move(1)
            
             if (! this.particles[l - i - 1].alive){
                 this.particles.pop(l - i - 1)
             }
         }
    create_particle(this, loc, num = 1, angle = null, speed = null, color = (254, 254, 254), scale = 2.1){
        //  num{ number of particles to create
        for (i in range(num)) {
            if (angle === null) {
                angle = math.radians(random.randint(0, 360))
            }
            if (speed === null) {
                speed = random.randint(3, 6)
            }
            new = new Spark(loc, angle, speed, color, scale)
            this.particles.append(new)
        }
    }
     draw(this, surf){
        this.update()
        for (spark in this.particles) {
            spark.draw(surf)
        }
       }
if( __name__ == '__main__'){          
    clock = pygame.time.Clock()
    pygame.init()
    screen = pygame.display.set_mode((500, 500))


    while true{
        pygame.display.update()
        screen.fill((0, 0, 0))
        clock.tick(60)
        
        for( event in pygame.event.get()){
            if( event.type == QUIT){
                pygame.quit()
                sys.exit()
                if (event.type == KEYPRESS) {
                    mx, my = pygame.mouse.get_pos()
                    sparks.append(Spark([mx, my], math.radians(random.randint(
                        0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                
                    sparks.append(Spark([mx, my], math.radians(random.randint(
                        0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                
                    sparks.append(Spark([mx, my], math.radians(random.randint(
                        0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                
                    for (i, spark in sorted(enumerate(sparks), reverse = true)) {
                        spark.move(1)
                        spark.draw(screen)
                        if (!spark.alive) {
                            sparks.pop(i)
                        }
                
                    }
                }