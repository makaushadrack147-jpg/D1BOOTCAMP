x = int(input('Enter the Number:'))

sum_divisors = 0

for i in range(1, x):
    if x % i == 0:
        sum_divisors += i

if sum_divisors == x:
    print(True)
else:
    print(False)