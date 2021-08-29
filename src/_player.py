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
    s = f'''\
Color: RGB({self.color[0]}, {self.color[1]}, {self.color[2]})
Angle: {round(self.TrueAngle, 2)}°
Coordinates: {self.pos[0]}, {self.pos[1]}
AnimationNumber: {self.animationNumber} / {len(self.animation)}
Punch: {"With Right Hand" if self.isPunchWithRightHand else "With Left Hand"}
'''
    return s
    


# Velocity: {self.velocity}
# Acceleration: {self.acceleration}
