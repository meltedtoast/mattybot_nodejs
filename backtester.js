const getKlines = require('./dataFetcher');
const applyIndicators = require('./indicators');
const checkSignals = require('./signals');

async function backtest(symbol, interval, lookback, atrMultiplier = 2.0, feePerTrade = 40) {
  try {
    let data = await getKlines(symbol, interval, lookback);
    data = applyIndicators(data);
    data = checkSignals(data);

    let position = null;
    let entryPrice = 0;
    let totalProfit = 0;
    let winTrades = 0;
    let lossTrades = 0;
    let totalFees = 0;
    let results = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i].Buy && !position) {
        position = 'long';
        entryPrice = data[i].close;
        const stopLoss = entryPrice - atrMultiplier * data[i].ATR;
        const takeProfit = entryPrice + atrMultiplier * data[i].ATR;
        results.push(`Buy at ${data[i].timestamp}: ${entryPrice}, Stop Loss: ${stopLoss}, Take Profit: ${takeProfit}`);
      } else if (position === 'long') {
        if (data[i].close <= stopLoss || data[i].Sell) {
          position = null;
          const exitPrice = data[i].close;
          const profit = exitPrice - entryPrice;
          totalFees += feePerTrade;
          const netProfit = profit - feePerTrade;
          totalProfit += netProfit;
          netProfit > 0 ? winTrades++ : lossTrades++;
          results.push(`Sell at ${data[i].timestamp}: ${exitPrice}, Profit: ${profit}, Net Profit: ${netProfit}, Total Profit: ${totalProfit}, Fee: ${feePerTrade}`);
        } else if (data[i].close >= takeProfit) {
          position = null;
          const exitPrice = data[i].close;
          const profit = exitPrice - entryPrice;
          totalFees += feePerTrade;
          const netProfit = profit - feePerTrade;
          totalProfit += netProfit;
          winTrades++;
          results.push(`Take Profit at ${data[i].timestamp}: ${exitPrice}, Profit: ${profit}, Net Profit: ${netProfit}, Total Profit: ${totalProfit}, Fee: ${feePerTrade}`);
        }
      }
    }

    const totalTrades = winTrades + lossTrades;
    const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
    results.push(`Win Rate: ${winRate}% (${winTrades} wins, ${lossTrades} losses)`);
    results.push(`Total Profit: ${totalProfit}, Total Fees: ${totalFees}`);

    results.forEach(result => console.log(result));
  } catch (error) {
    console.error('Error in backtest:', error);
  }
}

module.exports = backtest;
