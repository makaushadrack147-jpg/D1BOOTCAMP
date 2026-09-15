#exercise1
student_grades = {
    "Alice": [88, 92, 100],
    "Bob": [75, 78, 80],
    "Charlie": [92, 90, 85],
    "Dana": [83, 88, 92],
    "Eli": [78, 80, 72]
}

# Create empty dictionaries
student_averages = {}
student_letter_grades = {}

# Calculate average for each student
for name, grades in student_grades.items():
    average = sum(grades) / len(grades)
    student_averages[name] = average

# Assign letter grades
for name, average in student_averages.items():
    if average >= 90:
        letter_grade = "A"
    elif average >= 80:
        letter_grade = "B"
    elif average >= 70:
        letter_grade = "C"
    elif average >= 60:
        letter_grade = "D"
    else:
        letter_grade = "F"

    student_letter_grades[name] = letter_grade

# Calculate class average
class_average = sum(student_averages.values()) / len(student_averages)

# Print results
print("Student Report")
print("-----------------------------")

for name in student_grades:
    print(
        f"{name}: Average Grade = "
        f"{student_averages[name]:.2f}, "
        f"Letter Grade = {student_letter_grades[name]}"
    )

print("-----------------------------")
print(f"Class Average = {class_average:.2f}")
#exercise 2
sales_data = [
    {"customer_id": 1, "product": "Smartphone", "price": 600, "quantity": 1, "date": "2023-04-03"},
    {"customer_id": 2, "product": "Laptop", "price": 1200, "quantity": 1, "date": "2023-04-04"},
    {"customer_id": 1, "product": "Laptop", "price": 1000, "quantity": 1, "date": "2023-04-05"},
    {"customer_id": 2, "product": "Smartphone", "price": 500, "quantity": 2, "date": "2023-04-06"},
    {"customer_id": 3, "product": "Headphones", "price": 150, "quantity": 4, "date": "2023-04-07"},
    {"customer_id": 3, "product": "Smartphone", "price": 550, "quantity": 1, "date": "2023-04-08"},
    {"customer_id": 1, "product": "Headphones", "price": 100, "quantity": 2, "date": "2023-04-09"},
]


# 1. Total Sales Calculation
total_sales = {}

for transaction in sales_data:
    product = transaction["product"]
    total_price = transaction["price"] * transaction["quantity"]

    if product in total_sales:
        total_sales[product] += total_price
    else:
        total_sales[product] = total_price


# 2. Customer Spending Profile
customer_spending = {}

for transaction in sales_data:
    customer_id = transaction["customer_id"]
    total_price = transaction["price"] * transaction["quantity"]

    if customer_id in customer_spending:
        customer_spending[customer_id] += total_price
    else:
        customer_spending[customer_id] = total_price


# 3. Add total_price to every transaction
for transaction in sales_data:
    transaction["total_price"] = transaction["price"] * transaction["quantity"]


# 4. Find High-Value Transactions
high_value_transactions = [
    transaction
    for transaction in sales_data
    if transaction["total_price"] > 500
]

# Sort from highest to lowest
high_value_transactions.sort(
    key=lambda x: x["total_price"],
    reverse=True
)


# 5. Customer Loyalty Identification
purchase_counts = {}

for transaction in sales_data:
    customer_id = transaction["customer_id"]

    if customer_id in purchase_counts:
        purchase_counts[customer_id] += 1
    else:
        purchase_counts[customer_id] = 1

# Customers with more than one purchase
loyal_customers = [
    customer_id
    for customer_id, count in purchase_counts.items()
    if count > 1
]


# 6. Bonus: Average Transaction Value
average_transaction_value = {}

for product in total_sales:
    total_quantity = 0

    for transaction in sales_data:
        if transaction["product"] == product:
            total_quantity += transaction["quantity"]

    average_transaction_value[product] = (
        total_sales[product] / total_quantity
    )


# 7. Most Popular Product Based on Quantity
product_quantities = {}

for transaction in sales_data:
    product = transaction["product"]
    quantity = transaction["quantity"]

    if product in product_quantities:
        product_quantities[product] += quantity
    else:
        product_quantities[product] = quantity

most_popular_product = max(
    product_quantities,
    key=product_quantities.get
)


# PRINT RESULTS
print("\n===== SALES REPORT =====")

print("\n1. Total Sales by Product:")
print(total_sales)

print("\n2. Customer Spending:")
print(customer_spending)

print("\n3. Enhanced Sales Data:")
for transaction in sales_data:
    print(transaction)

print("\n4. High-Value Transactions:")
for transaction in high_value_transactions:
    print(transaction)

print("\n5. Purchase Counts:")
print(purchase_counts)

print("\nLoyal Customers:")
print(loyal_customers)

print("\n6. Average Transaction Value:")
print(average_transaction_value)

print("\n7. Product Quantities Sold:")
print(product_quantities)

print("\nMost Popular Product:")
print(most_popular_product)


# Marketing Insights
print("\n===== MARKETING INSIGHTS =====")

print("1. Focus promotions on products with high sales revenue.")

print("2. Reward loyal customers with discounts and special offers.")

print("3. Promote the most popular product because it has the highest demand.")

print("4. Use high-value transactions to identify customers who may be interested in premium products.")

print("5. Use average transaction values to create bundles and upselling offers.")