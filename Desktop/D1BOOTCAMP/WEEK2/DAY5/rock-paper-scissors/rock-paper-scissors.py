from game import Game


def get_user_menu_choice():
    while True:
        print('\n=== ROCK PAPER SCISSORS ===')
        print('1. Play a new game')
        print('2. Show scores')
        print('3. Quit')
        choice = input('Choose an option: ').strip().lower()

        if choice in {'1', 'play', 'play a new game'}:
            return 'play'
        if choice in {'2', 'scores', 'show scores'}:
            return 'scores'
        if choice in {'3', 'quit', 'exit'}:
            return 'quit'
        print('Invalid choice. Please choose 1, 2, or 3.')


def print_results(results):
    print('\nFinal score:')
    print(f"Wins: {results['win']}, Losses: {results['loss']}, Draws: {results['draw']}")
    print('Thank you for playing!')


def main():
    results = {'win': 0, 'loss': 0, 'draw': 0}

    while True:
        choice = get_user_menu_choice()

        if choice == 'play':
            game = Game()
            result = game.play()
            results[result] += 1
        elif choice == 'scores':
            print_results(results)
        else:
            print_results(results)
            break


if __name__ == '__main__':
    main()
