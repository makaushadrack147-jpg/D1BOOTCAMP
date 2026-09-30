const form = document.querySelector(".auth-form");
const submitButton = form.querySelector(".submit-button");
const message = document.querySelector("#form-message");
const inputs = [...form.querySelectorAll("input[required]")];

function updateSubmitState() {
	submitButton.disabled = !inputs.every((input) => input.value.trim() && input.checkValidity());
}

inputs.forEach((input) => input.addEventListener("input", updateSubmitState));

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	updateSubmitState();
	if (submitButton.disabled) return;

	message.textContent = "";
	message.classList.remove("success");
	submitButton.disabled = true;
	const body = Object.fromEntries(new FormData(form).entries());
	try {
		const response = await fetch(form.dataset.endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Request failed");
		message.textContent = result.message;
		message.classList.add("success");
		if (form.id === "register-form") {
			form.reset();
			updateSubmitState();
		} else {
			form.reset();
			updateSubmitState();
		}
	} catch (error) {
		message.textContent = error.message;
		message.classList.remove("success");
		updateSubmitState();
	}
});