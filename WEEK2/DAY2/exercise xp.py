#exercise 1
class Pets():
    def __init__(self, animals):
        self.animals = animals

    def walk(self):
        for animal in self.animals:
            print(animal.walk())


class Cat():
    is_lazy = True

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def walk(self):
        return f'{self.name} is just walking around'


class Bengal(Cat):
    def sing(self, sounds):
        return f'{sounds}'


class Chartreux(Cat):
    def sing(self, sounds):
        return f'{sounds}'


# Step 1: Create the Siamese class
class Siamese(Cat):
    pass


# Step 2: Create cat instances
bengal_obj = Bengal("Leo", 3)
chartreux_obj = Chartreux("Milo", 5)
siamese_obj = Siamese("Luna", 2)

all_cats = [bengal_obj, chartreux_obj, siamese_obj]


# Step 3: Create a Pets instance
sara_pets = Pets(all_cats)


# Step 4: Take the cats for a walk
sara_pets.walk()

#exercise 2

class Dog:
    def __init__(self, name, age, weight):
        self.name = name
        self.age = age
        self.weight = weight

    def bark(self):
        return f"{self.name} is barking"

    def run_speed(self):
        return self.weight / self.age * 10

    def fight(self, other_dog):
        dog1_power = self.run_speed() * self.weight
        dog2_power = other_dog.run_speed() * other_dog.weight

        if dog1_power > dog2_power:
            return f"{self.name} wins the fight!"
        elif dog2_power > dog1_power:
            return f"{other_dog.name} wins the fight!"
        else:
            return "It's a tie!"


# Step 2: Create three dog instances
dog1 = Dog("Max", 3, 30)
dog2 = Dog("Rocky", 5, 25)
dog3 = Dog("Buddy", 2, 20)


# Step 3: Test the methods
print(dog1.bark())
print(dog2.bark())

print(dog1.run_speed())
print(dog2.run_speed())
print(dog3.run_speed())

print(dog1.fight(dog2))
print(dog2.fight(dog3))
print(dog1.fight(dog3))

#exercise 3
import random


# Step 2: Create the PetDog class
class PetDog(Dog):

    def __init__(self, name, age, weight):
        # Use super() to call the Dog constructor
        # Add the trained attribute here
        pass

    def train(self):
        # Print the dog's bark
        # Then change trained to True
        pass

    def play(self, *args):
        # args contains the other dog instances
        # Get their names and print:
        # "<dog_names> all play together"
        pass

    def do_a_trick(self):
        # Only do a trick if the dog is trained
        # Use random.choice() with the tricks list
        pass


# Step 3: Create PetDog instances
dog1 = PetDog("Fido", 2, 10)
dog2 = PetDog("Buddy", 3, 15)
dog3 = PetDog("Max", 4, 20)


# Step 4: Test the methods
dog1.train()

dog1.play(dog2, dog3)

dog1.do_a_trick()

#exercise 4
class Person:
    def __init__(self, first_name, age):
        self.first_name = first_name
        self.age = age
        self.last_name = ""

    def is_18(self):
        if self.age >= 18:
            return True
        else:
            return False


class Family:
    def __init__(self, last_name):
        self.last_name = last_name
        self.members = []

    def born(self, first_name, age):
        person = Person(first_name, age)
        person.last_name = self.last_name
        self.members.append(person)

    def check_majority(self, first_name):
        for person in self.members:
            if person.first_name == first_name:
                if person.is_18():
                    print("You are over 18, your parents Jane and John accept that you will go out with your friends")
                else:
                    print("Sorry, you are not allowed to go out with your friends.")

    def family_presentation(self):
        print(f"Family name: {self.last_name}")

        for person in self.members:
            print(f"{person.first_name}, {person.age} years old")


# Test the classes

my_family = Family("Smith")

my_family.born("John", 45)
my_family.born("Jane", 42)
my_family.born("Michael", 20)
my_family.born("Sarah", 15)

my_family.check_majority("Michael")
my_family.check_majority("Sarah")

my_family.family_presentation()