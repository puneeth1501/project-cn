

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());


// Add a test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test successful!' });
});

module.exports = app;
