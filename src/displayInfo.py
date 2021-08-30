import pygame

def blit_text(surface, text, pos, font, color=pygame.Color('black')):
    words = [word.split(' ') for word in text.splitlines()]  # 2D array where each row is a list of words.
    space = font.size(' ')[0]  # The width of a space.
    max_width, max_height = surface.get_size()
    x, y = pos
    for line in words:
        for word in line:
            word_surface = font.render(word, 0, color)
            word_width, word_height = word_surface.get_size()
            if x + word_width >= max_width:
                x = pos[0]  # Reset the x.
                y += word_height  # Start on new row.
            surface.blit(word_surface, (x, y))
            x += word_width + space
        x = pos[0]  # Reset the x.
        y += word_height  # Start on new row.

class F3Menu:
    # Debug purpose
    display = True
    introduction = "Game make by KHANH."
    playerInfo = ""
    FPS = "0"
    text = f"{introduction} + {FPS} + {playerInfo}"

    def __init__(self):
        self.font = pygame.font.SysFont("Minecraft", 32)

    def update(self, events, player, fps):
        self.playerInfo = str(player)
        self.FPS = f"FPS: {fps}"
        self.text = f"{self.introduction} \n {self.FPS} \n {self.playerInfo}"
        
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.display = not self.display

    def display(self, surf):
        lines = self.text.splitlines()
        if self.display:
            blit_text(surf, self.text, (20, 20), self.font, color=(255, 254, 253))
            # for i, line in enumerate(lines):
            #     self.img = self.font.render(line, True, (255, 0, 0))
            #     surf.blit(self.img, (x, y + fsize*i))
            #     screen.blit(sys_font.render(line, 0, hecolor), )


class TabMenu:
    display = False

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.display = not self.display

    def display(self, surf):

        if self.display:
            return
            surf.blit(self)


class ChatMenu:
    display = False

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_RSHIFT:
                    self.display = not self.display

    def display(self, surf):

        if self.display:
            return
            surf.blit(self)


class ScoreBar:
    display = True

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == None:
                    self.display = not self.display

    def display(self, surf):

        if self.display:
            return
            surf.blit(self)


class EscMenu:
    display = False

    def __init__(self):
        pass

    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_ESCAPE:
                    self.display = not self.display
