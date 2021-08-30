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


def SetUp():
    pygame.mixer.init(44100, -16, 2, 64)
    pygame.mixer.pre_init(44100, 16, 2, 4096)
    pygame.init()
    programIcon = pygame.image.load('Resources/Logo.png')

    size = programIcon.get_rect().size
    for x in range(size[0]):
        for y in range(size[1]):
            n = programIcon.get_at((x, y))
            programIcon.set_at((x, y), (n[3], n[3], n[3], 255))

    pygame.display.set_icon(programIcon)
    pygame.display.set_caption("Try to survive!")


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
        if type(self.dict[0]) not in (int, float):
            raise ValueError(f"Not calcaulateable type for type: {type(self.dict[0])}")
        else:
            total = 0
            for i in range(self.size):
                total += self.dict[i]
            return total/(self.size+1)



def blitRotate(surf, image, pos, point, angle):

    # calcaulate the axis aligned bounding box of the rotated image
    w, h       = image.get_size()
    box        = [pygame.math.Vector2(p) for p in [(0, 0), (w, 0), (w, -h), (0, -h)]]
    box_rotate = [p.rotate(angle) for p in box]
    min_box    = (min(box_rotate, key=lambda p: p[0])[0], min(box_rotate, key=lambda p: p[1])[1])
    max_box    = (max(box_rotate, key=lambda p: p[0])[0], max(box_rotate, key=lambda p: p[1])[1])

    # calculate the translation of the pivot 
    pivot        = pygame.math.Vector2(point[0], -point[1])
    pivot_rotate = pivot.rotate(angle)
    pivot_move   = pivot_rotate - pivot

    # calculate the upper left origin of the rotated image
    origin = (pos[0] - point[0] + min_box[0] - pivot_move[0], pos[1] - point[1] - max_box[1] + pivot_move[1])

    # get a rotated image
    rotated_image = pygame.transform.rotate(image, angle)

    # rotate and blit the image
    surf.blit(rotated_image, origin)
  
    # draw rectangle around the image
    pygame.draw.rect(surf, (255, 0, 0), (*origin, *rotated_image.get_size()),2)
