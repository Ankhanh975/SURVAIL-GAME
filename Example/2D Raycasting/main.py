#  https://youtu.be/TOEi6T2mtHo
#  2D Ray Casting

import pygame, sys
import random
from boundary import *
from particle import *

width = 400
height = 400

pygame.init()
screen = pygame.display.set_mode((1024, 768), pygame.DOUBLEBUF)
clock = pygame.time.Clock()

walls = []
rays = 0
particle = 0
xoff = 0
yoff = 10000

def setup():
    for i in range(5):
        x1 = random.uniform(0, width)
        x2 = random.uniform(0, width)
        y1 = random.uniform(0, height)
        y2 = random.uniform(0, height)
        walls.append(Boundary(x1, y1, x2, y2))

    walls.append(Boundary(-1, -1, width, -1))
    walls.append(Boundary(width, -1, width, height))
    walls.append(Boundary(width, height, -1, height))
    walls.append(Boundary(-1, height, -1, -1))
    particle = Particle()

setup()
def draw(events, FPS):
    global xoff, yoff
    for wall in walls:
        wall.show()

    # particle.update(noise(xoff) * width, noise(yoff) * height)
    mouseX, mouseY = pygame.mouse.get_pos()
    
    particle.update(mouseX, mouseY)
    particle.show()
    particle.look(walls)

    xoff += 0.01
    yoff += 0.01
    
def draw(events, FPS):
    global mouseInWorldCoords
    mousePos = pygame.mouse.get_pos()
    mouseState = pygame.mouse.get_pressed()[0]
    

while True:
    pygame.display.update()
    clock.tick(60)
    screen.fill((0, 255, 255))

    events = pygame.event.get()
    keys = pygame.key.get_pressed()

    if keys[pygame.K_LALT] and keys[pygame.K_F4]:
        pygame.quit()
        sys.exit()

    for event in events:
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYUP:
            if event.key == pygame.K_F11:
                pass

    fps = clock.get_fps()
    draw(events, fps)
