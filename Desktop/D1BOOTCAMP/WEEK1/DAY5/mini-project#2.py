import random

wordslist = ['correction', 'childish', 'beach', 'python', 'assertive',
             'interference', 'complete', 'share', 'credit card', 'rush', 'south']

word = random.choice(wordslist)

# Create the hidden word
hidden_word = ""
for letter in word:
    if letter == " ":
        hidden_word += " "
    else:
        hidden_word += "*"

guessed_letters = []
wrong_guesses = 0

body_parts = [
    "head",
    "body",
    "left arm",
    "right arm",
    "left leg",
    "right leg"
]


def show_word():
    print("\nWord:", hidden_word)


def update_word(letter):
    global hidden_word

    new_word = ""

    for i in range(len(word)):
        if word[i] == letter:
            new_word += letter
        else:
            new_word += hidden_word[i]

    hidden_word = new_word


print("🎮 Welcome to Hangman!")
print("Guess the word one letter at a time.")

while wrong_guesses < 6 and "*" in hidden_word:

    show_word()
    print("Guessed letters:", guessed_letters)
    print("Wrong guesses:", wrong_guesses, "/ 6")

    guess = input("Guess a letter: ").lower()

    # Check if the player entered a single letter
    if len(guess) != 1 or not guess.isalpha():
        print("Please enter one letter.")
        continue

    # Check if the letter was already guessed
    if guess in guessed_letters:
        print("You already guessed that letter!")
        continue

    guessed_letters.append(guess)

    # Correct guess
    if guess in word:
        print(" Correct!")
        update_word(guess)

    # Wrong guess
    else:
        print(" Wrong guess!")
        print("You added:", body_parts[wrong_guesses])
        wrong_guesses += 1


# Game results
if "*" not in hidden_word:
    print("\n You won!")
    print("The word was:", word)
else:
    print("\n You lost!")
    print("The word was:", word)