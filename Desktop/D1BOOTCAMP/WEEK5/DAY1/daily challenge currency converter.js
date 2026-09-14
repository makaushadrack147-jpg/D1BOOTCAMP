const apiKeyInput = document.querySelector('#api-key');
const loadCurrenciesButton = document.querySelector('#load-currencies');
const amountInput = document.querySelector('#amount');
const fromCurrency = document.querySelector('#from-currency');
const toCurrency = document.querySelector('#to-currency');
const converterForm = document.querySelector('#converter-form');
const switchButton = document.querySelector('#switch-currencies');
const result = document.querySelector('#result');
const status = document.querySelector('#status');
let supportedCurrencies = new Set();

const setStatus = (message, type = '') => {
	status.className = `status ${type}`;
	status.textContent = message;
};

const setCurrencyOptions = (codes) => {
	const validCodes = [...new Set(codes.map((code) => code.toUpperCase()))]
		.filter((code) => /^[A-Z]{3}$/.test(code));
	supportedCurrencies = new Set(validCodes);
	const options = validCodes
		.sort()
		.map((code) => `<option value="${code}">${code}</option>`)
		.join('');

	fromCurrency.innerHTML = options;
	toCurrency.innerHTML = options;
	fromCurrency.value = 'USD';
	toCurrency.value = 'EUR';
	fromCurrency.disabled = false;
	toCurrency.disabled = false;
	switchButton.disabled = false;
};

const fetchSupportedCurrencies = async (apiKey) => {
	if (!apiKey) {
		const response = await fetch('https://open.er-api.com/v6/latest/USD');
		const data = await response.json();
		if (!response.ok || data.result !== 'success') throw new Error('Public currency feed unavailable');
		setCurrencyOptions(Object.keys(data.rates));
		return;
	}

	const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
	const data = await response.json();

	if (!response.ok || data.result !== 'success') {
		throw new Error(data['error-type'] || 'Could not load currencies');
	}

	setCurrencyOptions(data.supported_codes.map(([code]) => code));
};

const fetchConversion = async (apiKey, from, to, amount) => {
	if (!apiKey) {
		const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
		const data = await response.json();
		if (!response.ok || data.result !== 'success' || !data.rates[to]) {
			throw new Error('Public conversion feed unavailable');
		}
		return { conversion_rate: data.rates[to], conversion_result: amount * data.rates[to] };
	}

	const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
	const data = await response.json();

	if (!response.ok || data.result !== 'success') {
		throw new Error(data['error-type'] || 'Could not convert currency');
	}

	return data;
};

const loadCurrencies = async () => {
	const apiKey = apiKeyInput.value.trim();
	setStatus('Loading supported currencies...', 'loading');
	try {
		await fetchSupportedCurrencies(apiKey);
		setStatus(apiKey ? 'Currencies ready from your API key.' : 'Currencies ready from the public feed.', 'success');
	} catch (error) {
		setStatus(`Unable to load currencies: ${error.message}.`, 'error');
	}
};

converterForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const apiKey = apiKeyInput.value.trim();
	const amount = Number(amountInput.value);
	const from = fromCurrency.value.toUpperCase();
	const to = toCurrency.value.toUpperCase();

	if (!amount || amount < 0) {
		setStatus('Add a valid amount first.', 'error');
		return;
	}

	if (!supportedCurrencies.has(from) || !supportedCurrencies.has(to)) {
		setStatus('Choose two supported modern currencies.', 'error');
		return;
	}

	setStatus('Fetching the latest exchange rate...', 'loading');
	result.textContent = '...';

	try {
		const data = await fetchConversion(apiKey, from, to, amount);
		result.textContent = `${data.conversion_result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}`;
		setStatus(`1 ${from} = ${data.conversion_rate} ${to}`, 'success');
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
loadCurrenciesButton.addEventListener('click', loadCurrencies);
loadCurrencies();
