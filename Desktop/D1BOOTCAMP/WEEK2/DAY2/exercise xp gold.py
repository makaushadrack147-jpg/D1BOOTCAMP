class BankAccount:
    def __init__(self, balance, username, password):
        self.balance = balance
        self.username = username
        self.password = password
        self.authenticated = False

    def authenticate(self, username, password):
        if username == self.username and password == self.password:
            self.authenticated = True
            return True
        return False

    def deposit(self, amount):
        if not self.authenticated:
            raise Exception("You must be authenticated to deposit.")

        if amount <= 0:
            raise Exception("Deposit amount must be positive.")

        self.balance += amount

    def withdraw(self, amount):
        if not self.authenticated:
            raise Exception("You must be authenticated to withdraw.")

        if amount <= 0:
            raise Exception("Withdrawal amount must be positive.")

        if amount > self.balance:
            raise Exception("Insufficient funds.")

        self.balance -= amount


class MinimumBalanceAccount(BankAccount):
    def __init__(self, balance, username, password, minimum_balance=0):
        super().__init__(balance, username, password)
        self.minimum_balance = minimum_balance

    def withdraw(self, amount):
        if not self.authenticated:
            raise Exception("You must be authenticated to withdraw.")

        if amount <= 0:
            raise Exception("Withdrawal amount must be positive.")

        if self.balance - amount < self.minimum_balance:
            raise Exception("Withdrawal would go below the minimum balance.")

        self.balance -= amount


class ATM:
    def __init__(self, account_list, try_limit):
        # Check that account_list is a list
        if not isinstance(account_list, list):
            raise Exception("account_list must be a list.")

        # Check that every item is a BankAccount
        # or MinimumBalanceAccount
        for account in account_list:
            if not isinstance(account, BankAccount):
                raise Exception("All items must be BankAccount objects.")

        self.account_list = account_list

        try:
            if try_limit <= 0:
                raise Exception("try_limit must be positive.")

            self.try_limit = try_limit

        except Exception:
            print("Invalid try limit. Setting try_limit to 2.")
            self.try_limit = 2

        self.current_tries = 0

    def show_main_menu(self):
        while True:
            print("\n===== ATM =====")
            print("1. Log in")
            print("2. Exit")

            choice = input("Choose an option: ")

            if choice == "1":
                username = input("Username: ")
                password = input("Password: ")

                self.log_in(username, password)

                if self.current_tries >= self.try_limit:
                    break

            elif choice == "2":
                print("Goodbye!")
                break

            else:
                print("Invalid option.")

    def log_in(self, username, password):
        for account in self.account_list:
            if account.authenticate(username, password):
                print("Login successful!")
                self.current_tries = 0
                self.show_account_menu(account)
                return

        self.current_tries += 1

        print("Invalid username or password.")
        print(f"Attempts: {self.current_tries}/{self.try_limit}")

        if self.current_tries >= self.try_limit:
            print("You have reached the maximum number of tries.")
            print("ATM shutting down.")

    def show_account_menu(self, account):
        while True:
            print("\n===== Account Menu =====")
            print("1. Deposit")
            print("2. Withdraw")
            print("3. Check Balance")
            print("4. Exit")

            choice = input("Choose an option: ")

            try:
                if choice == "1":
                    amount = int(input("Enter deposit amount: "))
                    account.deposit(amount)
                    print(f"Deposit successful!")
                    print(f"New balance: {account.balance}")

                elif choice == "2":
                    amount = int(input("Enter withdrawal amount: "))
                    account.withdraw(amount)
                    print("Withdrawal successful!")
                    print(f"New balance: {account.balance}")

                elif choice == "3":
                    print(f"Current balance: {account.balance}")

                elif choice == "4":
                    print("Logging out...")
                    break

                else:
                    print("Invalid option.")

            except Exception as error:
                print(f"Error: {error}")


if __name__ == "__main__":
    account1 = BankAccount(
        1000,
        "shadrack",
        "1234"
    )

    account2 = MinimumBalanceAccount(
        2000,
        "john",
        "5678",
        minimum_balance=500
    )

    accounts = [account1, account2]

    atm = ATM(accounts, 3)
    atm.show_main_menu()