Stock Price API
A simple REST API built with Express that retrieves stock price data and calculates the correlation between two stocks.

Features
Average Stock Price: Retrieve the average stock price for a specific ticker over the last "m" minutes.

Stock Correlation: Calculate the correlation between two stocks over the last "m" minutes.

Technologies Used
Node.js

Express: Web framework for building the API.

Axios: HTTP client for making requests to an external stock service.

Installation
Clone the repository:

git clone https://github.com/yourusername/stock-price-api.git

cd stock-price-api

Install dependencies:

npm install

Set up your access token in the index.js file.

Start the server:

npm start (The server will run on port 3000 by default.)

API Endpoints
GET /stocks/:ticker: Get the average stock price for a given ticker over the last "m" minutes.

GET /stockcorrelation: Get the correlation between two stocks over the last "m" minutes.
