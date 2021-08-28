from src._main import *

clock = pygame.time.Clock()

pygame.init()

screen = pygame.display.set_mode((1024,768), DOUBLEBUF)


BackGround = pygame.image.load("Resources/BackGround.jpg")
x, y = BackGround.get_size()
class Player:
    pos = [100,100]
    velocity = [0,0]
    arcuation = [0,0]
    angle = 0
    isPunch = False
    animationNumber = 0 
    def __init__(self):
        self.animation = []
        for i in range(27):
            animationImg = pygame.image.load(f"Resources/Anmation_{i}.jpg").convert().convert_alpha()
            size = animationImg.get_size()

            # Make alpha animationImg
            for i in range(size[0]):
                for j in range(size[1]):
                    color = animationImg.get_at((i, j))
                    # average = (color[0]+color[1]+color[2])//3
                    if color == (0,255,255):
                        color[3] = 0
                    animationImg.set_at((i, j), color)
            self.animation.append(animationImg)
    def update(self, events):
        mousePos = pygame.mouse.get_pos()
        mouseState = pygame.mouse.get_pressed()[0] # Left button state
        keys = pygame.key.get_pressed()
        
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            self.pos[1] -= 5
        elif keys[pygame.K_s] or keys[pygame.K_DOWN]:
            self.pos[1] += 5
        
        if keys[pygame.K_a] or keys[pygame.K_RIGHT]:
            self.pos[0] -= 5
        elif keys[pygame.K_d] or keys[pygame.K_LEFT]:
            self.pos[0] += 5
        
        if mouseState and not self.isPunch:
            self.isPunch = True
        self.angle+=1
        if self.isPunch:
            self.animationNumber+=1
            if self.animationNumber >= 27:
                self.animationNumber = 0
                self.isPunch = False
            
    def draw(self, surf):
        if not self.isPunch:
            blitRotate(surf, self.animation[0], self.pos, self.angle)
        else:
            blitRotate(surf, self.animation[self.animationNumber], self.pos, self.angle)
            
        
# EventSound = pygame.mixer.Sound("Resources/EventSound.mp3")

player = Player()
def draw(events, getPFS):
    # Set background
    screen.blit(BackGround, (0, 0))
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
    # screen.fill((0,255,255))

    events = pygame.event.get()
    for event in events:
        if event.type==pygame.QUIT:
            pygame.quit(); sys.exit()

    draw(events, round(clock.get_fps(), 2))
