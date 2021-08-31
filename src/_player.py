import random
import pygame
from src._main import *


def __str__(self):
    direction = ["south", "north", "east", "west"]
    print((self.angle/90-45) % 90)
    direction = direction[round((self.angle-45)/45 % 3)]
    s = f'''\
Color: {self.color.upper()}
Facing: {direction} ({self.angle:2.2f}°)
XY: {self.pos[0]:9.3f} / {self.pos[1]:9.3f}
AnimationNumber: {self.drawPlayer.animationNumber:4.1f} / {self.drawPlayer.ANIMATIONFRAMES }
Punch: {self.drawPlayer.state}
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
    for x in range(len(SkinColor)):
        for i in range(6):
            animationImg = pygame.image.load(
                f"Resources/Animation_{i}.png").convert().convert_alpha()
            size = animationImg.get_size()

            # Make alpha animationImg
            for i in range(size[0]):
                for j in range(size[1]):
                    C = animationImg.get_at((i, j))
                    if C == (255, 255, 255, 255):
                        C = SkinColorRGB[x] + [255]
                    elif C == (237, 28, 36, 255):
                        C = (100, 100, 100, 0)
                    animationImg.set_at((i, j), C)

            Character[SkinColor[x]].append(animationImg)


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
del SkinColorRGB

class DrawPlayer:
    ANIMATIONFRAMES = 6
    ANIMATIONSPEED = 0.21

    def __init__(self):
        self.state = None
        self.animationNumber = 0
        self.DisplayAngle = 0
        self.AngleSaveHistory = SaveHistory(9)
        self.PosSaveHistory = SaveHistory(15)

    def update(self):
        if self.state is not None:
            if self.state in ("leftPunch", "rightPunch"):
                self.animationNumber = self.mapAnimation(self.animationNumber)
                if self.animationNumber >= self.ANIMATIONFRAMES:
                    self.animationNumber = 0
                    self.state = None

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
        angle = angelNumber(PLAYER.angle)
        self.update()
        if 22 > angle - self.AngleSaveHistory.read(0) > -22:
            self.AngleSaveHistory.add(angle)
        else:
            sign = angle - self.AngleSaveHistory.read(0)
            sign = sign/abs(sign)
            self.AngleSaveHistory.add(self.AngleSaveHistory.read(0) + sign*22)

        self.DisplayAngle = self.AngleSaveHistory.average()
        num = int(self.animationNumber)
        HAND = self.state if self.state is not None else "rightPunch"
        animation = Character[HAND][PLAYER.color][num]
        blitRotate(surf, animation, pos, self.DisplayAngle)
        self.DisplayAngle, angle





if __name__ == '__main__':
    x = angelNumber(1)
    x = x.average(180)
    print(x)
