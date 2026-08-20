# 1. Copy the string into the code
manufacturers_string = "Volkswagen, Toyota, Ford Motor, Honda, Chevrolet"

# 2. Convert the string into a list
manufacturers = manufacturers_string.split(", ")

# 3. Print how many manufacturers are in the list
print("There are", len(manufacturers), "manufacturers in the list.")

# 4. Print the manufacturers in reverse/descending order (Z-A)
print("\nManufacturers in descending order (Z-A):")
for company in sorted(manufacturers, reverse=True):
    print(company)

# 5.1 Count manufacturers that have the letter 'o'
count_o = sum(1 for company in manufacturers if "o" in company.lower())

print("\nNumber of manufacturers with the letter 'o':", count_o)

# 5.2 Count manufacturers that do NOT have the letter 'i'
count_no_i = sum(1 for company in manufacturers if "i" not in company.lower())

print("Number of manufacturers without the letter 'i':", count_no_i)


# 6. BONUS: Remove duplicates
companies = [
    "Honda",
    "Volkswagen",
    "Toyota",
    "Ford Motor",
    "Honda",
    "Chevrolet",
    "Toyota"
]

# Remove duplicates using set()
unique_companies = list(set(companies))

# Sort the companies alphabetically
unique_companies.sort()

# Print companies as a comma-separated string
print("\nCompanies without duplicates:")
print(", ".join(unique_companies))

# Print how many companies remain
print("There are now", len(unique_companies), "companies in the list.")


# 7. BONUS: Sort manufacturers A-Z, then reverse each name
print("\nManufacturers sorted A-Z with reversed names:")

for company in sorted(manufacturers):
    print(company[::-1])