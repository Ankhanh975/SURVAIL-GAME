class F3Menu:
    # Debug purpose
    display = True
    def __init__(self):
        pass
    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.display = not self.display
        
    def display(self):
        if self.display:
            pass
    
class TabMenu:
    display = False
    def __init__(self):
        pass
    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_F3:
                    self.display = not self.display
        
    def display(self):
        if self.display:
            pass
    
class ChatMenu:
    display = False
    def __init__(self):
        pass
    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_RSHIFT:
                    self.display = not self.display
        
    def display(self):
        if self.display:
            pass
    
class ScoreBar:
    display = True
    def __init__(self):
        pass
    def update(self, events):
        for event in events:
            if event.type == pygame.KEYUP:
                if event.key == None:
                    self.display = not self.display
        
    def display(self):
        if self.display:
            pass