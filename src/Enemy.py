from src._main import *
from src import Player
from threading import Thread

class RunThread():
    stop = False
    def __init__(self, name: str = "AIThread", FPS=20):
        self.clock = pygame.time.Clock()
        self.name = name
        self.FPS = FPS

    def loop(self):
        while self.stop == False:
            self.clock.tick(self.FPSMin)
            self.Stuff()
                
    def Stuff(self):
        pass

# AIThread = None
# Thread(target=AIThread.loop, daemon=True).start()

with open("Resources/NOTE.txt", "r") as f:
    f = f.read()
    f = f.split("\n")
    commonName = f

class Enemy(Player.Player):
    def __init__(self, position):
        super().__init__(pos=position, control = False)
        self.name = random.choice(commonName)
    
    def update(self, entities, mousePos):
        super().update(entities, mousePos)
        self.LinearPos += pygame.math.Vector2(random.uniform(-1, 1), random.uniform(-1, 1))
        
    def attack(self):
        pass
    
    