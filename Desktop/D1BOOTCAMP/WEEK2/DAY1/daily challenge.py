class Farm:

    def __init__(self, farm_name):
        self.name = farm_name
        self.animals = {}

    def add_animal(self, animal_type, count=1):
        if animal_type in self.animals:
            self.animals[animal_type] += count
        else:
            self.animals[animal_type] = count

    def get_info(self):
        info = f"{self.name}'s farm\n\n"

        for animal, count in self.animals.items():
            info += f"{animal} : {count}\n"

        info += "\n    E-I-E-I-0!"

        return info

    # Bonus
    def get_animal_types(self):
        return sorted(self.animals.keys())

    def get_short_info(self):
        animal_types = self.get_animal_types()

        animal_names = []

        for animal in animal_types:
            count = self.animals[animal]

            if count > 1:
                animal_names.append(animal + "s")
            else:
                animal_names.append(animal)

        if len(animal_names) == 1:
            animals = animal_names[0]

        elif len(animal_names) == 2:
            animals = f"{animal_names[0]} and {animal_names[1]}"

        else:
            animals = ", ".join(animal_names[:-1])
            animals += f" and {animal_names[-1]}"

        return f"{self.name}'s farm has {animals}."


# Test the code
macdonald = Farm("McDonald")

macdonald.add_animal("cow", 5)
macdonald.add_animal("sheep")
macdonald.add_animal("sheep")
macdonald.add_animal("goat", 12)

print(macdonald.get_info())

print()

print(macdonald.get_animal_types())

print()

print(macdonald.get_short_info())