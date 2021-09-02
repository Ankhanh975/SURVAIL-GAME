from src._main import *

class Ground:
    # Set background base on player position
    def __init__(self):
        self.img = []
        for i in range(1, 5):
            img = pygame.image.load(
                f"Resources/BackGround{i}.png").convert()
            # img = img.convert_alpha()
            self.img.append(img)
        self.size = self.img[0].get_size()
        self.size = self.size[0]-1, self.size[1]-1

    def getChunk(self, playerPos):
        x, y = playerPos
        x = x // self.size[0]
        y = y // self.size[1]
        return round(x), round(y)

    def draw(self, surf, playerPos, offset=(0,0)):
        i, j = self.getChunk(playerPos)
        for x in range(i, i+6):
            for y in range(j, j+6):
                img = self.img[0]
                # img = random.choice(self.img)
                x1, y1 = x*self.size[0], y*self.size[1]
                x2, y2 = (x+1)*self.size[0]-1, (y+1)*self.size[1]-1
                w, h = abs(x1-x2), abs(y1-y2)

                surf.blit(img, (int(x1-playerPos[0]), int(y1-playerPos[1])))

