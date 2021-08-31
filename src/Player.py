from src._main import *
from src import _player

SkinColor = ["white", "yellow",  "green", "orange",  "blue",  "red"]

class Player:


    def __init__(self):
        self.drawPlayer = _player.DrawPlayer()
        self.name = "Player 1"
        self.heart = 20
        
        self.pos = pygame.math.Vector2(1000, 1000)
        self.velocity = pygame.math.Vector2(0, 0)
        self.arcuation = pygame.math.Vector2(0, 0)
        self.center = pygame.math.Vector2(1024/2, 768/2)
        # Angle use in all events
        self.TrueAngle = 90
        # Angle use in draw() with a maximum acceleration (average of TrueAngle)
        self.DisplayAngle = 90
        self.isPunch = False
        self.isPunchWithRightHand = True
        self.lastTick = pygame.time.get_ticks()
        self.PunchHandHistory = [False, False, False, False, False]
        
        self.color = random.choice(SkinColor)
        
    def update(self, events):
        dt = pygame.time.get_ticks() - self.lastTick
        self.lastTick = pygame.time.get_ticks()

        mousePos = pygame.mouse.get_pos()
        mouseState = pygame.mouse.get_pressed()[0]  # Left button state
        keys = pygame.key.get_pressed()
        up = keys[pygame.K_w] or keys[pygame.K_UP]
        down = keys[pygame.K_s] or keys[pygame.K_DOWN]
        right = keys[pygame.K_a] or keys[pygame.K_LEFT]
        left = keys[pygame.K_d] or keys[pygame.K_RIGHT]
        
        if up+down+left+right>=2:
            speed = dt/3.2
        else:
            speed = dt/2.8

        if up:
            self.pos[1] -= speed
        elif down:
            self.pos[1] += speed

        if right:
            self.pos[0] -= speed
        elif left:
            self.pos[0] += speed

        if mouseState == True and not self.isPunch:
            HAND = self.ChooseHandToPunch(self)
            self.drawPlayer.StartAnimation(HAND)
            self.PunchHandHistory.append(HAND)
            
        # self.center = pygame.math.Vector2(self.size[0]/2, self.size[1]/2)
        self.OM = pygame.math.Vector2(mousePos)
        self.OH = self.center
        self.HM = self.OH - self.OM
        self.HP0 =  pygame.math.Vector2(0, -10)
        self.TrueAngle = (180-(self.HP0.angle_to(self.HM))) % 360
        
            
        
    def ChooseHandToPunch(self):
        input_ = self.PunchHandHistory
        present = input_[-1] + input_[-2] + input_[-3] + input_[-4] + input_[-5]
        if input_[-1] == input_[-2]:
            return (not input_[-1])
        elif present >= 4 or present <= 1:
            return True if present >= 4 else False
        else:
            return (random.randint(0, 100) <= 60) # 60%
    __str__ = _player.__str__
    
    def draw(self, surf, pos):
        self.drawPlayer(surf, self, pos)
 
    def push(self, FPO):    
        # When externa force push the player, different direction will push different amounts
        min, max = 60, 100 # percentage 
        a = (max - min) / 180 

        self.HM = self.OM - self.OH
        alpha = self.HM.angle_to(FPO)
        alpha = min(alpha, 360-alpha)

        FPT = FPO.scale_to_length(min+a*alpha)
        return FPT
        
class Enemy(Player):
    pass