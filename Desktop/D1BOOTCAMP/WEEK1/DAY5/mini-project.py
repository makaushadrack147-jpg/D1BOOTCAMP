def display_board(board):
    print()
    for row in board:
        print(" | ".join(row))
        print("-" * 9)
    print()


def player_input(board, player):
    while True:
        try:
            row = int(input(f"Player {player}, enter row (1-3): ")) - 1
            col = int(input(f"Player {player}, enter column (1-3): ")) - 1

            if row < 0 or row > 2 or col < 0 or col > 2:
                print("Invalid position. Choose numbers from 1 to 3.")
            elif board[row][col] != " ":
                print("That position is already taken.")
            else:
                board[row][col] = player
                break

        except ValueError:
            print("Please enter numbers only.")


def check_win(board, player):
    # Check rows
    for row in board:
        if all(cell == player for cell in row):
            return True

    # Check columns
    for col in range(3):
        if all(board[row][col] == player for row in range(3)):
            return True

    # Check diagonals
    if all(board[i][i] == player for i in range(3)):
        return True

    if all(board[i][2 - i] == player for i in range(3)):
        return True

    return False


def check_tie(board):
    return all(cell != " " for row in board for cell in row)


def play():
    board = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ]

    current_player = "X"

    print("Welcome to Tic Tac Toe!")

    while True:
        display_board(board)

        player_input(board, current_player)

        if check_win(board, current_player):
            display_board(board)
            print(f"Player {current_player} wins! 🎉")
            break

        if check_tie(board):
            display_board(board)
            print("It's a tie! 🤝")
            break

        # Switch players
        if current_player == "X":
            current_player = "O"
        else:
            current_player = "X"


play()