import math


class Pagination:
	def __init__(self, items=None, page_size=10):
		if page_size <= 0:
			raise ValueError("page_size must be greater than 0")

		self.items = [] if items is None else items
		self.page_size = page_size
		self.current_idx = 0
		self.total_pages = math.ceil(len(self.items) / self.page_size)

	def get_visible_items(self):
		start = self.current_idx * self.page_size
		end = start + self.page_size
		return self.items[start:end]

	def go_to_page(self, page_num):
		if page_num < 1 or page_num > self.total_pages:
			raise ValueError("Page number is out of range")

		self.current_idx = page_num - 1
		return self

	def first_page(self):
		self.current_idx = 0
		return self

	def last_page(self):
		self.current_idx = max(0, self.total_pages - 1)
		return self

	def next_page(self):
		if self.current_idx < self.total_pages - 1:
			self.current_idx += 1
		return self

	def previous_page(self):
		if self.current_idx > 0:
			self.current_idx -= 1
		return self

	def __str__(self):
		return "\n".join(str(item) for item in self.get_visible_items())


if __name__ == "__main__":
	alphabet_list = list("abcdefghijklmnopqrstuvwxyz")
	pagination = Pagination(alphabet_list, 4)

	print(pagination.get_visible_items())
	pagination.next_page()
	print(pagination.get_visible_items())
	pagination.last_page()
	print(pagination.get_visible_items())

	try:
		pagination.go_to_page(10)
	except ValueError as error:
		print(f"ValueError: {error}")
