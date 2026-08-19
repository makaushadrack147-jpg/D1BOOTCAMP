import random

# The string
user_string = "bahatirama"

# Check the length
if len(user_string) < 10:
    print("String not long enough.")

elif len(user_string) > 10:
    print("String too long.")

else:
    print("Perfect string")

    # Print the first and last characters
    print("First character:", user_string[0])
    print("Last character:", user_string[-1])

    # Build the string character by character
    print("Building the string:")

    for i in range(1, len(user_string) + 1):
        print(user_string[:i])

    # Bonus: Jumble the string
    characters = list(user_string)
    random.shuffle(characters)

    jumbled_string = "".join(characters)

    print("Jumbled string:", jumbled_string)