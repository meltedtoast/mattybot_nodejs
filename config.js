const Binance = require('node-binance-api');

// Binance Client Configuration
const binance = new Binance().options({
  APIKEY: '',  // Insert your Binance API Key
  APISECRET: ''  // Insert your Binance API Secret
});

module.exports = binance;
