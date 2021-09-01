import datetime
import threading
import sys
import os
import pygame
import math
import random
import time
import win32gui
import itertools
from pygame.locals import *

if not pygame.get_init():
    pygame.init()
    
def SetUp():
    print("Running")
    pygame.mixer.init(44100, -16, 2, 64)
    pygame.mixer.pre_init(44100, 16, 2, 4096)
    if not pygame.get_init():
        pygame.init()
    programIcon = pygame.image.load('Resources/Logo.png')

    size = programIcon.get_rect().size
    for x in range(size[0]):
        for y in range(size[1]):
            n = programIcon.get_at((x, y))
            programIcon.set_at((x, y), (n[3], n[3], n[3], 255))

    pygame.display.set_icon(programIcon)
    pygame.display.set_caption("Try to survive!")
    
class angelNumber(int):
    # Want to have a continuous number line in 0-360-0 (no use for negative numbers)
    def __init__(self, n):
        super().__init__()
        self.n = float(n)

    def __add__(self, other):
        n = self.n + float(other)
        return n % 360

    def __sub__(self, other):
        n = abs(self.n - float(other))
        return min(n, 360 - n)

    def __mul__(self, other):
        n = self.n * float(other) / 360
        return n
    
    def average(self, other):
        dx = (float(self) - float(other))/2
        return dx%180

    def __float__(self):
        return self.n
        
class SaveHistory:
    # This class is used to save the last n elements without overflow data
    def __init__(self, size):
        self.size = size
        self.i = self.size-1
        self.dict = {}
        for x in range(self.size):
            self.dict[x] = 0

    def add(self, info):
        self.i = (self.i+1) % self.size
        self.dict[self.i] = info

    def read(self, num: int):
        # Read the info save in num times backwards
        if not (0 <= num <= self.size-1):
            raise IndexError("List index out of range")
        else:
            return self.dict[(self.i-num)% self.size] 
    
    def average(self):
        "pygame.math.Vector2"
        if isinstance(self.dict[0], angelNumber) and not isinstance(self.dict[0], (int, float)):
            a = self.read(0)
            for i in range(1, self.size):
                a = a.average(self.read(i))
            return a
        elif not isinstance(self.dict[0], (int, float)):
            raise ValueError(f"Not calcaulateable type for type: {type(self.dict[0])}")
        else:
            total = 0
            for i in range(self.size):
                total += self.dict[i]
            return (total)/(self.size)
    def fill(self, value):
        # Reset the data
        for i in range(self.size):
            self.dict[i] = value
    def total(self):
        total = 0
        for i in range(self.size):
            total += self.dict[i]
        return total
def blitRotate(surf, image, pos, angle):
    originPos = image.get_size()
    originPos = originPos[0]/2, originPos[1]/2
    # calcaulate the axis aligned bounding box of the rotated image
    w, h = image.get_size()
    box = [pygame.math.Vector2(p) for p in [(0, 0), (w, 0), (w, -h), (0, -h)]]
    box_rotate = [p.rotate(angle) for p in box]
    min_box = (min(box_rotate, key=lambda p: p[0])[
               0], min(box_rotate, key=lambda p: p[1])[1])
    max_box = (max(box_rotate, key=lambda p: p[0])[
               0], max(box_rotate, key=lambda p: p[1])[1])

    pivot = pygame.math.Vector2(originPos[0], -originPos[1])
    pivot_rotate = pivot.rotate(angle)
    pivot_move = pivot_rotate - pivot

    origin = (pos[0] - originPos[0] + min_box[0] - pivot_move[0],
              pos[1] - originPos[1] - max_box[1] + pivot_move[1])

    rotated_image = pygame.transform.rotate(image, angle)
    surf.blit(rotated_image, origin)
