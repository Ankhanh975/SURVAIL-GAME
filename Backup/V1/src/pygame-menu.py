from _main import *

import pygame_menu
from typing import List, Tuple, Optional


ABOUT = [f'pygame-menu {pygame_menu.__version__}',
         f'Author: {pygame_menu.__author__}',
         f'Email: {pygame_menu.__email__}']
COLOR_BACKGROUND = [128, 0, 128]
FPS = 60
H_SIZE = 600  # Height of window size
HELP = ['Press ESC to enable/disable Menu',
        'Press ENTER to access a Sub-Menu or use an option',
        'Press UP/DOWN to move through Menu',
        'Press LEFT/RIGHT to move through Selectors']
W_SIZE = 800  # Width of window size

timer: Optional[List[float]] = None

screen = pygame.display.set_mode((W_SIZE, H_SIZE), pygame.DOUBLEBUF)
clock = pygame.time.Clock()
dt = 1.0 / FPS

timer_font = pygame.font.SysFont("Minecraft", 32)

def mainmenu_background():
    screen.fill((40, 0, 40))

def reset_timer():
    timer[0] = 0

class TestCallClassMethod:
    # Class call method.

    @staticmethod
    def update_game_settings():
        """
        Class method.
        """
        print('Update game with new settings')


def change_color_bg(value: Tuple, c: Optional[Tuple] = None, **kwargs):
    """
    Change background color.

    :param value: Selected option (data, index)
    :param c: Color tuple
    :return: None
    """
    color, _ = value
    if c == (-1, -1, -1):  # If random color
        c = (random.randrange(0, 255), random.randrange(
            0, 255), random.randrange(0, 255))
    if kwargs['write_on_console']:
        print('New background color: {0} ({1},{2},{3})'.format(color[0], *c))
    COLOR_BACKGROUND[0] = c[0]
    COLOR_BACKGROUND[1] = c[1]
    COLOR_BACKGROUND[2] = c[2]

frame = 0
def main():
    # Init and game loop
    global screen, timer

    # Main timer and game clock
    reset_timer()
    

    # Create menus: Timer
    timer_theme = pygame_menu.themes.THEME_DARK.copy()  # Create a new copy
    timer_theme.background_color = (0, 0, 0, 180)  # Enable transparency

    # Timer
    timer_menu = pygame_menu.Menu(height=400, onclose=pygame_menu.events.RESET, theme=timer_theme, title='Timer Menu', width=600
                                  )

    # Add widgets
    timer_menu.add.button('Reset timer', reset_timer)

    # Adds a selector (element that can handle functions)
    timer_menu.add.selector(title='Change color ',
                            items=[('Random', (-1, -1, -1)),  # Values of selector, call to change_color_bg
                                   ('Default', (128, 0, 128)),
                                   ('Black', (0, 0, 0)),
                                   ('Blue', (12, 12, 200))],
                            default=1,  # Optional parameter that sets default item of selector
                            onchange=change_color_bg,  # Action when changing element with left/right
                            onreturn=change_color_bg,  # Action when pressing return on an element
                            # All the following kwargs are passed to change_color_bg function
                            write_on_console=True
                            )
    timer_menu.add.button('Update game object',
                          TestCallClassMethod().update_game_settings)
    timer_menu.add.button('Return to Menu', pygame_menu.events.BACK)

    # Create menus: Help
    help_theme = pygame_menu.Theme(
        background_color=(30, 50, 107, 128),  # 50% opacity
        title_background_color=(120, 45, 30, 190),
        title_font=pygame_menu.font.FONT_FRANCHISE,
        title_font_size=60,
        widget_font=pygame_menu.font.FONT_FRANCHISE,
        widget_font_color=(170, 170, 170),
        widget_font_shadow=True,
        widget_font_shadow_position=pygame_menu.locals.POSITION_SOUTHEAST,
        widget_font_size=45
    )

    help_menu = pygame_menu.Menu(
        height=600,  # Fullscreen
        theme=help_theme,
        title='Help',
        width=800
    )
    for m in HELP:
        help_menu.add.label(m, align=pygame_menu.locals.ALIGN_CENTER)
    help_menu.add.vertical_margin(25)
    help_menu.add.button('Return to Menu', pygame_menu.events.BACK)

    # Create menus: About
    about_theme = pygame_menu.themes.THEME_DARK.copy()
    about_theme.widget_font = pygame_menu.font.FONT_NEVIS
    about_theme.title_font = pygame_menu.font.FONT_8BIT
    about_theme.title_offset = (5, -2)
    about_theme.widget_offset = (0, 0.14)

    about_menu = pygame_menu.Menu(
        center_content=False,
        height=400,
        theme=about_theme,
        title='About',
        width=600
    )
    for m in ABOUT:
        about_menu.add.label(m, margin=(0, 0))
    about_menu.add.label('')
    about_menu.add.button('Return to Menu', pygame_menu.events.BACK)

    # Create menus: Main menu
    main_menu = pygame_menu.Menu(
        enabled=False,
        height=400,
        theme=pygame_menu.themes.THEME_DARK,
        title='Main Menu',
        width=600
    )

    main_menu.add.button(timer_menu.get_title(),
                         timer_menu)  # Add timer submenu
    main_menu.add.button(help_menu.get_title(), help_menu)  # Add help submenu
    main_menu.add.button(about_menu.get_title(),
                         about_menu)  # Add about submenu
    main_menu.add.button('Exit', pygame_menu.events.EXIT)  # Add exit function

    # Main loop
    while True:
        print("Frame    ")
        clock.tick(FPS)
        timer[0] += dt
        frame += 1

        # Title is evaluated at current level as the title of the base pointer
        # object (main_menu) can change if user opens submenus
        current_menu = main_menu.get_current()
        if current_menu.get_title() != 'Main Menu' or not main_menu.is_enabled():
            # Draw timer
            screen.fill(COLOR_BACKGROUND)
            time_string = str(datetime.timedelta(seconds=int(timer[0])))
            time_blit = timer_font.render(time_string, True, (255, 255, 255))
            time_blit_size = time_blit.get_size()
            screen.blit(time_blit, (int(W_SIZE / 2 - time_blit_size[0] / 2),
                                     int(H_SIZE / 2 - time_blit_size[1] / 2)))
        else:
            # Background color if the menu is enabled and timer is hidden
            screen.fill((40, 0, 40))

        events = pygame.event.get()
        for event in events:
            if event.type == pygame.QUIT:
                exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE and \
                        current_menu.get_title() == 'Main Menu':
                    main_menu.toggle()

        if main_menu.is_enabled():
            main_menu.draw(screen)
            main_menu.update(events)

        pygame.display.flip()


if __name__ == '__main__':
    main()
