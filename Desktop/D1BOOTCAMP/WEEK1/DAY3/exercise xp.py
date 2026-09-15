#exercise 1
keys = ['Ten', 'Twenty', 'Thirty']
values = [10, 20, 30]

# Convert the two lists into a dictionary
result = dict(zip(keys, values))

# Print the dictionary
print(result)

#exercise 2
family = {
    "rick": 43,
    "beth": 13,
    "morty": 5,
    "summer": 8
}

total_cost = 0

for name, age in family.items():

    if age < 3:
        price = 0
    elif age <= 12:
        price = 10
    else:
        price = 15

    print(name, "is", age, "years old - Ticket price: $", price)

    total_cost += price

print("----------------------------")
print("Total cost: $", total_cost)

#exercise 3
# Create the Zara brand dictionary
brand = {
    "name": "Zara",
    "creation_date": 1975,
    "creator_name": "Amancio Ortega Gaona",
    "type_of_clothes": ["men", "women", "children", "home"],
    "international_competitors": ["Gap", "H&M", "Benetton"],
    "number_stores": 7000,
    "major_color": {
        "France": ["blue"],
        "Spain": ["red"],
        "US": ["pink", "green"]
    }
}

# Change number_stores to 2
brand["number_stores"] = 2

# Print a sentence describing Zara's clients
print("Zara's clients can shop for:", brand["type_of_clothes"])

# Add country_creation
brand["country_creation"] = "Spain"

# Check if international_competitors exists
if "international_competitors" in brand:
    brand["international_competitors"].append("Desigual")

# Delete creation_date
brand.pop("creation_date")

# Print the last international competitor
print("Last international competitor:",
      brand["international_competitors"][-1])

# Print the major colors in the US
print("Major colors in the US:",
      brand["major_color"]["US"])

# Print the number of keys
print("Number of keys:", len(brand))

# Print all keys
print("All keys:")
for key in brand.keys():
    print(key)

# Bonus
more_on_zara = {
    "creation_date": 1975,
    "number_stores": 10000
}

# Merge more_on_zara with brand
brand.update(more_on_zara)

# Print the final dictionary
print("\nFinal Zara dictionary:")
print(brand)

#exercise 4
users = ["Mickey", "Minnie", "Donald", "Ariel", "Pluto"]

# 1. Character → Index
character_to_index = {}

for index, character in enumerate(users):
    character_to_index[character] = index

print("1. Character to index:")
print(character_to_index)


# 2. Index → Character
index_to_character = {}

for index, character in enumerate(users):
    index_to_character[index] = character

print("\n2. Index to character:")
print(index_to_character)


# 3. Alphabetically sorted characters → Index
sorted_users = sorted(users)

alphabetical_dictionary = {}

for index, character in enumerate(sorted_users):
    alphabetical_dictionary[character] = index

print("\n3. Alphabetically sorted:")
print(alphabetical_dictionary)