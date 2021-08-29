from src._main import *
from src.Player import *
SetUp()

clock = pygame.time.Clock()

pygame.init()

screen = pygame.display.set_mode((1024,768), DOUBLEBUF)

      
BackGround = pygame.image.load("Resources/BackGround.jpg")
x, y = BackGround.get_size()
  
# EventSound = pygame.mixer.Sound("Resources/EventSound.mp3")
def displayBackground(surf, playerPos):
    screen.blit(BackGround, (0, 0))
    screen.blit(BackGround, (0, 0))
        
player = Player()
def draw(events, getPFS):
    # Set background
    displayBackground(screen, player.pos)
    player.update(events)
    player.draw(screen)
    
    for event in events:
        if event.type==pygame.KEYDOWN:
            pass

        elif event.type==pygame.KEYUP:
            pass
        elif event.type==pygame.MOUSEMOTION:
            pass

    
frame = 0
while True:
    frame +=1
    pygame.display.update()
    clock.tick(60)
    screen.fill((0,255,255))

    events = pygame.event.get()
    for event in events:
        if event.type==pygame.QUIT:
            pygame.quit(); sys.exit()

    draw(events, round(clock.get_fps(), 2))
