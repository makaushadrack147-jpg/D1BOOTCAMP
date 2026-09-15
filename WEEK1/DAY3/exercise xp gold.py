#exercise 1

# Create a dictionary with 5 people's birthdays
birthdays = {
    "Bahati": "2002/04/16",
    "Shadrack": "2001/08/20",
    "John": "2000/05/12",
    "Mary": "1978/09/25",
    "David": "2006/11/30"
}

# Welcome message
print("Welcome to the Birthday Look-up!")
print("You can look up the birthdays of the people in the list!")

# Ask the user for a person's name
name = input("Enter the person's name: ")

# Look up the birthday
if name in birthdays:
    print(f"{name}'s birthday is {birthdays[name]}.")
else:
    print("Sorry, that person is not in the list.")

    #exercise 2
    # Exercise 1: Birthday Look-up

# Create a dictionary with 5 people's birthdays
birthdays = {
    "Bahati": "2002/04/16",
    "Shadrack": "2001/08/20",
    "John": "2000/05/12",
    "Mary": "1978/09/25",
    "David": "2006/11/30"
}

# Welcome message
print("Welcome to the Birthday Look-up!")
print("You can look up the birthdays of the people in the list!")

# Print all the names in the dictionary
print("\nPeople in the birthday list:")

for name in birthdays:
    print(name)

# Ask the user for a person's name
person = input("\nEnter the person's name: ")

# Look up the birthday
if person in birthdays:
    print(f"{person}'s birthday is {birthdays[person]}.")
else:
    print(f"Sorry, we don't have the birthday information for {person}")

    # Exercise 3: Add and look up a birthday
    print("\nPeople currently in the birthday list:")
    for person in birthdays:
        print(person)

    new_name = input("\nEnter the new person's name: ")
    new_birthday = input("Enter the person's birthday (YYYY/MM/DD): ")
    birthdays[new_name] = new_birthday
    print(f"{new_name} has been added successfully!")

    print("\nUpdated birthday list:")
    for person in birthdays:
        print(person)

    lookup_name = input("\nEnter a person's name to look up: ")
    if lookup_name in birthdays:
        print(f"{lookup_name}'s birthday is {birthdays[lookup_name]}.")
    else:
        print("Sorry, that person is not in the list.")

        #exercise 4: 
        # Exercise: Items and Prices

# Part 1
items = {
    "banana": 4,
    "apple": 2,
    "orange": 1.5,
    "pear": 3
}

print("Items and their prices:")

for item, price in items.items():
    print(f"The price of a {item} is ${price}.")


# Part 2
items = {
    "banana": {"price": 4, "stock": 10},
    "apple": {"price": 2, "stock": 5},
    "orange": {"price": 1.5, "stock": 24},
    "pear": {"price": 3, "stock": 1}
}

# Calculate the total cost of everything in stock
total_cost = 0

for item, details in items.items():
    price = details["price"]
    stock = details["stock"]

    total_cost = total_cost + (price * stock)

print("\nTotal cost of everything in stock: $", total_cost)