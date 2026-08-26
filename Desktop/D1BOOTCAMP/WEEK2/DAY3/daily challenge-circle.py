import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def diameter(self):
        return self.radius * 2

    @diameter.setter
    def diameter(self, value):
        self.radius = value / 2

    @property
    def area(self):
        return math.pi * (self.radius ** 2)

    def __repr__(self):
        return f"Circle(radius={self.radius})"

    def __add__(self, other):
        return Circle(self.radius + other.radius)

    def __eq__(self, other):
        return self.radius == other.radius

    def __gt__(self, other):
        return self.radius > other.radius

    def __lt__(self, other):
        return self.radius < other.radius

# Testing the implementation
c1 = Circle(5)
c2 = Circle(3)

print(f"C1: {c1}, Area: {c1.area:.2f}")
print(f"C2: {c2}, Diameter: {c2.diameter}")

# Addition
c3 = c1 + c2
print(f"C3 (Sum of C1+C2): {c3}")

# Comparisons and Sorting
circles = [Circle(10), Circle(1), Circle(5)]
circles.sort()
print(f"Sorted circles: {circles}")

print(f"Is C1 bigger than C2? {c1 > c2}")