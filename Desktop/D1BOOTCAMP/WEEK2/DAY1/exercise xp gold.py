#exercise 1
import math

class Circle:

    def __init__(self, radius=1.0):
        self.radius = radius

    def perimeter(self):
        return 2 * math.pi * self.radius

    def area(self):
        return math.pi * self.radius ** 2

    def definition(self):
        print("A circle is a round shape where every point on its edge is the same distance from the center.")


# Create a Circle object
circle = Circle(5)

# Display the perimeter
print("Perimeter:", circle.perimeter())

# Display the area
print("Area:", circle.area())

# Display the definition
circle.definition()

#exercise 2
import random

class MyList:

    def __init__(self, letters):
        self.letters = letters

    def reversed_list(self):
        return self.letters[::-1]

    def sorted_list(self):
        return sorted(self.letters)

    def random_list(self):
        return [random.randint(1, 100) for _ in self.letters]


# Create a MyList object
mylist = MyList(["d", "a", "c", "b"])

print("Original list:", mylist.letters)
print("Reversed list:", mylist.reversed_list())
print("Sorted list:", mylist.sorted_list())
print("Random list:", mylist.random_list())

#exercise 3
class MenuManager:

    def __init__(self):
        self.menu = [
            {
                "name": "Soup",
                "price": 10,
                "spice": "B",
                "gluten": False
            },
            {
                "name": "Hamburger",
                "price": 15,
                "spice": "A",
                "gluten": True
            },
            {
                "name": "Salad",
                "price": 18,
                "spice": "A",
                "gluten": False
            },
            {
                "name": "French Fries",
                "price": 5,
                "spice": "C",
                "gluten": False
            },
            {
                "name": "Beef bourguignon",
                "price": 25,
                "spice": "B",
                "gluten": True
            }
        ]

    def add_item(self, name, price, spice, gluten):
        new_dish = {
            "name": name,
            "price": price,
            "spice": spice,
            "gluten": gluten
        }

        self.menu.append(new_dish)
        print("Dish added successfully.")

    def update_item(self, name, price, spice, gluten):
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                dish["price"] = price
                dish["spice"] = spice
                dish["gluten"] = gluten
                print("Dish updated successfully.")
                return

        print("Dish is not in the menu.")

    def remove_item(self, name):
        for dish in self.menu:
            if dish["name"].lower() == name.lower():
                self.menu.remove(dish)
                print("Dish removed successfully.")
                print(self.menu)
                return

        print("Dish is not in the menu.")


# Create the MenuManager object
menu_manager = MenuManager()

# Add a new dish
menu_manager.add_item("Pizza", 20, "B", True)

# Update a dish
menu_manager.update_item("Soup", 12, "A", False)

# Remove a dish
menu_manager.remove_item("Salad")