const form = document.querySelector('#converter-form');
const temperatureInput = document.querySelector('#temperature');
const unitInput = document.querySelector('#unit');
const errorMessage = document.querySelector('#input-error');
const statusMessage = document.querySelector('#status-message');
const resultElements = {
  celsius: document.querySelector('#celsius-result'),
  fahrenheit: document.querySelector('#fahrenheit-result'),
  kelvin: document.querySelector('#kelvin-result')
};

function formatTemperature(value) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function showError(message) {
  errorMessage.textContent = message;
  statusMessage.textContent = message;
  statusMessage.classList.add('error');
  Object.values(resultElements).forEach((element) => {
    element.textContent = '--';
  });
}

function convertTemperature(value, unit) {
  if (unit === 'celsius') {
    return { celsius: value, fahrenheit: value * 9 / 5 + 32, kelvin: value + 273.15 };
  }

  if (unit === 'fahrenheit') {
    const celsius = (value - 32) * 5 / 9;
    return { celsius, fahrenheit: value, kelvin: celsius + 273.15 };
  }

  const celsius = value - 273.15;
  return { celsius, fahrenheit: celsius * 9 / 5 + 32, kelvin: value };
}

function updateResults(results) {
  Object.entries(results).forEach(([unit, value]) => {
    resultElements[unit].textContent = formatTemperature(value);
  });
  errorMessage.textContent = '';
  statusMessage.textContent = 'Conversion complete. All three scales, in one view.';
  statusMessage.classList.remove('error');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const rawValue = temperatureInput.value.trim();
  const value = Number(rawValue);
  const unit = unitInput.value;

  if (rawValue === '' || !Number.isFinite(value)) {
    showError('Please enter a valid numeric temperature.');
    temperatureInput.focus();
    return;
  }

  const celsiusValue = unit === 'celsius' ? value : convertTemperature(value, unit).celsius;
  if (celsiusValue < -273.15) {
    showError('That temperature is below absolute zero. Please enter a warmer value.');
    temperatureInput.focus();
    return;
  }

  updateResults(convertTemperature(value, unit));
});

temperatureInput.addEventListener('input', () => {
  if (errorMessage.textContent) {
    errorMessage.textContent = '';
    statusMessage.textContent = 'Ready when you are.';
    statusMessage.classList.remove('error');
  }
});
