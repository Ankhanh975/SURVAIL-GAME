from src._main import *

# https://www.python.org/doc/essays/list2str/
pygame.event.set_allowed([QUIT, KEYUP])

class Main:
    FPS = 60

    def __init__(self):
        SetUp()
        self.clock = pygame.time.Clock()
        self.screen = pygame.display.set_mode((1024, 768), DOUBLEBUF)
        self.playing = True
        self.event = []
        self.frame = 0

    def load_data(self):
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

    def run(self):
        # game loop - set self.playing = False to end the game
        self.playing = True
        while self.playing:
            self.frame += 1
            pygame.display.update()
            self.screen.fill((0, 255, 255))

            self.events = pygame.event.get()
            self.keys = pygame.key.get_pressed()

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

    def draw(self):
        # Run every frame
        for sprite in self.all_sprites:
            self.screen.blit(sprite.image, self.camera.apply(sprite))
        # pygame.draw.rect(self.screen, WHITE, self.player.hit_rect, 2)

    def quit(self):
        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    main = Main()
entities = [Player()]
for x in range(25):
    entities.append(Enemy.Enemy(
        (random.uniform(-1500, 1500), random.uniform(-1500, 1500))))

background = Ground()

mouseInWorldCoords = pygame.math.Vector2(0, 0)
zombie = pygame.image.load("Resources/Zombie.png").convert_alpha()


def draw(events, FPS):
    global mouseInWorldCoords
    mousePos = pygame.mouse.get_pos()
    mouseState = pygame.mouse.get_pressed()[0]

    background.draw(screen, entities[0].pos)

    screen.blit(zombie, (100, 100))
    mouseInWorldCoords = (
        mousePos[0]+entities[0].pos[0]-1024/2, mousePos[1]+entities[0].pos[1]-768/2)

    for entity in entities:
        if entity.name == "P":
            entity.update(entities, mouseInWorldCoords)
            entity.draw(screen, (1024//2, 768//2))
        else:
            entity.update(entities, entities[0].pos)
            pos = (1024//2, 768//2)-entities[0].pos+entity.pos
            entity.draw(screen, pos)

    if mouseState:
        mousePos = mousePos[0], mousePos[1]+random.uniform(-2.5, 2.5)
        particles.create_particle(mousePos, num=3)
        if entities[0].createPunch():
            print("Punch")
            # for entity in entities:
            #     entity.createPunch()

    particles.draw(screen)
    text = f"Punch: {10}\nKill: {10}\nDead: "
    scoreBar.update(events, text)

    for event in events:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_n:
                entities[0].drawPlayer.defaultColor = random.choice(
                    (["white", "yellow",  "green", "orange",  "blue",  "red"]))

        elif event.type == pygame.KEYUP:
            pass
        elif event.type == pygame.MOUSEMOTION:
            pass


f3Menu = displayInfo.F3Menu()
tabMenu = displayInfo.TabMenu()
chatMenu = displayInfo.ChatMenu()
scoreBar = displayInfo.ScoreBar()
particles = particles.Sparks()
frame = 0
while True:
    frame += 1
    pygame.display.update()
    clock.tick(60)
    screen.fill((0, 255, 255))

    events = pygame.event.get()
    keys = pygame.key.get_pressed()

    if keys[pygame.K_LALT] and keys[pygame.K_F4]:
        pygame.quit()
        sys.exit()

    for event in events:
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        elif event.type == pygame.KEYUP:
            if event.key == pygame.K_F11:
                pass

    fps = clock.get_fps()
    fps = round(fps, 2)
    draw(events, fps)
    f3Menu.update(events, entities[0], fps, mouseInWorldCoords)
    f3Menu.display(screen)
    tabMenu.update(events)
    tabMenu.display(screen)
    chatMenu.update(events)
    chatMenu.display(screen)
    # scoreBar.update(events)
    scoreBar.display(screen)
