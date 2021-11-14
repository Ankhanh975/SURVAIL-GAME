from pygame.locals import *
import pygame
import sys
import math
import random

class Spark():
    # By https://www.youtube.com/watch?v=wNMRq_uoWM0
    def __init__(self, loc, angle, speed, color, scale=1):
        self.loc = list(loc)
        self.angle = angle
        self.speed = speed
        self.scale = scale
        self.color = color
        self.alive = True

    def point_towards(self, angle, rate):
        rotate_direction = ((angle - self.angle + math.pi * 3) %
                            (math.pi * 2)) - math.pi
        try:
            rotate_sign = abs(rotate_direction) / rotate_direction
        except ZeroDivisionError:
            rotate_sing = 1
        if abs(rotate_direction) < rate:
            self.angle = angle
        else:
            self.angle += rate * rotate_sign

    def calculate_movement(self, dt):
        return [math.cos(self.angle) * self.speed * dt, math.sin(self.angle) * self.speed * dt]
        
    def move(self, dt):
        movement = self.calculate_movement(dt)
        self.loc[0] += movement[0]
        self.loc[1] += movement[1]
        self.speed -= 0.085+ 0.025*self.speed
        if self.speed <= 0:
            self.alive = False

    def draw(self, surf):
        if self.alive:
            points = [
                [self.loc[0] + math.cos(self.angle) * self.speed * self.scale,
                 self.loc[1] + math.sin(self.angle) * self.speed * self.scale],
                [self.loc[0] + math.cos(self.angle + math.pi / 2) * self.speed * self.scale * 0.3,
                 self.loc[1] + math.sin(self.angle + math.pi / 2) * self.speed * self.scale * 0.3],
                [self.loc[0] - math.cos(self.angle) * self.speed * self.scale * 3.5,
                 self.loc[1] - math.sin(self.angle) * self.speed * self.scale * 3.5],
                [self.loc[0] + math.cos(self.angle - math.pi / 2) * self.speed * self.scale * 0.3,
                 self.loc[1] - math.sin(self.angle + math.pi / 2) * self.speed * self.scale * 0.3],
            ]
            pygame.draw.polygon(surf, self.color, points)

class Sparks:
    def __init__(self):
        self.particles = []
    
    def update(self):
        l = len(self.particles)
        for i in range(l):
            self.particles[l-i-1].move(1)
            
            if not self.particles[l-i-1].alive:
                self.particles.pop(l-i-1)
                
    def create_particle(self, loc, num=1, angle=None, speed=None, color=(254, 254, 254), scale=2.1):
        # num: number of particles to create
        for i in range(num):
            if angle is None:
                angle = math.radians(random.randint(0, 360))
            if speed is None:
                speed = random.randint(3, 6)
            new = Spark(loc, angle, speed, color, scale)
            self.particles.append(new)

    def draw(self, surf):
        self.update()
        for spark in self.particles:
            spark.draw(surf)
 
if __name__ == '__main__':          
    sparks=[]           
    clock = pygame.time.Clock()
    pygame.init()
    screen = pygame.display.set_mode((500, 500))


    while True:
        pygame.display.update()
        screen.fill((0, 0, 0))
        clock.tick(60)
        
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            if event.type == KEYDOWN:
                mx, my = pygame.mouse.get_pos()
                sparks.append(Spark([mx, my], math.radians(random.randint(
                    0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                
                sparks.append(Spark([mx, my], math.radians(random.randint(
                    0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                
                sparks.append(Spark([mx, my], math.radians(random.randint(
                    0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                
        for i, spark in sorted(enumerate(sparks), reverse=True):
            spark.move(1)
            spark.draw(screen)
            if not spark.alive:
                sparks.pop(i)