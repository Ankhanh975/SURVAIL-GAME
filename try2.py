import sys
import platform
import pygame
import ctypes
import time

pygame.init()
VERISON = f"python-{platform.python_version()} / pygame-{pygame.version.ver}. ({ctypes.sizeof(ctypes.c_voidp)*8} bits)"
RunTime = f"RunTime: {pygame.time.get_ticks()/1000:3.2f}s"
print(0/0)