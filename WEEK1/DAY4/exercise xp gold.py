#exercise1
def get_age(year, month, day):
    current_year = 2026
    current_month = 8

    age = current_year - year

    # Check if the birthday has happened this year
    if month > current_month:
        age = age - 1

    return age


def can_retire(gender, date_of_birth):
    # Split the date of birth
    year, month, day = map(int, date_of_birth.split("/"))

    # Get the person's age
    age = get_age(year, month, day)

    # Retirement age
    if gender == "m":
        retirement_age = 67
    elif gender == "f":
        retirement_age = 62
    else:
        return False

    # Check if the person can retire
    if age >= retirement_age:
        return True
    else:
        return False


def run_exercise_1():
    gender = input("Enter your gender (m/f): ").lower()
    date_of_birth = input("Enter your date of birth (yyyy/mm/dd): ")
    result = can_retire(gender, date_of_birth)

    if result:
        print("You can retire.")
    else:
        print("You cannot retire yet.")

#exercise2
def calculate(X):
    x = str(X)

    result = int(x) + int(x * 2) + int(x * 3) + int(x * 4)

    return result


def run_exercise_2():
    number = int(input("Enter a number: "))
    answer = calculate(number)
    print(answer)

#exercise3

import random


def throw_dice():
    return random.randint(1, 6)


def throw_until_doubles():
    throws = 0

    while True:
        dice1 = throw_dice()
        dice2 = throw_dice()

        throws += 1

        if dice1 == dice2:
            break

    return throws


def main():
    results = []

    # Throw until doubles 100 times
    for i in range(100):
        throws = throw_until_doubles()
        results.append(throws)

    # Calculate total and average
    total_throws = sum(results)
    average_throws = total_throws / 100

    print("Total throws:", total_throws)
    print("Average throws to reach doubles:", round(average_throws, 2))


if __name__ == "__main__":
    exercise = input("Which exercise do you want to run (1, 2, or 3)? ")

    if exercise == "1":
        run_exercise_1()
    elif exercise == "2":
        run_exercise_2()
    elif exercise == "3":
        main()
    else:
        print("Please choose 1, 2, or 3.")