import random

def ChooseHandToPunch(self):
    input_ = self.PunchHandHistory
    present = input_[-1] + input_[-2] + input_[-3] + input_[-4] + input_[-5]
    if input_[-1] == input_[-2]:
        return (not input_[-1])
    elif present >= 4 or present <= 1:
        return True if present >= 4 else False
    else:
        return (random.randint(0, 100) <= 60) # 60%

def __str__(self):
    coordinates = round(self.pos[0], 5), round(self.pos[1], 5)
    s = f'''\
Color: RGB({self.color[0]}, {self.color[1]}, {self.color[2]})
Angle: {round(self.TrueAngle, 2)}°
Coordinates: {coordinates[0]}, {coordinates[1]}
AnimationNumber: {round(self.animationNumber, 1)} / {len(self.animation)}
Punch: {"With Right Hand" if self.isPunchWithRightHand else "With Left Hand"}
'''
    return s
    


# Velocity: {self.velocity}
# Acceleration: {self.acceleration}
