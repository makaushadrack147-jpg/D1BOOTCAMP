#challenge1
number = int(input("Enter a number: "))
length = int(input("Enter the length: "))

multiples = []

for i in range(1, length + 1):
    multiples.append(number * i)

print(multiples)

#challenge2
word = input("Enter a word: ")

result = ""

for letter in word:
    if result == "" or letter != result[-1]:
        result += letter

print("Result:", result)