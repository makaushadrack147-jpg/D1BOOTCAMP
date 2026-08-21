#exercise1
#pattern 1
for i in range(1, 6, 2):
    print("*" * i)
#pattern 2
for i in range(1, 6):
    print("*" * i)

#pattern 3
for i in range(1, 6):
    print("*" * i)

for i in range(5, 0, -1):
    print("*" * i)

    #exercise2

    my_list = [2, 24, 12, 354, 233]
# Starting list

for i in range(len(my_list) - 1):
    # i goes from 0 to 3

    minimum = i
    # Assume the current position contains the smallest value

    for j in range(i + 1, len(my_list)):
        # Check the values after position i

        if(my_list[j] < my_list[minimum]):
            # If a smaller value is found...

            minimum = j
            # Store its position

            if(minimum != i):
                # If the smallest value is not already at position i...

                my_list[i], my_list[minimum] = my_list[minimum], my_list[i]
                # Swap the two values

print(my_list)
# Display the sorted list