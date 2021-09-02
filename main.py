from src._main import *
screen = pygame.display.set_mode((1024, 768), DOUBLEBUF)
from src import particles
from src import Enemy
from src.Player import *
from src.background import *

# https://www.python.org/doc/essays/list2str/
pygame.event.set_allowed([QUIT, KEYUP])

from src import displayInfo

# This code need set_mode to setup

SetUp()
clock = pygame.time.Clock()

EventSound = pygame.mixer.Sound("Resources/EventSound.mp3")
BackGroundSoundTrack = ["Resources/C418 - Sweden.mp3", "Resources/C418 - Beginning 2.mp3",
                        "Resources/C418 - Danny.mp3", "Resources/C418 - Wet Hands.mp3"]
pygame.mixer.music.load(random.choice(BackGroundSoundTrack))
# pygame.mixer.music.play(-1)


player = Player()
enemy = []
enemy.append(Enemy.Enemy((0,100)))
enemy.append(Enemy.Enemy((100,0)))
enemy.append(Enemy.Enemy((0,-100)))
enemy.append(Enemy.Enemy((-100,0)))

enemy = Enemy.Enemy((0,100))
background = Ground()

mouseInWorldCoords = pygame.math.Vector2(0,0)
def draw(events, FPS):
    global mouseInWorldCoords
    mousePos = pygame.mouse.get_pos()
    mouseState = pygame.mouse.get_pressed()[0]

    background.draw(screen, player.pos)
    mouseInWorldCoords = (mousePos[0]+player.pos[0]-1024/2, mousePos[1]+player.pos[1]-768/2)
    player.update(events, mouseInWorldCoords)
    enemy.update(events, player.pos)

    player.draw(screen, (1024//2, 768//2))
    pos = -player.pos-enemy.pos
    print(pos, enemy.pos)
    enemy.draw(screen, pos)

    if mouseState:
        mousePos = mousePos[0], mousePos[1]+random.uniform(-2.5, 2.5)
        particles.create_particle(mousePos, num=3)

    particles.draw(screen)

    for event in events:
        if event.type == pygame.KEYDOWN:    
            if event.key == pygame.K_n:
                player.color = random.choice(
                    (["white", "yellow",  "green", "orange",  "blue",  "red"]))
            

        elif event.type == pygame.KEYUP:
            pass
        elif event.type == pygame.MOUSEMOTION:
            pass


f3Menu = displayInfo.F3Menu()
tabMenu = displayInfo.TabMenu()
chatMenu = displayInfo.ChatMenu()
scoreBar = displayInfo.ScoreBar()
particles = particles.Sparks()
frame = 0
while True:
    frame += 1
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
    fps = round(fps, 2)
    draw(events, fps)
    f3Menu.update(events, player, fps, mouseInWorldCoords)
    f3Menu.display(screen)
    tabMenu.update(events)
    tabMenu.display(screen)
    chatMenu.update(events)
    chatMenu.display(screen)
    scoreBar.update(events)
    scoreBar.display(screen)
