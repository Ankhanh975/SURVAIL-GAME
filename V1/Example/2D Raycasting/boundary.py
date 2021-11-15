import pygame

class Boundary:
    def __init__(self, x1, y1, x2, y2):
        self.a = pygame.math.Vector2(x1, y1)
        self.b = pygame.math.Vector2(x2, y2)

    def show(self, surf):
        pygame.draw.line(self.a.x, self.a.y, self.b.x, self.b.y)
