from src._main import *
screen = pygame.display.set_mode((300, 300), DOUBLEBUF)
import numpy as np
import numba as nb
SetUp()
clock = pygame.time.Clock()

animationImg = pygame.image.load(
                f"Resources/Animation_0.png").convert_alpha()

# print("Start: " + str(time.perf_counter()*1000))
imgData = pygame.surfarray.pixels3d(animationImg)
filter = np.all(imgData, axis=2)
# print(filter)
# print(filter.shape)
# print(filter[98, 98])
imgData[filter] = (255,0,0)
del imgData
# print("End: " + str(time.perf_counter()*1000))

frame = 0
while True:
    frame += 1
    pygame.display.update()
    clock.tick(60)
    screen.fill((0, 255, 255))

    events = pygame.event.get()
    keys = pygame.key.get_pressed()

    screen.blit(animationImg, (0,0))
    for event in events:
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

