from src._main import *
from src import Player


with open("Resources/NOTE.txt", "r") as f:
    f = f.read()
    f = f.split("\n")
    commonName = f

class Enemy(Player.Player):
    def __init__(self, position):
        super().__init__()
        self.position = position
        self.name = random.choice(commonName)
        
        print(self.name)
    
    def attack(self):
        pass
    
    