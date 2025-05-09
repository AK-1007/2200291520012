const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Your access token
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

// Average Stock Price in the last "m" minutes
app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes } = req.query;

  try {
    const response = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const priceHistory = response.data.map(entry => ({
      price: entry.price,
      lastUpdatedAt: entry.lastUpdatedAt
    }));

    const averagePrice = priceHistory.reduce((sum, entry) => sum + entry.price, 0) / priceHistory.length;

    res.json({ averageStockPrice: averagePrice, priceHistory });
  } catch (error) {
    console.error("Error fetching stock price data: ", error.message);
    res.status(500).json({ error: 'Error retrieving stock price data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
