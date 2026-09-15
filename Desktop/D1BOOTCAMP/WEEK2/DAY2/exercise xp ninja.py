import time


class GameOfLife:
    def __init__(self, grid):
        self.grid = grid
        self.rows = len(grid)
        self.cols = len(grid[0])

    def display(self):
        for row in self.grid:
            print(" ".join("█" if cell == 1 else "." for cell in row))
        print()

    def count_neighbors(self, row, col):
        count = 0

        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:

                # Don't count the cell itself
                if dr == 0 and dc == 0:
                    continue

                new_row = row + dr
                new_col = col + dc

                # Fixed borders
                if (
                    0 <= new_row < self.rows
                    and 0 <= new_col < self.cols
                ):
                    count += self.grid[new_row][new_col]

        return count

    def next_generation(self):
        new_grid = [
            [0 for _ in range(self.cols)]
            for _ in range(self.rows)
        ]

        for row in range(self.rows):
            for col in range(self.cols):

                neighbors = self.count_neighbors(row, col)

                # Cell is alive
                if self.grid[row][col] == 1:

                    # Lives with 2 or 3 neighbors
                    if neighbors == 2 or neighbors == 3:
                        new_grid[row][col] = 1

                    # Otherwise it dies
                    else:
                        new_grid[row][col] = 0

                # Cell is dead
                else:

                    # Becomes alive with exactly 3 neighbors
                    if neighbors == 3:
                        new_grid[row][col] = 1

        self.grid = new_grid

    def run(self, generations, delay=0.5):
        for generation in range(generations):
            print(f"Generation {generation}")
            self.display()

            self.next_generation()
            time.sleep(delay)


# -----------------------------
# Example 1: Blinker
# -----------------------------

grid = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0]
]

game = GameOfLife(grid)
game.run(10)