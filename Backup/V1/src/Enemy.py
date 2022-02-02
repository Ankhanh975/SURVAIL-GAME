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

# class Mob(pygame.sprite.Sprite):
#     def __init__(self, game, x, y):
#         self.groups = game.all_sprites, game.mobs
#         pygame.sprite.Sprite.__init__(self, self.groups)
#         self.game = game
#         self.image = game.mob_img
#         self.rect = self.image.get_rect()
#         self.hit_rect = MOB_HIT_RECT.copy()
#         self.hit_rect.center = self.rect.center
#         self.pos = pygame.math.Vector2(x, y) * TILESIZE
#         self.vel = pygame.math.Vector2(0, 0)
#         self.acc = pygame.math.Vector2(0, 0)
#         self.rect.center = self.pos
#         self.rot = 0

#     def update(self):
#         self.rot = (self.game.player.pos - self.pos).angle_to(pygame.math.Vector2(1, 0))
#         self.image = pygame.transform.rotate(self.game.mob_img, self.rot)
#         self.rect = self.image.get_rect()
#         self.rect.center = self.pos
#         self.acc = pygame.math.Vector2(MOB_SPEED, 0).rotate(-self.rot)
#         self.acc += self.vel * -1
#         self.vel += self.acc * self.game.dt
#         self.pos += self.vel * self.game.dt + 0.5 * self.acc * self.game.dt ** 2
#         self.hit_rect.centerx = self.pos.x
#         collide_with_walls(self, self.game.walls, 'x')
#         self.hit_rect.centery = self.pos.y
#         collide_with_walls(self, self.game.walls, 'y')
#         self.rect.center = self.hit_rect.center


with open("Resources/NOTE.txt", "r") as f:
    f = f.read()
    f = f.split("\n")
    commonName = f


class Enemy(Player.Player):
    def __init__(self, position):
        super().__init__(pos=position, control=False)
        self.name = random.choice(commonName)
        self.attack = False

    def update(self, entities, mousePos):
        super().update(entities, mousePos)
        for entity in entities:
            if entity:
                pass
        self.response()

    def response(self):
        HM = pygame.math.Vector2(self.HM)
        if self.attack:
            HM = HM.rotate(180) # Point to the player instead of away
            if 70 < HM.length() < 140:
                if random.randint(0, 100) < 90:
                    self.createPunch()
            if 135 < HM.length():
                HM.scale_to_length(2+random.uniform(1, 2))
                self.LinearPos += HM
            else:
                # Too close so run away
                HM.scale_to_length(2+random.uniform(1, 2))
                self.LinearPos -= HM
        else:
            if 200 > HM.length():
                HM.scale_to_length(2+random.uniform(1, 2))
                self.LinearPos += HM
            else:
                pass
            
