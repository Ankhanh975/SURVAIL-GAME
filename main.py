from src._main import *
from src import particles
SetUp()


clock = pygame.time.Clock()
screen = pygame.display.set_mode((1024, 768), DOUBLEBUF)

from src.Player import *
from src import displayInfo

EventSound = pygame.mixer.Sound("Resources/EventSound.mp3")
BackGroundSoundTrack = ["Resources/C418 - Sweden.mp3", "Resources/C418 - Beginning 2.mp3", "Resources/C418 - Danny.mp3", "Resources/C418 - Wet Hands.mp3"]
pygame.mixer.music.load(random.choice(BackGroundSoundTrack))
# pygame.mixer.music.play(-1)


class Ground:
    # Set background base on player position
    def __init__(self):
        self.img = []
        for i in range(1, 5):
            img = pygame.image.load(
                f"Resources/BackGround{i}.png").convert().convert_alpha()
            self.img.append(img)
        self.size = self.img[0].get_size()
        self.size = self.size[0]-1, self.size[1]-1


    def getChunk(self, playerPos):
        x, y = playerPos
        x = x // self.size[0]
        y = y // self.size[1]
        return round(x), round(y)

    def draw(self, surf, playerPos):
        i, j = self.getChunk(playerPos)
        for x in range(i, i+6):
            for y in range(j, j+6):
                img = self.img[0]
                # img = random.choice(self.img)
                x1, y1 = x*self.size[0], y*self.size[1]
                x2, y2 = (x+1)*self.size[0]-1, (y+1)*self.size[1]-1
                w, h = abs(x1-x2), abs(y1-y2)
                
                surf.blit(img, (x1-playerPos[0], y1-playerPos[1]))


player = Player()
        

background = Ground()
debugScreen = False

def draw(events, FPS):
    background.draw(screen, player.pos)
    player.update(events)
    player.draw(screen, (1024//2, 768//2))
    
    mousePos = list(pygame.mouse.get_pos())
    mouseState = pygame.mouse.get_pressed()[0]
    if mouseState :
        particles.sparks.append(particles.Spark(mousePos, math.radians(random.randint(
                    0, 360)), random.randint(3, 6), (255, 255, 255), 2))
                    
    for i, spark in sorted(enumerate(particles.sparks), reverse=True):
        spark.move(1)
        spark.draw(screen)
        if not spark.alive:
            particles.sparks.pop(i)
            

    for event in events:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_n:
                player.color = random.choice((["white", "yellow",  "green", "orange",  "blue",  "red"]))

        elif event.type == pygame.KEYUP:
            pass
        elif event.type == pygame.MOUSEMOTION:
            pass
        
f3Menu = displayInfo.F3Menu()
tabMenu = displayInfo.TabMenu()
chatMenu = displayInfo.ChatMenu()
scoreBar = displayInfo.ScoreBar()

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
            if event.key == pygame.K_F3:
                debugScreen = not debugScreen
            elif event.key == pygame.K_F11:
                pass
    fps = clock.get_fps()
    fps = round(fps, 2)
    draw(events, fps)
    f3Menu.update(events, player, fps)    
    f3Menu.display(screen)
    tabMenu.update(events)    
    tabMenu.display(screen)
    chatMenu.update(events)    
    chatMenu.display(screen)
    scoreBar.update(events)    
    scoreBar.display(screen)