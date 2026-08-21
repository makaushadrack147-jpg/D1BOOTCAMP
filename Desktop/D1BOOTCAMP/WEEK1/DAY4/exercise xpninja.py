#exercise1
def get_full_name(first_name, last_name, middle_name=""):
    if middle_name:
        return first_name.title() + " " + middle_name.title() + " " + last_name.title()
    else:
        return first_name.title() + " " + last_name.title()


print(get_full_name(first_name="john", middle_name="hooker", last_name="lee"))
print(get_full_name(first_name="bruce", last_name="lee"))

#exercise2
morse_code = {
    "A": ".-",    "B": "-...",  "C": "-.-.",  "D": "-..",
    "E": ".",     "F": "..-.",  "G": "--.",   "H": "....",
    "I": "..",    "J": ".---",  "K": "-.-",   "L": ".-..",
    "M": "--",    "N": "-.",    "O": "---",   "P": ".--.",
    "Q": "--.-",  "R": ".-.",   "S": "...",   "T": "-",
    "U": "..-",   "V": "...-",  "W": ".--",   "X": "-..-",
    "Y": "-.--",  "Z": "--.."
}


def english_to_morse(text):
    words = text.upper().split()
    result = []

    for word in words:
        morse_word = " ".join(morse_code[letter] for letter in word)
        result.append(morse_word)

    return " / ".join(result)


def morse_to_english(morse):
    reverse_code = {value: key for key, value in morse_code.items()}

    words = morse.split(" / ")
    result = []

    for word in words:
        letters = word.split()
        english_word = "".join(reverse_code[letter] for letter in letters)
        result.append(english_word)

    return " ".join(result)


# Examples
text = "HELLO WORLD"

morse = english_to_morse(text)
print(morse)

print(morse_to_english(morse))

#exercise3
def box_printer(*args):
    longest = max(len(word) for word in args)

    print("*" * (longest + 4))

    for word in args:
        print("* " + word.ljust(longest) + " *")

    print("*" * (longest + 4))


box_printer("Hello", "World", "in", "reallylongword", "a", "frame")

#exercise4
def insertion_sort(alist):
    for index in range(1, len(alist)):
        currentvalue = alist[index]
        position = index

        while position > 0 and alist[position - 1] > currentvalue:
            alist[position] = alist[position - 1]
            position -= 1

        alist[position] = currentvalue


alist = [54, 26, 93, 17, 77, 31, 44, 55, 20]

insertion_sort(alist)

print(alist)