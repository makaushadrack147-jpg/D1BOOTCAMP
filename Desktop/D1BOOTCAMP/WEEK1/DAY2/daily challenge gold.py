from datetime import datetime

# Date of birth
birthdate = "16/04/2002"

# Convert the date
birth_date = datetime.strptime(birthdate, "%d/%m/%Y")
today = datetime.today()

# Calculate age
age = today.year - birth_date.year

# Check if birthday has happened this year
if (today.month, today.day) < (birth_date.month, birth_date.day):
    age -= 1

# Get the last digit of the age
candles = age % 10

# Create candles
candle_line = "i" * candles

# Display the information
print("Date of Birth: 16 April 2002")
print("Age:", age)

# Display the birthday cake
print()
print("       ___" + candle_line + "___")
print("      |:H:a:p:p:y:|")
print("    __|___________|__")
print("   |^^^^^^^^^^^^^^^^^|")
print("   |:B:i:r:t:h:d:a:y:|")
print("   |                 |")
print("   ~~~~~~~~~~~~~~~~~~~")

# Check if the birth year was a leap year
year = birth_date.year

if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("\nYou were born in a leap year!")
    print()
    print("       ___" + candle_line + "___")
    print("      |:H:a:p:p:y:|")
    print("    __|___________|__")
    print("   |^^^^^^^^^^^^^^^^^|")
    print("   |:B:i:r:t:h:d:a:y:|")
    print("   |                 |")
    print("   ~~~~~~~~~~~~~~~~~~~")