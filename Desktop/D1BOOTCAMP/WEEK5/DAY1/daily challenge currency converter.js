const apiKeyInput = document.querySelector('#api-key');
const amountInput = document.querySelector('#amount');
const fromCurrency = document.querySelector('#from-currency');
const toCurrency = document.querySelector('#to-currency');
const converterForm = document.querySelector('#converter-form');
const switchButton = document.querySelector('#switch-currencies');
const result = document.querySelector('#result');
const status = document.querySelector('#status');

const setStatus = (message, type = '') => {
	status.className = `status ${type}`;
	status.textContent = message;
};

const setCurrencyOptions = (codes) => {
	const options = codes
		.sort()
		.map((code) => `<option value="${code}">${code}</option>`)
		.join('');

	fromCurrency.innerHTML = options;
	toCurrency.innerHTML = options;
	fromCurrency.value = 'USD';
	toCurrency.value = 'EUR';
};

const fetchSupportedCurrencies = async (apiKey) => {
	const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
	const data = await response.json();

	if (!response.ok || data.result !== 'success') {
		throw new Error(data['error-type'] || 'Could not load currencies');
	}

	setCurrencyOptions(data.supported_codes.map(([code]) => code));
};

const fetchConversion = async (apiKey, from, to, amount) => {
	const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
	const data = await response.json();

	if (!response.ok || data.result !== 'success') {
		throw new Error(data['error-type'] || 'Could not convert currency');
	}

	return data;
};

const loadCurrencies = async () => {
	const apiKey = apiKeyInput.value.trim();
	if (!apiKey) {
		setStatus('Enter your ExchangeRate API key to load currencies.', 'error');
		return;
	}

	setStatus('Loading supported currencies...', 'loading');
	try {
		await fetchSupportedCurrencies(apiKey);
		setStatus('Currencies ready.');
	} catch (error) {
		setStatus(`Unable to load currencies: ${error.message}.`, 'error');
	}
};

converterForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const apiKey = apiKeyInput.value.trim();
	const amount = Number(amountInput.value);

	if (!apiKey || !amount || amount < 0) {
		setStatus('Add a valid API key and amount first.', 'error');
		return;
	}

	setStatus('Fetching the latest exchange rate...', 'loading');
	result.textContent = '...';

	try {
		const data = await fetchConversion(apiKey, fromCurrency.value, toCurrency.value, amount);
		result.textContent = `${data.conversion_result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${toCurrency.value}`;
		setStatus(`1 ${fromCurrency.value} = ${data.conversion_rate} ${toCurrency.value}`, 'success');
	} catch (error) {
		result.textContent = '—';
		setStatus(`Conversion failed: ${error.message}.`, 'error');
	}
});

switchButton.addEventListener('click', () => {
	const currentFrom = fromCurrency.value;
	fromCurrency.value = toCurrency.value;
	toCurrency.value = currentFrom;
	if (amountInput.value) converterForm.requestSubmit();
});

apiKeyInput.addEventListener('change', loadCurrencies);
