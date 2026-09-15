#EXERCISE1
import math

# Fixed values
C = 50
H = 30

# Example input
numbers = "100,150,180"

# Split the numbers
D_values = numbers.split(",")

# Store results
results = []

# Calculate Q for each number
for D in D_values:
    D = int(D)

    Q = math.sqrt((2 * C * D) / H)

    results.append(str(int(Q)))

# Print the results
print("Input:", numbers)
print("Output:", ",".join(results))

#EXERCISE2
# List of numbers
numbers = [3, 47, 99, -80, 22, 97, 54, -23, 5, 7]

# 1. Print the list
print("1. List of numbers:")
print(numbers)

# 2. List sorted in descending order
print("\n2. Numbers in descending order:")
print(sorted(numbers, reverse=True))

# 3. Sum of all numbers
print("\n3. Sum of all numbers:")
print(sum(numbers))

# 4. First and last numbers
print("\n4. First and last numbers:")
print([numbers[0], numbers[-1]])

# 5. Numbers greater than 50
greater_than_50 = [num for num in numbers if num > 50]
print("\n5. Numbers greater than 50:")
print(greater_than_50)

# 6. Numbers smaller than 10
smaller_than_10 = [num for num in numbers if num < 10]
print("\n6. Numbers smaller than 10:")
print(smaller_than_10)

# 7. Numbers squared
squared_numbers = [num ** 2 for num in numbers]
print("\n7. Numbers squared:")
print(squared_numbers)

# 8. Numbers without duplicates
unique_numbers = list(set(numbers))
print("\n8. Numbers without duplicates:")
print(unique_numbers)
print("Number of unique numbers:", len(unique_numbers))

# 9. Average of all numbers
average = sum(numbers) / len(numbers)
print("\n9. Average:")
print(average)

# 10. Largest number
print("\n10. Largest number:")
print(max(numbers))

# 11. Smallest number
print("\n11. Smallest number:")
print(min(numbers))


# BONUS 1: Without using sum(), max(), min(), or len()
total = 0
count = 0
largest = numbers[0]
smallest = numbers[0]

for num in numbers:
    total += num
    count += 1

    if num > largest:
        largest = num

    if num < smallest:
        smallest = num

manual_average = total / count

print("\nBONUS - Without built-in functions:")
print("Sum:", total)
print("Average:", manual_average)
print("Largest:", largest)
print("Smallest:", smallest)


# BONUS 2: Ask the user for 10 numbers
user_numbers = []

print("\nBONUS 2 - Enter 10 numbers between -100 and 100:")

for i in range(10):
    while True:
        number = int(input(f"Enter number {i + 1}: "))

        if -100 <= number <= 100:
            user_numbers.append(number)
            break
        else:
            print("Please enter a number between -100 and 100.")

print("Your numbers are:")
print(user_numbers)


# BONUS 3: Generate 10 random numbers
import random

random_numbers = []

for i in range(10):
    random_numbers.append(random.randint(-100, 100))

print("\nBONUS 3 - Random numbers:")
print(random_numbers)


# BONUS 4: Random amount of numbers
amount = random.randint(50, 100)

random_list = []

for i in range(amount):
    random_list.append(random.randint(-100, 100))

print("\nBONUS 4 - Random amount of numbers:")
print("Amount of numbers:", amount)
print(random_list)


# BONUS 5: Will it work with a different number of random numbers?
print("\nBONUS 5:")
print("Yes, the code will work even when there are more or fewer than 10 numbers.")
#EXERCISE3
# Paragraph to analyze
paragraph = """
Technology can make learning more accessible and interesting for students.
Students can use computers and digital resources to research information, practice
skills, and work on projects. Technology also helps students collaborate with
teachers and classmates. When used responsibly, technology can support learning
and help students develop useful skills for the future.
"""

# 1. Number of characters
characters = len(paragraph)

# 2. Number of sentences
sentences = paragraph.count(".") + paragraph.count("!") + paragraph.count("?")

# 3. Number of words
words = paragraph.split()
number_of_words = len(words)

# 4. Number of unique words
unique_words = set(words)
number_of_unique_words = len(unique_words)

# 5. Non-whitespace characters
non_whitespace = len("".join(paragraph.split()))

# 6. Average words per sentence
average_words = number_of_words / sentences

# 7. Non-unique words
non_unique_words = number_of_words - number_of_unique_words

# Print the results
print("========== PARAGRAPH ANALYSIS ==========")
print("Characters:", characters)
print("Sentences:", sentences)
print("Words:", number_of_words)
print("Unique words:", number_of_unique_words)
print("Non-whitespace characters:", non_whitespace)
print("Average words per sentence:", round(average_words, 2))
print("Non-unique words:", non_unique_words)

#EXERCISE4
# Ask the user to enter a sentence
text = input("Enter your text: ")

# Split the text into words
words = text.split()

# Create an empty dictionary
frequency = {}

# Count each word
for word in words:
    if word in frequency:
        frequency[word] += 1
    else:
        frequency[word] = 1

# Print the words alphabetically
for word in sorted(frequency):
    print(f"{word}:{frequency[word]}")