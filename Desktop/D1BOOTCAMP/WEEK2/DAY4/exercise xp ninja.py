#exercise 1

import json
import re

# Open the JSON file
with open("menu.json", "r") as file:
    menu = json.load(file)

# Ask the manager for a Valentine item
name = input("Enter the Valentine item name: ")
price = input("Enter the price (example: 14,14): ")

# Rules for the name
name_correct = (
    name.startswith("V")
    and re.fullmatch(r"[A-Z][a-z]*(?: (?:of|and|the|with|for|in) )?[A-Z][a-z-]*(?: (?:of|and|the|with|for|in) [A-Z][a-z-]*)*", name)
    and len(re.findall("e", name.lower())) >= 2
    and not re.search(r"\d", name)
)

# Rule for the price
price_correct = re.fullmatch(r"\d\d,14", price)

# Check everything
if name_correct and price_correct:
    item = {
        "name": name,
        "price": price
    }

    menu["valentines"].append(item)

    # Save back to JSON
    with open("menu.json", "w") as file:
        json.dump(menu, file, indent=4)

    print("Valentine item added successfully!")

else:
    print("Invalid item!")
    
# Display the menu
print("\nVALENTINE'S MENU")

for item in menu["menu"]:
    print(item["name"], "-", item["price"])

for item in menu["valentines"]:
    print(item["name"], "-", item["price"])

# Heart made of stars
print("\n   **   **")
print("  **** ****")
print(" ***********")
print("  *********")
print("   *******")
print("    *****")
print("     ***")
print("      *")

#exercise 2

import random
import json


# Character class
class Character:

    def __init__(self, name, age):
        self.name = name
        self.age = age

        # Create the 6 abilities
        self.strength = self.roll_dice()
        self.dexterity = self.roll_dice()
        self.constitution = self.roll_dice()
        self.intelligence = self.roll_dice()
        self.wisdom = self.roll_dice()
        self.charisma = self.roll_dice()

    # Roll 4 dice and add the largest 3
    def roll_dice(self):
        dice = []

        for i in range(4):
            dice.append(random.randint(1, 6))

        dice.sort()

        return dice[1] + dice[2] + dice[3]

    # Convert character to a dictionary
    def to_dict(self):
        return {
            "name": self.name,
            "age": self.age,
            "strength": self.strength,
            "dexterity": self.dexterity,
            "constitution": self.constitution,
            "intelligence": self.intelligence,
            "wisdom": self.wisdom,
            "charisma": self.charisma
        }


# Game class
class Game:

    def __init__(self):
        self.characters = []

    # Create characters
    def create_characters(self):
        players = int(input("How many players are playing? "))

        for i in range(players):
            print("\nPlayer", i + 1)

            name = input("Enter character name: ")
            age = int(input("Enter character age: "))

            character = Character(name, age)

            self.characters.append(character)

    # Export to JSON
    def export_json(self):
        data = []

        for character in self.characters:
            data.append(character.to_dict())

        with open("characters.json", "w") as file:
            json.dump(data, file, indent=4)

    # Export to TXT
    def export_txt(self):
        with open("characters.txt", "w") as file:

            for character in self.characters:
                file.write("DUNGEONS & DRAGONS CHARACTER\n")
                file.write("-----------------------------\n")
                file.write("Name: " + character.name + "\n")
                file.write("Age: " + str(character.age) + "\n")
                file.write("Strength: " + str(character.strength) + "\n")
                file.write("Dexterity: " + str(character.dexterity) + "\n")
                file.write("Constitution: " + str(character.constitution) + "\n")
                file.write("Intelligence: " + str(character.intelligence) + "\n")
                file.write("Wisdom: " + str(character.wisdom) + "\n")
                file.write("Charisma: " + str(character.charisma) + "\n")
                file.write("\n")


# Start the game
game = Game()

game.create_characters()
game.export_json()
game.export_txt()

print("\nCharacters created successfully!")
print("characters.json was created.")
print("characters.txt was created.")


