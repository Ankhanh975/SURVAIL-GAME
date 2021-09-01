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


if __name__ == '__main__':
    x = angelNumber(0)
    x = x.average(181)
    print(x)
