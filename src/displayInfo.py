import pygame
from platform import python_version
import pygame
from ctypes import sizeof, c_voidp
import time

def blit_text(surface, text, pos, font, color=pygame.Color('black')):


    words = text.splitlines()  # 2D array where each row is a list of words.
    space = font.size(' ')[0]  # The width of a space.
    max_width, max_height = surface.get_size()
    x, y = pos
    for line in words:
        line_surface = font.render(line, 1, color)
        line_width, line_height = line_surface.get_size()

        transparent = pygame.Surface((line_width, line_height))
        transparent.set_alpha(35)         
        transparent.fill((15,15,15))     
        surface.blit(transparent, (x, y, )) 
        surface.blit(line_surface, (x, y))
        x = pos[0]  # Reset the x.
        y += line_height  # Start on new row.

class F3Menu:
    # Debug purpose
    show = True
    INTRODUCTION = "Game make by KHANH."
    playerInfo = ""
    fps = "0"
    VERSION = f"python-{python_version()} / pygame-{pygame.version.ver}. ({sizeof(c_voidp)*8} bits)"
    RunTime = f"RunTime: {pygame.time.get_ticks()/1000:3.2f}s"


    def __init__(self):
        self.font = pygame.font.Font("Resources/Steps-Mono.otf", 20)
        self.font = pygame.font.SysFont("Minecraft", 32)
        # self.font.bold = True
        self.leftText = ""
        self.rightText = ""

    def update(self, events, player, fps, mouseInWorldCoords):
        self.RunTime = f"RunTime: {pygame.time.get_ticks()/1000:3.2f}s "
        self.playerInfo = str(player)
        self.fps = f" {fps:.0f} fps "
        self.mouseInWorldCoords = f"Mouse: {mouseInWorldCoords[0]:5.0f} / {mouseInWorldCoords[1]:5.0f} "
        self.leftText = f"{self.INTRODUCTION} \n{self.fps} \n{self.playerInfo} "
        self.rightText = f"{self.VERSION} \n{self.RunTime} \n{self.mouseInWorldCoords} "
        
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.show = not self.show

    def display(self, surf):
        if self.show:
            UpRightCorer = (1024, 768-768)
            blit_text(surf, self.leftText, (20, 20), self.font, color=(250, 254, 253))
            blit_text(surf, self.rightText, (UpRightCorer[0]-390, UpRightCorer[1]+10), self.font, color=(250, 254, 253))

class TabMenu:
    show = False

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.show = not self.show

    def display(self, surf):

        if self.show:
            return
            surf.blit(self)

class TagName:
    def __init__(self):
        pass
    def display(self, surf, names: list):
        for name in names:
            pass
class ChatMenu:
    show = False

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_RSHIFT:
                    self.show = not self.show

    def display(self, surf):

        if self.show:
            return
            surf.blit(self)


class ScoreBar:
    show = True

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == None:
                    self.show = not self.show

    def display(self, surf):

        if self.show:
            return
            surf.blit(self)


class EscMenu:
    show = False

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_ESCAPE:
                    self.show = not self.show
