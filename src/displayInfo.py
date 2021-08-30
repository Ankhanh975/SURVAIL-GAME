import pygame

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
    introduction = "Game make by KHANH."
    playerInfo = ""
    FPS = "0"
    text = f"{introduction} + {FPS} + {playerInfo}"

    def __init__(self):
        self.font = pygame.font.SysFont("Minecraft", 32)

    def update(self, events, player, fps):
        self.playerInfo = str(player)
        self.FPS = f"{fps} fps"
        self.text = f"{self.introduction} \n {self.FPS} \n {self.playerInfo}"
        
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.show = not self.show

    def display(self, surf):
        lines = self.text.splitlines()
        if self.show:
            blit_text(surf, self.text, (20, 20), self.font, color=(255, 254, 253))
            # for i, line in enumerate(lines):
            #     self.img = self.font.render(line, True, (255, 0, 0))
            #     surf.blit(self.img, (x, y + fsize*i))
            #     screen.blit(sys_font.render(line, 0, hecolor), )


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
