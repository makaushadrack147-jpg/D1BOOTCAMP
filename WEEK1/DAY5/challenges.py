# Exercise 1

my_list = [1, 2, 4, 5]
index = 2
item = 3

my_list.insert(index, item)

print(my_list)


# Exercise 2

text = "Python is really fun"
spaces = 0

for char in text:
    if char == " ":
        spaces += 1

print(spaces)


# Exercise 3

text = "Hello World"
upper = 0
lower = 0

for char in text:
    if char.isupper():
        upper += 1
    elif char.islower():
        lower += 1

print("Uppercase:", upper)
print("Lowercase:", lower)


# Exercise 4

def my_sum(numbers):
    total = 0

    for number in numbers:
        total += number

    return total

print(my_sum([1, 5, 4, 2]))


# Exercise 5

def find_max(numbers):
    maximum = numbers[0]

    for number in numbers:
        if number > maximum:
            maximum = number

    return maximum

print(find_max([0, 1, 3, 50]))


# Exercise 6

def factorial(number):
    result = 1

    for i in range(1, number + 1):
        result *= i

    return result

print(factorial(4))


# Exercise 7

def list_count(items, target):
    count = 0

    for item in items:
        if item == target:
            count += 1

    return count

print(list_count(["a", "a", "t", "o"], "a"))


# Exercise 8

import math

def norm(numbers):
    total = 0

    for number in numbers:
        total += number ** 2

    return math.sqrt(total)

print(norm([1, 2, 2]))


# Exercise 9

def is_mono(numbers):
    ascending = True
    descending = True

    for i in range(len(numbers) - 1):
        if numbers[i] > numbers[i + 1]:
            ascending = False

        if numbers[i] < numbers[i + 1]:
            descending = False

    return ascending or descending

print(is_mono([7, 6, 5, 5, 2, 0]))
print(is_mono([2, 3, 3, 3]))
print(is_mono([1, 2, 0, 4]))


# Exercise 10

def longest_word(words):
    longest = words[0]

    for word in words:
        if len(word) > len(longest):
            longest = word

    print(longest)

longest_word(["cat", "elephant", "dog", "computer"])


# Exercise 11

items = [1, "hello", 2, "world", 3, "Python"]

integers = []
strings = []

for item in items:
    if isinstance(item, int):
        integers.append(item)
    elif isinstance(item, str):
        strings.append(item)

print("Integers:", integers)
print("Strings:", strings)


# Exercise 12

def is_palindrome(text):
    return text == text[::-1]

print(is_palindrome("radar"))
print(is_palindrome("John"))


# Exercise 13

def sum_over_k(sentence, k):
    words = sentence.split()
    count = 0

    for word in words:
        if len(word) > k:
            count += 1

    return count

sentence = "Do or do not there is no try"
k = 2

print(sum_over_k(sentence, k))


# Exercise 14

def dict_avg(dictionary):
    total = 0

    for value in dictionary.values():
        total += value

    return total / len(dictionary)

print(dict_avg({"a": 1, "b": 2, "c": 8, "d": 1}))


# Exercise 15

def common_div(number1, number2):
    divisors = []

    for i in range(1, min(number1, number2) + 1):
        if number1 % i == 0 and number2 % i == 0:
            divisors.append(i)

    return divisors

print(common_div(10, 20))


# Exercise 16

def is_prime(number):
    if number < 2:
        return False

    for i in range(2, number):
        if number % i == 0:
            return False

    return True

print(is_prime(11))


# Exercise 17

def weird_print(numbers):
    result = []

    for index in range(len(numbers)):
        if index % 2 == 0 and numbers[index] % 2 == 0:
            result.append(numbers[index])

    print(result)

weird_print([1, 2, 2, 3, 4, 5])


# Exercise 18

def type_count(**kwargs):
    counts = {}

    for value in kwargs.values():
        type_name = type(value).__name__

        if type_name in counts:
            counts[type_name] += 1
        else:
            counts[type_name] = 1

    for type_name, count in counts.items():
        print(f"{type_name}: {count}", end=", ")

type_count(a=1, b="string", c=1.0, d=True, e=False)


# Exercise 19

def my_split(text, separator=None):
    words = []
    current = ""

    for char in text:
        if separator is None:
            is_separator = char.isspace()
        else:
            is_separator = char == separator

        if is_separator:
            if current:
                words.append(current)
                current = ""
        else:
            current += char

    if current:
        words.append(current)

    return words

print(my_split("Hello world Python"))
print(my_split("apple,banana,orange", ","))


# Exercise 20

def password_format(text):
    return "*" * len(text)

print(password_format("mypassword"))