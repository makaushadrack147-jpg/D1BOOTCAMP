let client = "John";

const groceries = {
	fruits: ["pear", "apple", "banana"],
	vegetables: ["tomatoes", "cucumber", "salad"],
	totalPrice: "20$",
	other: {
		paid: true,
		meansOfPayment: ["cash", "creditCard"]
	}
};

const displayGroceries = () => {
	groceries.fruits.forEach(fruit => console.log(fruit));
};

const cloneGroceries = () => {
	const user = client;
	client = "Betty";
	console.log("user:", user);
	console.log("client:", client);

	const shopping = groceries;
	shopping.totalPrice = "35$";
	shopping.other.paid = false;

	console.log("groceries:", groceries);
	console.log("shopping:", shopping);
	console.log("Both objects changed because shopping references groceries.");
};

displayGroceries();
cloneGroceries();
