const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['https://othello-react.netlify.app', 'http://localhost:3000']
}));

app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.json({ status: 'Othello Game Server Running' });
});

module.exports = app;

