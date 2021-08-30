from src._main import *
from src import _player

GoodSkinColor = ["white", "yellow",  "green", "orange",  "blue",  "red"]
GoodSkinColorRGB = [255, 255, 255], [255, 255, 0], [0, 0, 255], [248, 147, 29], [0, 255, 0], [255, 0, 0]

Character = {"red": [],
             "green": [],
             "blue": [],
             "yellow": [],
             "orange": [],
             "white": []}
             
CharacterFlip = {"red": [],
             "green": [],
             "blue": [],
             "yellow": [],
             "orange": [],
             "white": []}
             
def SetUpAnimation():
    for x in range(len(GoodSkinColor)):
        for i in range(1, 7):
            animationImg = pygame.image.load(
                f"Resources/Animation_{i}.png").convert().convert_alpha()
            size = animationImg.get_size()

            # Make alpha animationImg
            for i in range(size[0]):
                for j in range(size[1]):
                    C = animationImg.get_at((i, j))
                    if C == (255, 255, 255, 255):
                        C = GoodSkinColorRGB[x] + [255]
                    elif C == (237, 28, 36, 255):
                        C = (100, 100, 100, 0)
                    animationImg.set_at((i, j), C)
                    
            Character[GoodSkinColor[x]].append(animationImg)
            
def SetUpAnimationFlip():
    for x in range(len(GoodSkinColor)):
        for i in range(6):
            animationImg = Character[GoodSkinColor[x]][i]
            CharacterFlip[GoodSkinColor[x]].append(pygame.transform.flip( animationImg, True, False))
            
SetUpAnimation()
SetUpAnimationFlip()
Character = {"right": Character, "left": CharacterFlip}

class Player:
    name = "Player 1"
    heart = 20
    
    pos = pygame.math.Vector2(1000, 1000)
    velocity = pygame.math.Vector2(0, 0)
    arcuation = pygame.math.Vector2(0, 0)
    center = pygame.math.Vector2(1024/2, 768/2)
    # Angle use in all events
    TrueAngle = 90
    # Angle use in draw() with a maximum acceleration (average of TrueAngle)
    DisplayAngle = 90
    isPunch = False
    isPunchWithRightHand = True
    animationNumber = 0
    lastTick = pygame.time.get_ticks()
    PunchHandHistory = [False, False, False, False, False]

    def __init__(self):
        self.color = random.choice(GoodSkinColor)
        self.numOfAnimationFrames = len(Character["right"][self.color])
        self.AngleSaveHistory = SaveHistory(6)

    def update(self, events):
        dt = pygame.time.get_ticks() - self.lastTick
        self.lastTick = pygame.time.get_ticks()

        mousePos = pygame.mouse.get_pos()
        mouseState = pygame.mouse.get_pressed()[0]  # Left button state
        keys = pygame.key.get_pressed()

        if keys[pygame.K_w] or keys[pygame.K_UP]:
            self.pos[1] -= dt/3
        elif keys[pygame.K_s] or keys[pygame.K_DOWN]:
            self.pos[1] += dt/3

        if keys[pygame.K_a] or keys[pygame.K_RIGHT]:
            self.pos[0] -= dt/3
        elif keys[pygame.K_d] or keys[pygame.K_LEFT]:
            self.pos[0] += dt/3

        if mouseState == True and not self.isPunch:
            self.isPunch = True
            self.isPunchWithRightHand = self.ChooseHandToPunch()
            self.PunchHandHistory.append(self.isPunchWithRightHand)
        elif self.isPunch:
            self.animationNumber += 0.22

            if self.animationNumber >= self.numOfAnimationFrames:
                self.animationNumber = 0
                self.isPunch = False

        OM = pygame.math.Vector2(mousePos)
        OH = self.center
        HM = OH - OM
        HP0 =  pygame.math.Vector2(0, -10)
        self.TrueAngle = 180-(HP0.angle_to(HM))
        
        
        self.AngleSaveHistory.add(self.TrueAngle)
        self.DisplayAngle = self.AngleSaveHistory.average()
        
    ChooseHandToPunch = _player.ChooseHandToPunch
    __str__ = _player.__str__

    def draw(self, surf):
        
        Hand = "right" if self.isPunchWithRightHand else "left"
        num = int(self.animationNumber) if self.isPunch else 0
        animation = Character[Hand][self.color][num]
        # animation.fill((10,10,10))

        center = self.pos[0], self.pos[1]
        center = 1024//2, 768//2
        # animation = rotate(animation, center, self.TrueAngle)
        blitRotate(surf, animation, center, self.TrueAngle)

    def push(self, vector):
        # When externa force push the player, different direction will push different amounts
        pass


class Enemy(Player):
    def __init__(self):
        super().__init__()
