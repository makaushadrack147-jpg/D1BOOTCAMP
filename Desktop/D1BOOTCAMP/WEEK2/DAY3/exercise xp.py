#exercise 1

class Currency:
    def __init__(self, currency, amount):
        self.currency = currency
        self.amount = amount

    def __str__(self):
        # Add "s" when amount is not 1
        if self.amount == 1:
            return f"{self.amount} {self.currency}"
        return f"{self.amount} {self.currency}s"

    def __repr__(self):
        return self.__str__()

    def __int__(self):
        return self.amount

    def __add__(self, other):
        if isinstance(other, int):
            return self.amount + other

        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f"Cannot add between Currency type <{self.currency}> "
                    f"and <{other.currency}>"
                )
            return self.amount + other.amount

        raise TypeError("Can only add integers or Currency objects")

    def __iadd__(self, other):
        if isinstance(other, int):
            self.amount += other
            return self

        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(
                    f"Cannot add between Currency type <{self.currency}> "
                    f"and <{other.currency}>"
                )
            self.amount += other.amount
            return self

        raise TypeError("Can only add integers or Currency objects")


c1 = Currency('dollar', 5)
c2 = Currency('dollar', 10)
c3 = Currency('shekel', 1)
c4 = Currency('shekel', 10)

print(c1)
print(int(c1))
print(repr(c1))

print(c1 + 5)
print(c1 + c2)

print(c1)

c1 += 5
print(c1)

c1 += c2
print(c1)

# Uncomment this to test the TypeError:
# print(c1 + c3)

#exercise 2
def sum_numbers(a, b):
    result = a + b
    print(result)

sum_numbers(5, 10)

#exercise 3
import string
import random

# Create a string containing uppercase and lowercase letters
letters = string.ascii_letters

# Generate a random string of 5 characters
random_string = ""

for i in range(5):
    random_string += random.choice(letters)

print(random_string)

#exercise 4
import datetime

def display_current_date():
    current_date = datetime.date.today()
    print(current_date)

display_current_date()

#exercise 5
import datetime

def time_until_january_first():
    # Get the current date and time
    now = datetime.datetime.now()

    # Create January 1st of the next year
    january_first = datetime.datetime(now.year + 1, 1, 1)

    # Calculate the difference
    time_left = january_first - now

    # Display the result
    print("Time left until January 1st:")
    print(time_left)

time_until_january_first()

#exercise 6
import datetime

def minutes_between_dates(date1, date2):
    start_date = datetime.datetime.strptime(date1, "%d-%B-%Y")
    end_date = datetime.datetime.strptime(date2, "%d-%B-%Y")

    difference = end_date - start_date

    minutes = difference.total_seconds() / 60

    print(f"The difference is {int(minutes)} minutes.")


minutes_between_dates("16-April-2007", "16-April-2020")

#exercise 7
from faker import Faker

faker = Faker()

users = []

def add_users(number):
    for i in range(number):
        user = {
            "name": faker.name(),
            "address": faker.address(),
            "language_code": faker.language_code()
        }

        users.append(user)


# Generate 5 fake users
add_users(5)

# Print the users
print(users)