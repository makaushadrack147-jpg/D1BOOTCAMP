// Exercise 1: 
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise(resolve => {
	setTimeout(resolve, 3000, "foo");
});

Promise.all([promise1, promise2, promise3])
	.then(values => {
		// Promise.all waits for every item and returns resolved values in the
		// same order as the input array. Plain values are treated as resolved
		// promises, so the result is [3, 42, "foo"] after three seconds.
		console.log(values);
	})
	.catch(error => {
		// If any promise rejects, Promise.all rejects and this handler catches it.
		console.log(error);
	});

// Exercise 2: 
function timesTwoAsync(x) {
	return new Promise(resolve => resolve(x * 2));
}

const arr = [1, 2, 3];
const promiseArr = arr.map(timesTwoAsync);

Promise.all(promiseArr)
	.then(result => {
		// Each number is doubled, so the output is [2, 4, 6].
		console.log(result);
	});
