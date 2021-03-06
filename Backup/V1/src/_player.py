from src._main import *


def __str__(self):
    direction = ["north", "east", "south", "west"]
    if 45<=self.angle<=135:
        direction = direction[1]
    elif 135<=self.angle<=225:
        direction = direction[2]
    elif 225<=self.angle<=315:
        direction = direction[3]
    elif self.angle>=315 or self.angle<=45:
        direction = direction[0]
        
    s = f'''\
Color: {self.drawPlayer.color.upper()} 
Facing: {direction} ({self.angle:2.2f}°) 
XY: {self.pos[0]:9.3f} / {self.pos[1]:9.3f} 
Punch: {None if self.drawPlayer.state==None else ("Left" if self.drawPlayer.state=="leftPunch" else "Right")} 
Animate: {self.drawPlayer.animationNumber:4.1f} / {self.drawPlayer.ANIMATIONFRAMES } 
Heart: {self.heart: 3.1f} / 20 
'''
    return s
# Velocity: {self.velocity}
# Acceleration: {self.acceleration}


def FindPointByRotate(A, H, alpha):
    OA = pygame.math.Vector2(A)
    OH = pygame.math.Vector2(H)
    HA = OA - OH
    HA.rotate(alpha)
    return HA + OH


SkinColor = ["white", "yellow", "blue", "orange", "green", "red"]
SkinColorRGB = [255, 255, 255], [255, 255, 0], [
    0, 0, 255], [248, 147, 29], [0, 255, 0], [255, 0, 0]

Character = {"red": [],
             "green": [],
             "blue": [],
             "yellow": [],
             "orange": [],
             "white": []}

CharacterFlip = Character.copy()
CharacterFlip = {"red": [],
                 "green": [],
                 "blue": [],
                 "yellow": [],
                 "orange": [],
                 "white": []}

def SetUpAnimation():
    for i in range(6):
        animationImg = pygame.image.load(
                f"Resources/Animation_{i}.png").convert_alpha()
        for x in range(len(SkinColor)):
            # start = time.perf_counter()*1000
            img = animationImg.copy()
            imgData = pygame.surfarray.pixels3d(img)
            filter = numpy.all(imgData, axis=2)
            imgData[filter] = SkinColorRGB[x]
            # del imgData # Out of scope anyways
            Character[SkinColor[x]].append(img)
            # print(time.perf_counter()*1000-start)


def SetUpAnimationFlip():
    for x in range(len(SkinColor)):
        
        for i in range(6):
            animationImg = Character[SkinColor[x]][i]
            CharacterFlip[SkinColor[x]].append(
                pygame.transform.flip(animationImg, True, False))


SetUpAnimation()
SetUpAnimationFlip()
Character = {"rightPunch": Character, "leftPunch": CharacterFlip.copy()}
del CharacterFlip

class DrawPlayer:
    # This class also control the entity color
    ANIMATIONFRAMES = 6
    ANIMATIONSPEED = 0.21

    def __init__(self, color):
        self.state = None
        self.animationNumber = 0
        self.DisplayAngle = 0
        self.AngleSaveHistory = SaveHistory(9)
        self.PosSaveHistory = SaveHistory(15)
        self.color = color
        self.defaultColor = color
        self.damageNumber = 0
        self.CHARACTER = Character
        
    def update(self):
        if self.state is not None:
            if self.state in ("leftPunch", "rightPunch"):
                self.animationNumber = self.mapAnimation(self.animationNumber)
                if self.animationNumber >= self.ANIMATIONFRAMES:
                    self.animationNumber = 0
                    self.state = None
        
        if self.damageNumber >= 10:
            self.damageNumber = 0
        elif self.damageNumber > 0:
            self.damageNumber += 1
            
        if 1<self.damageNumber<9:
            self.color = "red"
            
    def mapAnimation(self, num):
        # What next frame should be
        # Each frame have a different display time
        N = int(num)

        if N == 0:
            return 1
        elif N in (4, 6):
            num += self.ANIMATIONSPEED*0.8
        else:
            num += self.ANIMATIONSPEED*1.0
        return num

    def StartAnimation(self, state):
        # TODO: punch faster if needed
        if state == "leftPunch" or state == True:
            self.state = "leftPunch"
        elif state == "rightPunch" or state == False:
            self.state = "rightPunch"
        elif state == "boring":
            self.state = None
        else:
            self.state = None

    def GetState(self):
        return self.state

    def draw(self, surf, PLAYER, pos):
        # PLAYER: player object, pos: actual position to draw
        # Also: if the angle is changeing pass a constan speed it will be limited
        # angle = angelNumber(PLAYER.angle)
        angle = PLAYER.angle
        self.update()
        if self.damageNumber != 0:
            COLOR = self.color
        else:
            COLOR=self.defaultColor
            
        if 22 > angle - self.AngleSaveHistory.read(0) > -22:
            self.AngleSaveHistory.add(angle)
        else:
            sign = angle - self.AngleSaveHistory.read(0)
            sign = sign/abs(sign)
            self.AngleSaveHistory.add(self.AngleSaveHistory.read(0) + sign*22)

        self.DisplayAngle = self.AngleSaveHistory.average()
        num = int(self.animationNumber)
        HAND = self.state if self.state is not None else "rightPunch"
        animation = self.CHARACTER[HAND][COLOR][num]
        if -1124 < pos[0] < 1124 and -878 < pos[1] < 878:
            blitRotate(surf, animation, pos, angle)
            return
            animation = pygame.transform.rotate(animation, angle)
            surf.blit(animation, pos)
        self.DisplayAngle, angle
        
    def getDamage(self):
        # Animation take damaged
        if self.damageNumber == 0:
            self.damageNumber = 1
    # TODO: sound effects
    def changeColorAnimation(self, color):
        pass

if __name__ == '__main__':
    x = angelNumber(1)
    x = x.average(180)
    print(x)
