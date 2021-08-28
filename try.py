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
    for n in range(27):
        data = load_image(f"Resources/Anmation_{n+44}.jpg")
        shape = data.shape
        # print(data, shape)
        for x in range(shape[0]):
            for y in range(shape[1]):
                if data[x][y][0] < 10 and data[x][y][1] < 10 and data[x][y][0] < 10:
                    continue
                elif data[x][y][0] > 235 and data[x][y][1] > 235 and data[x][y][2] > 235:
                    continue
                else:
                    data[x][y] = (255, 255, 0)
                    
                    
        save_image(data, f"Anmation_{n}.jpg")

