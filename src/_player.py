import random
import pygame

def ChooseHandToPunch(self):
    input_ = self.PunchHandHistory
    present = input_[-1] + input_[-2] + input_[-3] + input_[-4] + input_[-5]
    if input_[-1] == input_[-2]:
        return (not input_[-1])
    elif present >= 4 or present <= 1:
        return True if present >= 4 else False
    else:
        return (random.randint(0, 100) <= 60) # 60%

s=""
s
def __str__(self):
    
    s = f'''\
Color: {self.color.upper()}
Angle: {self.TrueAngle:2.2f}°
XY: {self.pos[0]:9.3f} / {self.pos[1]:9.3f}
AnimationNumber: {self.animationNumber:4.1f} / {self.numOfAnimationFrames }
Punch: {"Right" if self.isPunchWithRightHand else "Left"}
Heart: {self.heart: 3.1f} / 20
'''
    return s

def FindPointByRotate(A, H, alpha):
    OA = pygame.math.Vector2(A)
    OH = pygame.math.Vector2(H)
    HA = OA - OH 
    HA.rotate(alpha)
    return HA + OH
# class Control:
#     pos = pygame.math.Vector2(1000, 1000)
#     velocity = pygame.math.Vector2(0, 0)
#     arcuation = pygame.math.Vector2(0, 0)
#     # Angle use in all events
#     TrueAngle = 90
#     # Angle use in draw() with a maximum acceleration (average of TrueAngle)
#     DisplayAngle = 90

#     def __init__(self, color):
#         self.color = random.choice(GoodSkinColor)

#     def update(self, events, dt):
#         mousePos = pygame.mouse.get_pos()
#         mouseState = pygame.mouse.get_pressed()[0]  # Left button state
#         keys = pygame.key.get_pressed()
        
#         if keys[pygame.K_w] or keys[pygame.K_UP]:
#             self.pos[1] -= dt/3
#         elif keys[pygame.K_s] or keys[pygame.K_DOWN]:
#             self.pos[1] += dt/3
#         if keys[pygame.K_a] or keys[pygame.K_RIGHT]:
#             self.pos[0] -= dt/3
#         elif keys[pygame.K_d] or keys[pygame.K_LEFT]:
#             self.pos[0] += dt/3

# Velocity: {self.velocity}
# Acceleration: {self.acceleration}
