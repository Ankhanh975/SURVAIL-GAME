# https://youtu.be/TOEi6T2mtHo
# 2D Ray Casting
import pygame, math, sys, random
from boundary import *
from ray import *

width = 400
height = 400

class Particle:
    def __init__(self):
        self.pos = pygame.math.Vector2(width / 2, height / 2)
        self.rays = []
        for a in range(360):
            self.rays.append(Ray(self.pos, a))

    def update(self, x, y):
        self.pos.set(x, y)

    def look(self, walls):
        for i in range(self.rays.length):
            ray = self.rays[i]
            closest = None
            record = float("inf")
            for wall in walls:
                pt = ray.cast(wall)
                if pt:
                    d = pygame.math.Vector2.dist(self.pos, pt)
                    if d < record:
                        record = d
                        closest = pt

            if closest:
                # colorMode(HSB)
                # stroke((i + frameCount * 2) % 360, 255, 255, 50)
                # stroke(255, 100)
                pygame.draw.line(self.pos.x, self.pos.y, closest.x, closest.y)

    def show(self, surf):
        # fill(255)
        pygame.draw.ellipse(self.pos.x, self.pos.y, 4)
        for ray in self.rays:
            ray.show(surf)
