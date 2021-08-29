from src._main import *
from src.Player import *
SetUp()
"Resources/C418-Sweden.mp3"
"Resources/C418-Beginning 2.mp3"
"Resources/C418-Danny.mp3"
"Resources/C418-Wet Hands.mp3"
clock = pygame.time.Clock()

pygame.init()

screen = pygame.display.set_mode((1024,768), DOUBLEBUF)


EventSound = pygame.mixer.Sound("Resources/EventSound.mp3")
BackGroundSong = pygame.mixer.music.load("Resources/C418-Sweden.mp3")
pygame.mixer.music.play(-1)
class Ground:
    # Set background base on player position
    def __init__(self):# 
        self.img = pygame.image.load("Resources/BackGround.jpg").convert().convert_alpha()
        self.x, self.y = self.img.get_size()
    def draw(self,surf, playerPos):
        print(playerPos)
        # Rect: Rect containing the surf in world coordinates
        rect = pygame.Rect(playerPos[0]-512, playerPos[1]-384, playerPos[0]+512, playerPos[1]+384)
        
        for x in range(-7, 7):
            for y in range(-7, 7):
                chunkRect = pygame.Rect(- playerPos[0]+512 + x*self.x,- playerPos[1]+384 + y*self.y, self.x, self.y)
                if chunkRect.colliderect(rect):
                    surf.blit(self.img, (-playerPos[0]+512 + x*self.x,- playerPos[1]+384 + y*self.y))
                    print(playerPos, x, y)
                
        
player = Player()
background = Ground()

def draw(events, FPS):
    background.draw(screen, player.pos)
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
