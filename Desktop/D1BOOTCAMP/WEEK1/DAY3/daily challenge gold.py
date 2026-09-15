def caesar_cipher(text, shift):
    result = ""

    for letter in text:
        if letter.isalpha():
            start = ord('A') if letter.isupper() else ord('a')
            result += chr((ord(letter) - start + shift) % 26 + start)
        else:
            result += letter

    return result


print("Caesar Cipher")
print("1. Encrypt")
print("2. Decrypt")

choice = input("Enter your choice (1 or 2): ")
message = input("Enter your message: ")
shift = int(input("Enter the shift: "))

if choice == "1":
    encrypted = caesar_cipher(message, shift)
    print("Encrypted message:", encrypted)

elif choice == "2":
    decrypted = caesar_cipher(message, -shift)
    print("Decrypted message:", decrypted)

else:
    print("Invalid choice")