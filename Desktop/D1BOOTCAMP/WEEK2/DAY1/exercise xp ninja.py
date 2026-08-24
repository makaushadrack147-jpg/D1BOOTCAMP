class Phone:

    def __init__(self, phone_number):
        self.phone_number = phone_number
        self.call_history = []
        self.messages = []

    def call(self, other_phone):
        call_info = f"{self.phone_number} called {other_phone.phone_number}"
        print(call_info)

        self.call_history.append(call_info)

        # Also save the call in the other phone's history
        other_phone.call_history.append(call_info)

    def show_call_history(self):
        print("Call History:")
        for call in self.call_history:
            print(call)

    def send_message(self, other_phone, content):
        message = {
            "to": other_phone.phone_number,
            "from": self.phone_number,
            "content": content
        }

        # Save message in sender's messages
        self.messages.append(message)

        # Save message in receiver's messages
        other_phone.messages.append(message)

    def show_outgoing_messages(self):
        print("Outgoing Messages:")

        for message in self.messages:
            if message["from"] == self.phone_number:
                print(message)

    def show_incoming_messages(self):
        print("Incoming Messages:")

        for message in self.messages:
            if message["to"] == self.phone_number:
                print(message)

    def show_messages_from(self, phone_number):
        print(f"Messages from {phone_number}:")

        for message in self.messages:
            if message["from"] == phone_number:
                print(message)


# Create two phones
phone1 = Phone("0712345678")
phone2 = Phone("0798765432")


# Test calls
phone1.call(phone2)

print()

phone2.call(phone1)

print()

# Show call history
phone1.show_call_history()

print()

# Test messages
phone1.send_message(phone2, "Hey, how are you?")

phone2.send_message(phone1, "I'm good, how about you?")

print()

# Show outgoing messages
phone1.show_outgoing_messages()

print()

# Show incoming messages
phone1.show_incoming_messages()

print()

# Show messages from a specific phone
phone1.show_messages_from("0798765432")