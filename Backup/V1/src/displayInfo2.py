from src._main import *
from platform import python_version
from ctypes import sizeof, c_voidp

def draw_player_health(surf, x, y, percentage):
    if percentage < 0:
        percentage = 0
    BAR_LENGTH = 100
    BAR_HEIGHT = 20
    fill = percentage * BAR_LENGTH
    outline_rect = pygame.Rect(x, y, BAR_LENGTH, BAR_HEIGHT)
    fill_rect = pygame.Rect(x, y, fill, BAR_HEIGHT)
    if percentage > 0.6:
        col = GREEN
    elif percentage > 0.3:
        col = YELLOW
    else:
        col = RED
    pygame.draw.rect(surf, col, fill_rect)
    pygame.draw.rect(surf, WHITE, outline_rect, 2)

def blit_text(surface, text, pos, font, color=pygame.Color('black'), transparentRect=True, reverse=False):
    words = text.splitlines()  # 2D array where each row is a list of words.
    max_width, max_height = surface.get_size()
    x, y = pos # Don't touch the pos
    for line in words:
        line_surface = font.render(line, 1, color)
        line_width, line_height = line_surface.get_size()
        if transparentRect:
            transparent = pygame.Surface((line_width, line_height))
            transparent.set_alpha(35)         
            transparent.fill((15,15,15))     
            surface.blit(transparent, (x, y, )) 
        surface.blit(line_surface, (x, y))
        if not reverse:
            y += line_height  # Start on new row.
        else:
            y-=line_height
    return pygame.Rect(pos, (x, y))

class F3Menu:
    # Debug purpose
    show = True
    INTRODUCTION = "Game make by KHANH."
    playerInfo = ""
    fps = "0"
    VERSION = f"python-{python_version()} / pygame-{pygame.version.ver}. ({sizeof(c_voidp)*8} bits)"
    RunTime = f"RunTime: {pygame.time.get_ticks()/1000:3.2f}s"


    def __init__(self, main):
        self.main = main
        self.font = pygame.font.Font("Resources/Steps-Mono.otf", 20)
        self.font = pygame.font.SysFont("Minecraft", 32)
        # self.font.bold = True
        self.leftText = ""
        self.rightText = ""

    def update(self, player, fps, mouseInWorldCoords):
        self.RunTime = f"RunTime: {pygame.time.get_ticks()/1000:3.2f}s "
        self.playerInfo = str(player)
        self.fps = f" {fps:.0f} fps "
        self.mouseInWorldCoords = f"Mouse: {mouseInWorldCoords[0]:5.0f} / {mouseInWorldCoords[1]:5.0f} "
        self.leftText = f"{self.INTRODUCTION} \n{self.fps} \n{self.playerInfo} "
        self.rightText = f"{self.VERSION} \n{self.RunTime} \n{self.mouseInWorldCoords} "
        
        for event in self.main.events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.show = not self.show

    def display(self, surf):
        if self.show:
            UpRightCorer = (1024, 768-768)
            blit_text(surf, self.leftText, (20, 20), self.font, color=(250, 254, 253))
            blit_text(surf, self.rightText, (UpRightCorer[0]-390, UpRightCorer[1]+10), self.font, color=(250, 254, 253))

class ScoreBar:
    # TODO
    # Heavily inspired from minecraft score-bar 
    show = True
    # The visibility of the number line
    numberLine = False
    def __init__(self, main, numberLine = False):
        self.main = main
        self.numberLine = numberLine
        self.font = pygame.font.SysFont("Minecraft", 32)
        
        text_surface = self.font.render(" ", 1, (0,0,0))
        self.surface_height = text_surface.get_size()[1] + 19
        surface_weight = text_surface.get_size()[0] + 19
        self.surface = pygame.Surface((surface_weight, self.surface_height))
        self.surface.fill((100,100,100))
        self.surface.set_alpha(60)
        
        self.numberLineText = ""
    def update(self, text):
        self.text = text
        if self.numberLine:
            for x in range(self.text.count("\n")):
                self.numberLineText += "\n" + x
            
    def display(self, surf):

        if self.show:
            surface_height = self.text.count("\n")*self.surface_height + 19
            
            self.surface = pygame.Surface((400, surface_height))
            self.surface.fill((100,100,100))
            self.surface.set_alpha(60)

            surf.blit(self.surface, (1024-200-10, 240-10))
            
            blit_text(surf, self.text, (1024-200, 240), self.font, color=(250, 254, 253), transparentRect=False, reverse=True)
class TabMenu:
    show = False

    def __init__(self, main):
        self.main = main
        pass

    def update(self):
        for event in self.main.events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.show = not self.show

    def display(self, surf):

        if self.show:
            return
            surf.blit(self)

class TagName:
    def __init__(self, main):
        self.main = main
        pass
    def display(self, surf, names: list):
        for name in names:
            pass
        
class ChatMenu:
    show = False

    def __init__(self, main):
        self.main = main
        pass

    def update(self):
        for event in self.main.events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_RSHIFT:
                    self.show = not self.show

    def display(self, surf):

        if self.show:
            return
            surf.blit(self)
class EscMenu:
    show = False

    def __init__(self, main):
        self.main = main
        pass

    def update(self):
        for event in self.main.events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_ESCAPE:
                    self.show = not self.show
