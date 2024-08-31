const binance = require('./config');

async function getKlines(symbol, interval, lookback) {
  return new Promise((resolve, reject) => {
    binance.candlesticks(symbol, interval, (error, ticks) => {
      if (error) reject(error);
      const data = ticks.slice(-lookback).map(tick => ({
        timestamp: new Date(tick[0]),
        open: parseFloat(tick[1]),
        high: parseFloat(tick[2]),
        low: parseFloat(tick[3]),
        close: parseFloat(tick[4])
      }));
      resolve(data);
    });
  });
}

module.exports = getKlines;
