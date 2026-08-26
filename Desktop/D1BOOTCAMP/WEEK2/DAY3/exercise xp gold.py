import datetime
import re

try:
    import holidays
except ModuleNotFoundError:
    holidays = None


# Exercise 1:
# Find the next upcoming holiday
# This function checks today's date and prints the next holiday in the future.
def upcoming_holiday():
    today = datetime.date.today()
    print("Today's date:", today)

    if holidays is not None:
        kenya_holidays = holidays.Kenya()
    else:
        kenya_holidays = {
            datetime.date(today.year, 1, 1): "New Year's Day",
            datetime.date(today.year, 5, 1): "Labour Day",
            datetime.date(today.year, 6, 1): "Madaraka Day",
            datetime.date(today.year, 12, 12): "Jamhuri Day",
            datetime.date(today.year, 12, 26): "Boxing Day",
        }

    # Go through all holidays and find the first one that is today or later.
    for holiday_date, holiday_name in sorted(kenya_holidays.items()):
        if holiday_date >= today:
            days_left = (holiday_date - today).days
            print("Next holiday:", holiday_name)
            print("Date:", holiday_date)
            print("Time left:", days_left, "days")
            break
    else:
        print("No upcoming holiday found this year.")


# Exercise 2
# Convert age in seconds to age on each planet
# We use Earth years as the base, then divide by each planet's orbital period.
def planet_age(age_in_seconds):
    earth_year_in_seconds = 31557600
    earth_age = age_in_seconds / earth_year_in_seconds

    planets = {
        "Earth": 1,
        "Mercury": 0.2408467,
        "Venus": 0.61519726,
        "Mars": 1.8808158,
        "Jupiter": 11.862615,
        "Saturn": 29.447498,
        "Uranus": 84.016846,
        "Neptune": 164.79132,
    }

    print(f"Age in Earth years: {earth_age:.2f}")

    for planet_name, orbital_period in planets.items():
        age_on_planet = earth_age / orbital_period
        print(f"{planet_name}: {age_on_planet:.2f} years")

# Exercise 3
# Extract all digits from a string
# The regex \d means: find any number from 0 to 9.
def return_numbers(string):
    digits = re.findall(r"\d", string)
    return "".join(digits)


# Main function: this is the part that runs when we execute the file.
def main():
    print("\n--- Exercise 1 ---")
    upcoming_holiday()

    print("\n--- Exercise 2 ---")
    planet_age(1000000000)

    print("\n--- Exercise 3 ---")
    result = return_numbers("k5k3q2g5z6x9bn")
    print(f"Numbers extracted: {result}")


# This ensures the program only runs when the file is executed directly.
if __name__ == "__main__":
    main()

# Exercise 4

def validate_name(name):
    # Pattern: Capital letter + lowercase, one space, capital letter + lowercase
    pattern = r"^[A-Z][a-z]+\s[A-Z][a-z]+$"
    
    if re.match(pattern, name):
        return True
    return False

if __name__ == "__main__":
    user_input = input("Enter your full name (John Doe): ")

    if validate_name(user_input):
        print("Valid name!")
    else:
        print("Invalid name. Please use 'Firstname Lastname' with correct capitalization.")

        #exercise 5
import random
import string
import re

def is_valid(password, length):
    """Test function to ensure password meets all criteria."""
    if len(password) != length:
        return False
    if not re.search(r"\d", password): return False           # Has digit
    if not re.search(r"[a-z]", password): return False        # Has lowercase
    if not re.search(r"[A-Z]", password): return False        # Has uppercase
    if not re.search(r"[!@#$%^&*_]", password): return False  # Has special char
    return True

def generate_password(length):
    """Generates a password meeting all requirements."""
    if length < 4:
        raise ValueError("Password length must be at least 4.")

    # Ensure at least one of each required type
    chars = [
        random.choice(string.digits),
        random.choice(string.ascii_lowercase),
        random.choice(string.ascii_uppercase),
        random.choice("!@#$%^&*_")
    ]
    
    # Fill remaining length randomly
    all_chars = string.ascii_letters + string.digits + "!@#$%^&*"
    chars += [random.choice(all_chars) for _ in range(length - 4)]
    
    # Shuffle to ensure the forced characters aren't always at the start
    random.shuffle(chars)
    return "".join(chars)

def run_tests():
    """Runs the 100-test requirement."""
    for _ in range(100):
        length = random.randint(6, 30)
        pwd = generate_password(length)
        assert is_valid(pwd, length), f"Test failed for length {length}: {pwd}"
    print("All 100 tests passed successfully!")

# Execution
if __name__ == "__main__":
    # 1. Run the test suite first
    run_tests()
    
    # 2. Ask user for input with validation loop
    while True:
        try:
            val = int(input("Enter desired password length (6-30): "))
            if 6 <= val <= 30:
                password = generate_password(val)
                print(f"\nYour new password is: {password}")
                print("Keep this password in a safe place!\n")
                break
            else:
                print("Invalid length. Please enter a number between 6 and 30.")
        except ValueError:
            print("Invalid input. Please enter a numerical digit.")