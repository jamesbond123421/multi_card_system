// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());  // Enable CORS
app.use(express.json());  // For parsing JSON requests

// In-memory data for wallets and cards
let wallets = [
    { currency: 'USD', balance: 3000 },
    { currency: 'NGN', balance: 13800 },
    { currency: 'GHS', balance: 3450 },
];

let cards = [
    { id: '1', name: 'Naira Card', number: '**** **** **** 1234', currency: 'NGN', balance: 5000 },
    { id: '2', name: 'Cedis Card', number: '**** **** **** 5678', currency: 'GHS', balance: 2000 },
];

const EXCHANGE_RATES = {
    USD: 1,
    NGN: 1687.41,
    GHS: 16.49,
    EUR: 0.93,
};

// Get all wallets
app.get('/api/wallets', (req, res) => {
    res.json(wallets);
});

// Get all cards
app.get('/api/cards', (req, res) => {
    res.json(cards);
});

// Add a new card
app.post('/api/cards', (req, res) => {
    const { name, number, currency } = req.body;

    if (!name || !number || !currency) {
        return res.status(400).json({ error: 'Card name, number, and currency are required.' });
    }

    const newCard = {
        id: (cards.length + 1).toString(),
        name,
        number,
        currency,
        balance: 1000,  // Default balance
    };
    cards.push(newCard);
    res.status(201).json(newCard);
});

// Charge a card and update the wallet balance
app.post('/api/charge', (req, res) => {
    const { cardId, amount } = req.body;

    if (!cardId || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Valid card ID and charge amount are required.' });
    }

    const card = cards.find(c => c.id === cardId);
    if (!card) {
        return res.status(404).json({ error: 'Card not found.' });
    }

    const wallet = wallets.find(w => w.currency === card.currency);
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found for this currency.' });
    }

    if (card.balance < amount) {
        return res.status(400).json({ error: 'Insufficient card balance.' });
    }

    // Deduct from card balance and add to wallet
    card.balance -= amount;
    wallet.balance += amount;

    res.json({ message: 'Charge successful', card, wallet });
});

// Convert currency
app.post('/api/convert', (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || isNaN(amount) || amount <= 0 || !fromCurrency || !toCurrency) {
        return res.status(400).json({ error: 'Valid amount, fromCurrency, and toCurrency are required.' });
    }

    const convertedAmount = (amount / EXCHANGE_RATES[fromCurrency]) * EXCHANGE_RATES[toCurrency];
    res.json({ convertedAmount: convertedAmount.toFixed(2), toCurrency });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
