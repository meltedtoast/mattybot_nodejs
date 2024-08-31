const backtest = require('./backtester');

const symbol = 'BTCUSDT';
const interval = '15m';
const lookback = 1000;
const atrMultiplier = 2.0;
const feePerTrade = 40;

(async () => {
  while (true) {
    await backtest(symbol, interval, lookback, atrMultiplier, feePerTrade);
    await new Promise(resolve => setTimeout(resolve, 60000));  // Wait for the next interval
  }
})();
