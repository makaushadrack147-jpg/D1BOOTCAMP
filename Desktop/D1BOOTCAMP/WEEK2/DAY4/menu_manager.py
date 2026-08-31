import json
from pathlib import Path


class MenuManager:
    def __init__(self, file_path=None):
        self.file_path = Path(file_path) if file_path else Path(__file__).with_name("menu.json")
        self.menu = self.load_from_file()

    def load_from_file(self):
        try:
            with self.file_path.open("r", encoding="utf-8") as file:
                menu = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            return []

        return menu if isinstance(menu, list) else []

    def add_item(self, name, price):
        self.menu.append({"name": name, "price": price})

    def remove_item(self, name):
        for item in self.menu:
            if item.get("name") == name:
                self.menu.remove(item)
                return True
        return False

    def save_to_file(self):
        with self.file_path.open("w", encoding="utf-8") as file:
            json.dump(self.menu, file, indent=4)