import random

list_of_numbers = [random.randint(0, 10000) for _ in range(20000)]

target_number = 3728

seen = set()
pairs = set()

for number in list_of_numbers:
    needed = target_number - number

    if needed in seen:
        pair = tuple(sorted((number, needed)))
        pairs.add(pair)

    seen.add(number)

for num1, num2 in sorted(pairs):
    print(f"{num1} and {num2} sums to {target_number}")