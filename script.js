// Frontend logic for handling UI interactions
const remainingCreditElement = document.getElementById('remaining-credit-amount');
const walletsList = document.getElementById('wallets-list');
const cardsList = document.getElementById('cards-list');
const chargeCardSelect = document.getElementById('charge-card');
const convertFromSelect = document.getElementById('convertFrom');
const convertToSelect = document.getElementById('convertTo');

let wallets = [];
let cards = [];

async function fetchWallets() {
  const response = await fetch('/api/wallets');
  wallets = await response.json();
  displayWallets();
}

async function fetchCards() {
  const response = await fetch('/api/cards');
  cards = await response.json();
  displayCards();
}

async function displayWallets() {
  walletsList.innerHTML = '';
  wallets.forEach(wallet => {
    const div = document.createElement('div');
    div.textContent = `${wallet.currency}: ${wallet.balance}`;
    walletsList.appendChild(div);
  });

  const remainingCreditResponse = await fetch('/api/remaining-credit');
  const remainingCredit = await remainingCreditResponse.json();
  remainingCreditElement.textContent = remainingCredit.remainingCredit.toFixed(2);
}

async function displayCards() {
  cardsList.innerHTML = '';
  chargeCardSelect.innerHTML = '';
  cards.forEach(card => {
    const div = document.createElement('div');
    div.textContent = `${card.name} - ${card.currency}`;
    cardsList.appendChild(div);

    const option = document.createElement('option');
    option.value = card.id;
    option.textContent = `${card.name} (${card.currency})`;
    chargeCardSelect.appendChild(option);
  });
}

async function addCard() {
  const name = document.getElementById('cardName').value;
  const number = document.getElementById('cardNumber').value;
  const currency = document.getElementById('cardCurrency').value;

  const response = await fetch('/api/add-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, number, currency }),
  });

  if (response.ok) {
    alert('Card added successfully');
    fetchCards();
    document.getElementById('add-card-form').style.display = 'none';
  } else {
    alert('Failed to add card');
  }
}

async function chargeCard() {
  const cardId = chargeCardSelect.value;
  const amount = parseFloat(document.getElementById('charge-amount').value);
  const response = await fetch('/api/charge-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, amount }),
  });

  const result = await response.json();
  if (response.ok) {
    alert('Charge successful');
    fetchWallets();
  } else {
    document.getElementById('charge-error').textContent = result.message;
  }
}

async function convertCurrency() {
  const from = convertFromSelect.value;
  const to = convertToSelect.value;
  const amount = parseFloat(document.getElementById('convertAmount').value);

  const response = await fetch('/api/convert-currency', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, amount }),
  });

  const result = await response.json();
  document.getElementById('conversion-result').textContent = `Converted amount: ${result.result}`;
}

// Initial fetch on load
window.onload = () => {
  fetchWallets();
  fetchCards();
};
