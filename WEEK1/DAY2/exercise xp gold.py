# Exercise 1
list1 = [1, 2, 3]
list2 = [4, 5, 6]

list1.extend(list2)

print(list1)

# Exercise 2
for number in range(1500, 2501):
    if number % 5 == 0 and number % 7 == 0:
        print(number)

# Exercise 3
names = ['Samus', 'Cortana', 'V', 'Link', 'Mario', 'Cortana', 'Samus']

name = input("Enter a name: ")

if name in names:
    print("The index is:", names.index(name))
else:
    print("kelvin.")
# Exercise 4
number1 = int(input("Input the 1st number: "))
number2 = int(input("Input the 2nd number: "))
number3 = int(input("Input the 3rd number: "))

if number1 >= number2 and number1 >= number3:
    greatest = number1
elif number2 >= number1 and number2 >= number3:
    greatest = number2
else:
    greatest = number3

print("The greatest number is:", greatest)

# Exercise 5
alphabet = "abcdefghijklmnopqrstuvwxyz"

for letter in alphabet:
    if letter in "aeiou":
        print(letter, "is a vowel")
    else:
        print(letter, "is a consonant")

    # Exercise 6: Words and Letters

# 7 example words
words = [
    "apple",
    "banana",
    "orange",
    "mango",
    "computer",
    "python",
    "school"
]
letter = "a"

print("Words:")
print(words)

print("\nLetter:", letter)

print("\nResults:")

for word in words:
    if letter in word:
        index = word.index(letter)
        print("The letter", letter, "is at index", index, "in", word)
    else:
        print("The letter", letter, "is not found in", word)

        #exercise 7: Count the Vowels

        # Create a list of numbers from 1 to 1,000
numbers = list(range(1, 1001))

# Check the smallest and largest numbers
print("Smallest number:", min(numbers))
print("Largest number:", max(numbers))

# Calculate the sum of all numbers
total = sum(numbers)

print("Sum of all numbers:", total)

#exercise 8: 
numbers = "34,67,55,33,12,98"

my_list = numbers.split(",")

my_tuple = tuple(my_list)

print(my_list)
print(my_tuple)

#exercise 9:
import random

# Start the score at 0
wins = 0
losses = 0

print("===== NUMBER GUESSING GAME =====")
print("Guess a number from 1 to 9.")
print("Type 'q' if you want to quit.")

while True:

    # Ask the user to enter a guess
    user_input = input("\nEnter your guess: ")

    # Check if the user wants to quit
    if user_input.lower() == "q":
        break

    # Convert the user's guess into a number
    guess = int(user_input)

    # Generate a random number from 1 to 9
    random_number = random.randint(1, 9)

    # Show the random number
    print("The random number was:", random_number)

    # Check if the guess is correct
    if guess == random_number:
        print("Winner!")
        wins = wins + 1
    else:
        print("Better luck next time!")
        losses = losses + 1

# Display the final score
print("\n===== GAME OVER =====")
print("Total games won:", wins)
print("Total games lost:", losses)