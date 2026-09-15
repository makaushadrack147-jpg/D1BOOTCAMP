# exercise 1

import json
import random
from pathlib import Path


DEFAULT_WORDS = [
    "python",
    "coding",
    "bootcamp",
    "challenge",
    "student",
    "logic",
    "practice",
    "data",
    "learning",
    "happy",
    "creative",
    "random",
    "sentence",
    "word",
    "list",
]


def get_words_from_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
    except FileNotFoundError:
        return DEFAULT_WORDS

    words = content.split()
    return words if words else DEFAULT_WORDS


def get_random_sentence(length):
    words = get_words_from_file(Path(__file__).with_name("words.txt"))

    if not words:
        words = DEFAULT_WORDS

    selected_words = [random.choice(words) for _ in range(length)]
    sentence = " ".join(selected_words)
    return sentence.lower()


def run_exercise_1():
    print("This program generates a random sentence from a word list.")
    print("The sentence must contain between 2 and 20 words.")

    try:
        length = int(input("Enter the sentence length (2-20): "))

        if length < 2 or length > 20:
            print("Error: Please enter a number between 2 and 20.")
            return

        sentence = get_random_sentence(length)
        print("Random sentence:")
        print(sentence)

    except ValueError:
        print("Error: Please enter a valid integer.")


# exercise 2

def run_exercise_2():
    sample_json = """{
       "company":{
          "employee":{
             "name":"emma",
             "payable":{
                "salary":7000,
                "bonus":800
             }
          }
       }
    }"""

    data = json.loads(sample_json)
    salary = data["company"]["employee"]["payable"]["salary"]
    print(f"Salary: {salary}")

    data["company"]["employee"]["birth_date"] = "1995-05-20"

    with open("modified_data.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

    print("Modified JSON saved to 'modified_data.json'.")


if __name__ == "__main__":
    run_exercise_1()
    run_exercise_2()