#exercise 1
from abc import ABC, abstractmethod

class Temperature(ABC):
    def __init__(self, value):
        self.value = value

    @abstractmethod
    def to_celsius(self): pass

    @abstractmethod
    def to_fahrenheit(self): pass

    @abstractmethod
    def to_kelvin(self): pass

class Celsius(Temperature):
    def to_celsius(self): return self.value
    def to_fahrenheit(self): return (self.value * 9/5) + 32
    def to_kelvin(self): return self.value + 273.15

class Fahrenheit(Temperature):
    def to_celsius(self): return (self.value - 32) * 5/9
    def to_fahrenheit(self): return self.value
    def to_kelvin(self): return (self.value - 32) * 5/9 + 273.15

class Kelvin(Temperature):
    def to_celsius(self): return self.value - 273.15
    def to_fahrenheit(self): return (self.value - 273.15) * 9/5 + 32
    def to_kelvin(self): return self.value

# Usage
temp = Celsius(25)
print(f"25C in Fahrenheit: {temp.to_fahrenheit()}")
print(f"25C in Kelvin: {temp.to_kelvin()}")

#exercise 2
import random

class QuantumParticle:
    def __init__(self, x=0, y=0.0, p=0.5):
        self.x = x
        self.y = y
        self.p = p
        self.entangled_with = None

    def _disturb(self):
        """Internal method to apply disturbance after measurement."""
        self.x = random.randint(1, 10000)
        self.y = random.random()
        print("Quantum Interferences!!")
        
        # If entangled, the partner is also disturbed
        if self.entangled_with:
            self.entangled_with.x = random.randint(1, 10000)
            self.entangled_with.y = random.random()

    def position(self):
        self._disturb()
        return self.x

    def momentum(self):
        self._disturb()
        return self.y

    def spin(self):
        self.p = random.choice([0.5, -0.5])
        
        # Handle entanglement logic
        if self.entangled_with:
            self.entangled_with.p = -self.p
            print("Spooky Action at a Distance !!")
        return self.p

    def entangle(self, other):
        if not isinstance(other, QuantumParticle):
            print("Only QuantumParticles can be entangled.")
            return
        
        self.entangled_with = other
        other.entangled_with = self
        print(f"Particle {self} is now in quantum entanglement with Particle {other}")

    def __repr__(self):
        return f"QuantumParticle(x={self.x}, y={self.y}, p={self.p})"

# Example Usage:
p1 = QuantumParticle()
p2 = QuantumParticle()
p1.entangle(p2)
p1.spin()
print(f"P1 Spin: {p1.p}, P2 Spin: {p2.p}")