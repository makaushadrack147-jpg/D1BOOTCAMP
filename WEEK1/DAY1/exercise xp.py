#exercise 1
print("Hello world\nHello world\nHello world\nHello world")

#exercise 2
result = (99 ** 3) * 8
print(result)

#exercise 3
5 < 3          # False
3 == 3         # True
3 == "3"       # False
"3" > str(3)   # False
"Hello" == "hello"  # False

#exercise 4
computer_brand = "Lenovo"

print(f"I have a {computer_brand} computer.")

#exercise 5
name = "Shadrack"
age = 24
shoe_size = 40

info = f"My name is {name}, I am {age} years old, and my shoe size is {shoe_size}. I enjoy interacting with others and learning new things."

print(info)

#exercise 6
a = 10
b = 5

if a > b:
    print("Hello World")

#exercise 7
number = int(input("Enter a number: "))

if number % 2 == 0:
    print("The number is even.")
else:
    print("The number is odd.")

#exercise 8
name = input("What is your name? ")

if name.lower() == "shadrack":
    print("Whoa! We have the same name!")
else:
    print("Nice to meet you! Sadly, we don't have the same name.")

#exercise 9
height = input("Enter your height in cm: ")
height = int(height)

if height > 145:
    print("You are tall enough to ride.")
else:
    print("You need to grow some more to ride.")