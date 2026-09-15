from anagram_checker import AnagramChecker


def is_valid_user_input(word):
    cleaned_word = word.strip()
    if not cleaned_word:
        print('Error: Please enter a word.')
        return False

    words = cleaned_word.split()
    if len(words) != 1:
        print('Error: Please enter only one word.')
        return False

    if not words[0].isalpha():
        print('Error: Only alphabetic characters are allowed.')
        return False

    return True


def show_menu():
    checker = AnagramChecker()

    while True:
        print('\n=== Anagram Checker ===')
        print('1. Enter a word')
        print('2. Exit')

        choice = input('Choose an option: ').strip()

        if choice in ('2', 'exit', 'Exit', 'EXIT'):
            print('Goodbye!')
            break

        if choice != '1':
            print('Invalid choice. Please select 1 or 2.')
            continue

        user_word = input('Enter a word: ')

        if not is_valid_user_input(user_word):
            continue

        cleaned_word = user_word.strip()
        if not checker.is_valid_word(cleaned_word):
            print(f'\nYOUR WORD: "{cleaned_word.upper()}"')
            print('This is not a valid English word.')
            continue

        anagrams = checker.get_anagrams(cleaned_word)

        if anagrams:
            anagram_list = ', '.join(anagrams)
            print(f'\nYOUR WORD: "{cleaned_word.upper()}"')
            print('This is a valid English word.')
            print(f'Anagrams for your word: {anagram_list}.')
        else:
            print(f'\nYOUR WORD: "{cleaned_word.upper()}"')
            print('This is a valid English word.')
            print('Anagrams for your word: none.')


if __name__ == '__main__':
    show_menu()
