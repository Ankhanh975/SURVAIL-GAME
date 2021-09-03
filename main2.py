from src._main import *

# https://www.python.org/doc/essays/list2str/

pygame.event.set_allowed([QUIT, KEYUP])
entities = [Player()]
self.particles = particles.Sparks()

for x in range(25):
    entities.append(Enemy.Enemy(
        (random.uniform(-1500, 1500), random.uniform(-1500, 1500))))

background = Ground()

mouseInWorldCoords = pygame.math.Vector2(0, 0)
zombie = pygame.image.load("Resources/Zombie.png").convert_alpha()

def draw(self, surf):
    global mouseInWorldCoords
    mousePos = pygame.mouse.get_pos()
    mouseState = pygame.mouse.get_pressed()[0]

    background.draw(self.screen, entities[0].pos)

    self.screen.blit(zombie, (100, 100))
    mouseInWorldCoords = (
        mousePos[0]+entities[0].pos[0]-1024/2, mousePos[1]+entities[0].pos[1]-768/2)

    for entity in entities:
        if entity.name == "P":
            entity.update(entities, mouseInWorldCoords)
            entity.draw(self.screen, (1024//2, 768//2))
        else:
            entity.update(entities, entities[0].pos)
            pos = (1024//2, 768//2)-entities[0].pos+entity.pos
            entity.draw(self.screen, pos)

    if mouseState:
        mousePos = mousePos[0], mousePos[1]+random.uniform(-2.5, 2.5)
        particles.create_particle(mousePos, num=3)
        if entities[0].createPunch():
            print("Punch")
            # for entity in entities:
            #     entity.createPunch()

    particles.draw(self.screen)
    text = f"Punch: {10}\nKill: {10}\nDead: "
    scoreBar.update(self.events, text)

    for event in events:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_n:
                entities[0].drawPlayer.defaultColor = random.choice(
                    (["white", "yellow",  "green", "orange",  "blue",  "red"]))

        elif event.type == pygame.KEYUP:
            pass
        elif event.type == pygame.MOUSEMOTION:
            pass

class Main:
    FPS = 60

    def __init__(self):
        SetUp()
        self.clock = pygame.time.Clock()
        self.screen = pygame.display.set_mode((1024, 768), DOUBLEBUF)
        self.playing = True
        self.event = []
        self.frame = 0
        self.load_data()
        self.f3Menu = displayInfo.F3Menu()
        self.tabMenu = displayInfo.TabMenu()
        self.chatMenu = displayInfo.ChatMenu()
        self.scoreBar = displayInfo.ScoreBar()

    def load_data(self):
        # Some code need a pygame.display.set_mode() to run properly
        
        EventSound = pygame.mixer.Sound("Resources/EventSound.mp3")

        BackGroundSoundTrack = ["Resources/C418 - Sweden.mp3", "Resources/C418 - Beginning 2.mp3",
                                "Resources/C418 - Danny.mp3", "Resources/C418 - Wet Hands.mp3"]
        pygame.mixer.music.load(random.choice(BackGroundSoundTrack))
        # pygame.mixer.music.play(-1)
        
        from src import particles
        from src import Enemy
        from src import Player
        from src import background
        from src import displayInfo
    def new(self):
        # initialize all variables and do all the setup for a new game
        pass

    def start(self):
        # TODO: this run as a new thread
        # game loop - set self.playing = False to end the game
        self.playing = True
        while self.playing:
            self.frame += 1
            pygame.display.update()
            self.screen.fill((0, 255, 255))

            self.events = pygame.event.get()
            self.keys = pygame.key.get_pressed()
            
            self.f3Menu.update(self.events, entities[0], fps, mouseInWorldCoords)
            self.f3Menu.display(self.screen)
            self.tabMenu.update(self.events)
            self.tabMenu.display(self.screen)
            self.chatMenu.update(self.events)
            self.chatMenu.display(self.screen)
            # scoreBar.update(events)
            self.scoreBar.display(self.screen)


            if keys[pygame.K_LALT] and keys[pygame.K_F4]:
                self.quit()

            for event in events:
                if event.type == pygame.QUIT:
                    self.quit()
                elif event.type == pygame.KEYUP:
                    if event.key == pygame.K_F11:
                        pass

            self.draw(events, fps)
            self.dt = self.clock.tick(self.FPS) / 1000.0  # fix for Python 2.x
            self.events()
            self.update()
            self.draw()

    def update(self):
        # update portion of the game loop
        self.all_sprites.update()
        self.camera.update(self.player)
        # bullets hit mobs
        hits = pygame.sprite.groupcollide(self.mobs, self.bullets, False, True)
        for hit in hits:
            hit.kill()

    # def draw(self):
    #     # Run every frame
    #     for sprite in self.all_sprites:
    #         self.screen.blit(sprite.image, self.camera.apply(sprite))
    #     # pygame.draw.rect(self.screen, WHITE, self.player.hit_rect, 2)
    draw = draw
    def quit(self):
        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    main = Main()
    main.start()
