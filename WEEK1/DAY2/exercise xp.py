#exercise 1
# Create a set of my favorite numbers
my_fav_numbers = {7, 14, 21, 28}

# Add two new numbers
my_fav_numbers.add(35)
my_fav_numbers.add(42)

print("After adding two numbers:", my_fav_numbers)

# Remove the last number added
my_fav_numbers.remove(42)

print("After removing one number:", my_fav_numbers)

# Create a set of my friend's favorite numbers
friend_fav_numbers = {5, 10, 15, 20}

# Combine both sets using union
our_fav_numbers = my_fav_numbers.union(friend_fav_numbers)

print("Our favorite numbers:", our_fav_numbers)

#exercise 2
# Create a tuple of integers
numbers = (1, 2, 3, 4)

print("Original tuple:", numbers)

# Add another number by creating a new tuple
numbers = numbers + (5,)
print("Updated tuple:", numbers)

#exercise 3
basket = ["Orange", "Banana", "Mango", "Avocado"]

# Remove Banana
basket.remove("Banana")

# Remove Avocado
basket.remove("Avocado")

# Add Kiwi to the end
basket.append("Kiwi")

# Add Orange to the beginning
basket.insert(0, "Orange")

# Count how many times Orange appears
print("Orange count:", basket.count("Orange"))

# Empty the list
basket.clear()

# Print the final state
print("Final basket:", basket)

#exercise 4
# A float is a number with a decimal point, such as 1.5 or 2.5.
# An integer is a whole number, such as 2, 3, or 4.

numbers = []

# Generate numbers from 1.5 to 5 in steps of 0.5
for i in range(3, 11):
    numbers.append(i / 2)

print(numbers)

#exercise 5
# Print all numbers from 1 to 20
for number in range(1, 21):
    print(number)

print("Even numbers:")

# Print numbers from 1 to 20 where the index is even
for index in range(1, 21):
    if index % 2 == 0:
        print(index)

        #exercise 6
      # Initial prompt outside the loop
name = input("Enter your name: ")

while True:
    # Check if the name contains digits or is fewer than 3 characters long
    if name.isdigit() or len(name) < 3:
        name = input("give the correct name: ")
    else:
        print("thank you")
        break

    #exercise 7
# Favorite Fruits Program

# Ask the user to enter their favorite fruits
favorite_fruits = input(
    "Enter your favorite fruits (orange, mango, kiwi, banana): "
)

# Convert the input into a list
favorite_fruits = favorite_fruits.split()

# Ask the user to enter any fruit
chosen_fruit = input("Enter the name of any fruit: ")

# Check if the chosen fruit is in the favorite fruits list
if chosen_fruit in favorite_fruits:
    print("You chose one of your favorite fruits! Enjoy!")
else:
    print("You chose a new fruit. I hope you enjoy it!")

    #exercise 8
    # Pizza Toppings Program

# List of pizza toppings
toppings = ["jalapenos", "mushroom", "cheese", "sauce"]

# Base price
base_price = 10.00

# Price for each topping
topping_price = 2.50

# Empty list to store the toppings chosen
chosen_toppings = []

# Ask the user to enter toppings
while True:
    topping = input(
        "Enter a topping (jalapenos, mushroom, cheese, sauce) "
        "or type 'quit' to finish: "
    )

    if topping.lower() == "quit":
        break

    # Check if the topping is available
    if topping.lower() in toppings:
        chosen_toppings.append(topping.lower())
        print(f"Adding {topping} to your pizza.")
    else:
        print("Sorry, that topping is not available.")

# Calculate the total cost
total_cost = base_price + (len(chosen_toppings) * topping_price)

# Display the toppings
print("\nYour pizza toppings are:")

for topping in chosen_toppings:
    print(f"- {topping}")

# Display the total cost
print(f"\nBase price: ${base_price:.2f}")
print(f"Number of toppings: {len(chosen_toppings)}")
print(f"Total cost: ${total_cost:.2f}")
#exercise 9
# Family Movie Ticket Program

# List of family ages based on the example
ages = [2, 8, 15, 20]

# Initialize total cost counter
total_cost = 0

# Loop through each age to determine ticket pricing
for age in ages:
    if age < 3:
        total_cost += 0
    elif 3 <= age <= 12:
        total_cost += 10
    else:
        total_cost += 15

# Output the total ticket cost
print(f"Family ages: {ages}")
print(f"Total ticket cost: ${total_cost}")