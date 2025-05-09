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
// Correlation between two stocks in the last "m" minutes
app.get('/stockcorrelation', async (req, res) => {
    const { minutes, ticker1, ticker2 } = req.query;
  
    if (!ticker1 || !ticker2 || minutes <= 0) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
  
    try {
      const [stock1Data, stock2Data] = await Promise.all([
        axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker1}?minutes=${minutes}`, {
          headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        }),
        axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker2}?minutes=${minutes}`, {
          headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        })
      ]);
  
      const stock1Prices = stock1Data.data.map(entry => entry.price);
      const stock2Prices = stock2Data.data.map(entry => entry.price);
  
      const avg1 = stock1Prices.reduce((sum, p) => sum + p, 0) / stock1Prices.length;
      const avg2 = stock2Prices.reduce((sum, p) => sum + p, 0) / stock2Prices.length;
  
      const covariance = stock1Prices.reduce((sum, p1, i) => sum + (p1 - avg1) * (stock2Prices[i] - avg2), 0) / (stock1Prices.length - 1);
      const stdDev1 = Math.sqrt(stock1Prices.reduce((sum, p) => sum + Math.pow(p - avg1, 2), 0) / (stock1Prices.length - 1));
      const stdDev2 = Math.sqrt(stock2Prices.reduce((sum, p) => sum + Math.pow(p - avg2, 2), 0) / (stock2Prices.length - 1));
  
      const correlation = covariance / (stdDev1 * stdDev2);
  
      res.json({
        correlation,
        stocks: {
          [ticker1]: {
            averagePrice: avg1,
            priceHistory: stock1Data.data.map(entry => ({
              price: entry.price,
              lastUpdatedAt: entry.lastUpdatedAt
            }))
          },
          [ticker2]: {
            averagePrice: avg2,
            priceHistory: stock2Data.data.map(entry => ({
              price: entry.price,
              lastUpdatedAt: entry.lastUpdatedAt
            }))
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error calculating correlation between stocks.' });
    }
  });
  