from pathlib import Path


class AnagramChecker:
    def __init__(self, word_file='sowpods.txt'):
        base_dir = Path(__file__).resolve().parent
        word_path = base_dir / word_file

        with open(word_path, 'r', encoding='utf-8') as file:
            self.word_list = {word.strip().lower() for word in file if word.strip()}

    def is_valid_word(self, word):
        if not isinstance(word, str):
            return False
        return word.strip().lower() in self.word_list

    def is_anagram(self, word1, word2):
        if not isinstance(word1, str) or not isinstance(word2, str):
            return False

        normalized_word1 = word1.strip().lower()
        normalized_word2 = word2.strip().lower()

        if not normalized_word1 or not normalized_word2:
            return False

        return sorted(normalized_word1) == sorted(normalized_word2)

    def get_anagrams(self, word):
        if not isinstance(word, str):
            return []

        normalized_word = word.strip().lower()
        if not normalized_word or not self.is_valid_word(normalized_word):
            return []

        anagrams = []
        for candidate in self.word_list:
            if candidate != normalized_word and self.is_anagram(normalized_word, candidate):
                anagrams.append(candidate)

        return sorted(anagrams)
