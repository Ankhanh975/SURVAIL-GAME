# from src._main import *
# screen = pygame.display.set_mode((1024, 768), DOUBLEBUF)
# SetUp()
import pygame
from pygame._sdl2 import touch
pygame.init()
screen = pygame.display.set_mode((1024, 768), pygame.DOUBLEBUF)

print('Path to module:',pygame.__file__)
clock = pygame.time.Clock()
a = touch.get_num_devices()
# b = touch.get_device()
# c = touch.get_num_fingers()
# d = touch.get_finger()

print(a)
while True:
    pygame.display.update()
    clock.tick(15)
    screen.fill((0, 255, 255))


    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.MULTIGESTURE:
            x = event.x
            y = event.y
            rotated = event.rotated
            pinched = event.pinched
            num_fingers = event.num_fingers
            
            print(f"XY: {x*100:.2f}% /{y*100:.2f}% \n{rotated:0.6f}° {pinched:.6f} {num_fingers}")

    fps = clock.get_fps()
    fps = round(fps, 2)
