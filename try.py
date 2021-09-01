import datetime
import threading
import sys
import os
import pygame
import math
import random
import time

import cv2
import matplotlib.pyplot as plt

from PIL import Image
import numpy as np

def load_image( infilename ) :
    img = Image.open( infilename )
    img.load()
    data = np.asarray( img, dtype="int32" )
    return data

def save_image( npdata, outfilename ) :
    cv2.imwrite(outfilename, npdata)
    
if __name__ == "__main__":
    for n in range(6):
        data = load_image(f"Anmation{n}.png")
        shape = data.shape
        # print(data, shape)
        for x in range(shape[0]):
            for y in range(shape[1]):
                if data[x][y][0] < 6 and data[x][y][1] < 6 and data[x][y][0] < 6:
                    data[x][y] = (0, 0, 0, 255)
                elif data[x][y][0] > 249 and data[x][y][1] > 249 and data[x][y][2] > 249:
                    data[x][y] = (255, 255, 255, 255)
                else:
                    data[x][y] = (100, 100, 100, 0)
                    
                    
        save_image(data, f"Animation_{n}.png")

