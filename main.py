from src._main import *
clock = pygame.time.Clock()

pygame.init()

screen = pygame.display.set_mode((1024,768), DOUBLEBUF)

GoodSkinColor = [255, 255, 255], [255, 255, 0], [0, 0, 255], [248, 147, 29], [0, 255, 0], [255, 0, 0]

BackGround = pygame.image.load("Resources/BackGround.jpg")
x, y = BackGround.get_size()
class Player:
    pos = pygame.math.Vector2(100,100)
    velocity = pygame.math.Vector2(0,0)
    arcuation = pygame.math.Vector2(0,0)
    angle = 0
    isPunch = False
    isPunchWithRightHand = True
    animationNumber = 0
    lastTick = pygame.time.get_ticks()
    def __init__(self):
        self.animation = []
        color = random.choice(GoodSkinColor)
        for i in range(1,7):
            animationImg = pygame.image.load(f"Resources/Animation_{i}.png").convert().convert_alpha()
            size = animationImg.get_size()

            # Make alpha animationImg
            for i in range(size[0]):
                for j in range(size[1]):
                    C = animationImg.get_at((i, j))
                    if C == (255, 255, 255, 255):
                        C = color + [255]
                    elif C == (100, 100, 100, 255):
                        C = (100, 100, 100, 0)
                    animationImg.set_at((i, j), C)
            self.animation.append(animationImg)
            
    def update(self, events):
        dt = pygame.time.get_ticks() - self.lastTick
        self.lastTick = pygame.time.get_ticks()

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
        
        if mouseState==True and not self.isPunch:
            self.isPunch = True
            self.isPunchWithRightHand = (random.randint(0, 3) != 0) # 33%
        elif self.isPunch:
            self.animationNumber+=0.2
            if self.animationNumber >= len(self.animation):
                self.animationNumber = 0
                self.isPunch = False
        
        mouseVector =  self.pos - pygame.math.Vector2(mousePos)
        self.angle = mouseVector.angle_to(pygame.math.Vector2(-100,0))-90
        
    def draw(self, surf):
        
        if self.isPunch:
            animation = self.animation[int(self.animationNumber)]
        else:
            animation = self.animation[0]
            
        if self.isPunchWithRightHand: 
            
            blitRotate(surf, animation, self.pos, self.angle)
        else:
            blitRotate(surf, pygame.transform.flip(animation, True, False), self.pos, self.angle)
    def push(self, vector):
        pass 
        
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
