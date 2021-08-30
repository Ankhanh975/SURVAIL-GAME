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
Angle: {self.TrueAngle%180:2.2f}°
Coordinates: {self.pos[0]:9.3f}, {self.pos[1]:9.3f}
AnimationNumber: {self.animationNumber:4.1f} / {len(self.animation)}
Punch: {"Right" if self.isPunchWithRightHand else "Left"}
'''
    return s
    


# Velocity: {self.velocity}
# Acceleration: {self.acceleration}
