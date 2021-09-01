from src._main import *
from src import _player

SkinColor = ["white", "yellow",  "green", "orange",  "blue",  "red"]

class Player:
    def __init__(self):
        self.LinearPos = pygame.math.Vector2(1000, 1000)
        self.pos = pygame.math.Vector2(1000, 1000)
        self.velocity = pygame.math.Vector2(0, 0)
        self.arcuation = pygame.math.Vector2(0, 0)
        self.center = pygame.math.Vector2(1024/2, 768/2)
        self.angle = 90
        self.color = random.choice(SkinColor)
        self.drawPlayer = _player.DrawPlayer(self.color)
        self.name = ""
        self.heart = 20

        
        self.isPunch = False
        self.isPunchWithRightHand = True
        self.lastTick = pygame.time.get_ticks()
        self.PunchHandHistory = SaveHistory(5)
        self.positionHistory = SaveHistory(2), SaveHistory(2)
        self.positionHistory[0].fill(self.LinearPos[0])
        self.positionHistory[1].fill(self.LinearPos[1])
        
    def update(self, events, mousePos):
        # mousePos: point to look at relative to world coordinates
        dt = pygame.time.get_ticks() - self.lastTick
        self.lastTick = pygame.time.get_ticks()

        mousePos = pygame.mouse.get_pos()
        mouseState = pygame.mouse.get_pressed()[0]  # Left button state
        keys = pygame.key.get_pressed()
        up = keys[pygame.K_w] or keys[pygame.K_UP]
        down = keys[pygame.K_s] or keys[pygame.K_DOWN]
        right = keys[pygame.K_a] or keys[pygame.K_LEFT]
        left = keys[pygame.K_d] or keys[pygame.K_RIGHT]

        if up+down+left+right >= 2:
            speed = dt/3.2
        else:
            speed = dt/2.8

        if up:
            self.LinearPos[1] -= speed
        elif down:
            self.LinearPos[1] += speed

        if right:
            self.LinearPos[0] -= speed
        elif left:
            self.LinearPos[0] += speed
        
        self.positionHistory[0].add(self.LinearPos[0])
        self.positionHistory[1].add(self.LinearPos[1])
        # This average graph line should look like haveing impelements acceleration
        self.pos = self.positionHistory[0].average(), self.positionHistory[1].average()
        
        if mouseState == True and self.drawPlayer.state is None:
            HAND = self.ChooseHandToPunch()
            self.drawPlayer.StartAnimation(HAND)
            self.PunchHandHistory.add(HAND)

        self.OM = pygame.math.Vector2(mousePos)
        self.OH = self.center
        self.HM = self.OH - self.OM
        self.HP0 = pygame.math.Vector2(0, -10)
        self.angle = (180-(self.HP0.angle_to(self.HM))) % 360

    def ChooseHandToPunch(self):
        input_ = self.PunchHandHistory
        present = self.PunchHandHistory.total()
        if input_.read(1) == input_.read(2):
            return (not input_.read(1))
        elif present >= 4 or present <= 1:
            return True if present >= 4 else False
        else:
            return (random.randint(0, 100) <= 60)  # 60%
    __str__ = _player.__str__

    def draw(self, surf, pos):
        self.drawPlayer.draw(surf, self, pos)

    def push(self, FPO):
        # When externa force push the player, different direction will push different amounts
        min, max = 60, 100  # percentage
        a = (max - min) / 180

        self.HM = self.OM - self.OH
        alpha = self.HM.angle_to(FPO)
        alpha = min(alpha, 360-alpha)

        FPT = FPO.scale_to_length(min+a*alpha)
        return FPT
