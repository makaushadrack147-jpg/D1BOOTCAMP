#exercise 1

from menu_manager import MenuManager


manager = None


def load_manager():
    global manager
    manager = MenuManager()


def show_user_menu():
    while True:
        print("\n--- Restaurant Menu Manager ---")
        print("1. Show restaurant menu")
        print("2. Add an item")
        print("3. Delete an item")
        print("4. Exit")

        choice = input("Choose an option: ")

        if choice == "1":
            show_restaurant_menu()

        elif choice == "2":
            add_item_to_menu()

        elif choice == "3":
            remove_item_from_menu()

        elif choice == "4":
            manager.save_to_file()
            print("Menu was saved. Goodbye!")
            break

        else:
            print("Invalid choice. Please try again.")


def add_item_to_menu():
    name = input("Enter the item name: ")

    try:
        price = float(input("Enter the item price: "))
        manager.add_item(name, price)
        print("Item was added successfully.")

    except ValueError:
        print("Please enter a valid price.")


def remove_item_from_menu():
    name = input("Enter the name of the item to remove: ")

    if manager.remove_item(name):
        print("Item was deleted successfully.")
    else:
        print("There was an error. Item was not found.")


def show_restaurant_menu():
    print("\n--- Restaurant Menu ---")

    for item in manager.menu:
        print(f"{item['name']} - {item['price']}")


if __name__ == "__main__":
    load_manager()
    show_user_menu()

    #exercise 2
    import requests

# Variables
search = "hilarious"
rating = "g"
api_key = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My"

# Create the URL
url = f"https://api.giphy.com/v1/gifs/search?q={search}&rating={rating}&api_key={api_key}&limit=10"

# Get the data
response = requests.get(url)

# Check if it worked
if response.status_code == 200:

    data = response.json()

    # Get the gifs
    gifs = data["data"]

    # Count the gifs
    print("Number of gifs:", len(gifs))

    # Go through the gifs
    for gif in gifs:

        height = int(gif["images"]["original"]["height"])

        if height > 100:
            print(gif["images"]["original"]["url"])

else:
    print("Something went wrong")

    #exercise 3
    import requests

api_key = "hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My"

word = input("Enter a word: ")

url = f"https://api.giphy.com/v1/gifs/search?q={word}&api_key={api_key}"

response = requests.get(url)
data = response.json()

if len(data["data"]) > 0:
    print("GIFs found:")

    for gif in data["data"]:
        print(gif["url"])

else:
    print("Sorry, I couldn't find that word.")
    print("Here are today's trending GIFs:")

    url = f"https://api.giphy.com/v1/gifs/trending?api_key={api_key}"

    response = requests.get(url)
    data = response.json()

    for gif in data["data"]:
        print(gif["url"])