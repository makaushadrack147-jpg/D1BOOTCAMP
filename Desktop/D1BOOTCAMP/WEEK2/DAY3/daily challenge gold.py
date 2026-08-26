people = []

for i in range(5):
    name = input("Enter name: ")
    age = input("Enter age: ")
    score = input("Enter score: ")

    people.append((name, age, score))

# Sort by Name, then Age, then Score
people.sort(key=lambda person: (person[0], person[1], person[2]))

print(people)