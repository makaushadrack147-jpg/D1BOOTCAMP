#exercise 1

# OOP Quiz Answers

# 1. What is a class?
# A class is a blueprint or template for creating objects.
# It defines the attributes (data) and methods (behavior) that objects will have.

# 2. What is an instance?
# An instance is a specific object created from a class.
# Example: if Dog is a class, then my_dog = Dog() is an instance.

# 3. What is encapsulation?
# Encapsulation is the idea of hiding an object's internal data and exposing only what is necessary.
# It helps protect data and keeps code organized.

# 4. What is abstraction?
# Abstraction focuses on the essential features of an object while hiding unnecessary details.
# Example: a car exposes start() and stop() without showing the engine internals.

# 5. What is inheritance?
# Inheritance allows a class to inherit attributes and methods from another class.
# The child class can reuse and extend the parent class's behavior.

# 6. What is multiple inheritance?
# Multiple inheritance means a class inherits from more than one parent class.
# This allows combining features from different classes, but it can make method resolution more complex.

# 7. What is polymorphism?
# Polymorphism means the same method or function can behave differently depending on the object.
# Example: different classes can have a speak() method that works in different ways.

# 8. What is method resolution order (MRO)?
# MRO is the order Python uses to search for methods and attributes in inherited classes.
# It determines which parent class is checked first when there are multiple inheritance chains.

#exercise 2



import random


class Card:

    def __init__(self, suit, value):
        self.suit = suit
        self.value = value

    def __str__(self):
        return f"{self.value} of {self.suit}"


class Deck:

    def __init__(self):
        self.cards = []

        suits = ["Hearts", "Diamonds", "Clubs", "Spades"]
        values = ["A", "2", "3", "4", "5", "6", "7", "8",
                  "9", "10", "J", "Q", "K"]

        for suit in suits:
            for value in values:
                self.cards.append(Card(suit, value))

    def shuffle(self):
        if len(self.cards) == 52:
            random.shuffle(self.cards)

    def deal(self):
        if len(self.cards) > 0:
            return self.cards.pop()
        else:
            return None


# Create a deck
deck = Deck()

# Shuffle the deck
deck.shuffle()

# Deal a card
card = deck.deal()

print("You got:", card)
print("Cards remaining:", len(deck.cards))