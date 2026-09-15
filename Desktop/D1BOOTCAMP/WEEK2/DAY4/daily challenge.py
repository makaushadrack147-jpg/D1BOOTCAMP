import string
import re


class Text:
    def __init__(self, text):
        self.text = text

    def word_frequency(self, word):
        words = self.text.split()
        count = words.count(word)

        if count == 0:
            return None
        return count

    def most_common_word(self):
        words = self.text.split()
        frequency = {}

        for word in words:
            if word in frequency:
                frequency[word] += 1
            else:
                frequency[word] = 1

        return max(frequency, key=frequency.get)

    def unique_words(self):
        words = self.text.split()
        unique = set(words)

        return list(unique)

    @classmethod
    def from_file(cls, file_path):
        with open(file_path, "r") as file:
            text = file.read()

        return cls(text)


class TextModification(Text):
    def remove_punctuation(self):
        punctuation = string.punctuation

        for character in punctuation:
            self.text = self.text.replace(character, "")

        return self.text

    def remove_stop_words(self):
        stop_words = {
            "a", "an", "the", "is", "are", "was", "were",
            "and", "or", "but", "in", "on", "at", "to",
            "of", "for", "with", "as", "by", "this", "that",
            "it", "be", "from"
        }

        words = self.text.split()

        words = [word for word in words if word.lower() not in stop_words]

        self.text = " ".join(words)

        return self.text

    def remove_special_characters(self):
        self.text = re.sub(r"[^a-zA-Z0-9\s]", "", self.text)

        return self.text


# Testing the Text class

text = Text("hello world hello python world hello")

print("Word frequency:", text.word_frequency("hello"))
print("Most common word:", text.most_common_word())
print("Unique words:", text.unique_words())


# Testing TextModification

modified_text = TextModification("Hello, this is a test! Python is great.")

print("Original:", modified_text.text)

print("Without punctuation:", modified_text.remove_punctuation())

print("Without stop words:", modified_text.remove_stop_words())

print("Without special characters:", modified_text.remove_special_characters())