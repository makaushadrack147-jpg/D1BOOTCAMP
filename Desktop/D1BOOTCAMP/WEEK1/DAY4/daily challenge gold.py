MATRIX_STR = '''
7ir
Tsi
h%x
i ?
sM# 
$a 
#t%'''

# Step 1: Convert the string into a 2D list
matrix = [list(row) for row in MATRIX_STR.strip().split('\n')]

# Step 2: Read the matrix column by column
decoded_message = ""

for col in range(len(matrix[0])):
    for row in range(len(matrix)):
        char = matrix[row][col]

        # Step 3: Keep alphabetic characters
        if char.isalpha():
            decoded_message += char
        else:
            # Step 4: Replace symbols with spaces
            if decoded_message and not decoded_message.endswith(" "):
                decoded_message += " "

# Step 5: Print the secret message
print(decoded_message)