# Exercise 1
class Cat:
    def __init__(self, cat_name, cat_age):
        self.name = cat_name
        self.age = cat_age


# Step 1: Create three cat objects
cat1 = Cat("Whiskers", 5)
cat2 = Cat("Luna", 8)
cat3 = Cat("Simba", 3)


# Step 2: Create a function to find the oldest cat
def find_oldest_cat(cat1, cat2, cat3):
    oldest = cat1

    if cat2.age > oldest.age:
        oldest = cat2

    if cat3.age > oldest.age:
        oldest = cat3

    return oldest


# Step 3: Print the oldest cat's details
oldest_cat = find_oldest_cat(cat1, cat2, cat3)

print(f"The oldest cat is {oldest_cat.name}, and is {oldest_cat.age} years old.")

#exercise 2
class Dog:
    def __init__(self, name, height):
        self.name = name
        self.height = height

    def bark(self):
        print(f"{self.name} goes woof!")

    def jump(self):
        print(f"{self.name} jumps {self.height * 2} cm high!")


# Step 2: Create Dog objects
davids_dog = Dog("Rex", 50)
sarahs_dog = Dog("Buddy", 40)


# Step 3: Print dog details and call methods
print(f"David's dog is {davids_dog.name} and is {davids_dog.height} cm tall.")
davids_dog.bark()
davids_dog.jump()

print()

print(f"Sarah's dog is {sarahs_dog.name} and is {sarahs_dog.height} cm tall.")
sarahs_dog.bark()
sarahs_dog.jump()


# Step 4: Compare dog sizes
if davids_dog.height > sarahs_dog.height:
    print("David's dog is taller.")
elif sarahs_dog.height > davids_dog.height:
    print("Sarah's dog is taller.")
else:
    print("Both dogs are the same height.")

#exercise 3
class Song:
    def __init__(self, lyrics):
        self.lyrics = lyrics

    def sing_me_a_song(self):
        for line in self.lyrics:
            print(line)


# Create a Song object
stairway = Song([
    "There's a lady who's sure",
    "all that glitters is gold",
    "and she's buying a stairway to heaven"
])

# Print the lyrics
stairway.sing_me_a_song()

#exercise 4

class Zoo:
    def __init__(self, zoo_name):
        self.zoo_name = zoo_name
        self.animals = []
        self.groups = {}

    def add_animal(self, *new_animals):
        for animal in new_animals:
            if animal not in self.animals:
                self.animals.append(animal)

    def get_animals(self):
        print(self.animals)

    def sell_animal(self, animal_sold):
        if animal_sold in self.animals:
            self.animals.remove(animal_sold)

    def sort_animals(self):
        self.animals.sort()

        self.groups = {}

        for animal in self.animals:
            first_letter = animal[0].upper()

            if first_letter not in self.groups:
                self.groups[first_letter] = []

            self.groups[first_letter].append(animal)

        return self.groups

    def get_groups(self):
        for letter, animals in self.groups.items():
            print(f"{letter}: {animals}")


# Step 2: Create a Zoo object
brooklyn_safari = Zoo("Brooklyn Safari")


# Step 3: Add animals
brooklyn_safari.add_animal(
    "Giraffe",
    "Bear",
    "Baboon",
    "Cat",
    "Cougar",
    "Lion",
    "Zebra"
)


# Display all animals
print("Animals in the zoo:")
brooklyn_safari.get_animals()


# Sell an animal
print("\nAfter selling Bear:")
brooklyn_safari.sell_animal("Bear")
brooklyn_safari.get_animals()


# Sort and group animals
print("\nAnimal groups:")
brooklyn_safari.sort_animals()
brooklyn_safari.get_groups()