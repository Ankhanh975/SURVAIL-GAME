from src._main import *
from src import Player


with open("Resources/NOTE.txt", "r") as f:
    f = f.read()
    f = f.split("\n")
    commonName = f

class  Enemy(Player.Player):
    def __init__(self, position):
        super().__init__(pos=position, control = False)
        self.name = random.choice(commonName)
    
    def attack(self):
        pass
    
    