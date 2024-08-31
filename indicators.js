const { KAMA, MACD, ATR } = require('technicalindicators');

function applyIndicators(data) {
  const closePrices = data.map(d => d.close);
  const highPrices = data.map(d => d.high);
  const lowPrices = data.map(d => d.low);

  const KAMA3 = KAMA.calculate({ period: 3, values: closePrices });
  const KAMA9 = KAMA.calculate({ period: 9, values: closePrices });
  const MACDresult = MACD.calculate({
    values: closePrices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
  const ATRresult = ATR.calculate({ period: 14, high: highPrices, low: lowPrices, close: closePrices });

  data.forEach((item, index) => {
    item.KAMA3 = KAMA3[index] || null;
    item.KAMA9 = KAMA9[index] || null;
    item.MACD = MACDresult[index] ? MACDresult[index].MACD : null;
    item.MACD_SIGNAL = MACDresult[index] ? MACDresult[index].signal : null;
    item.MACD_HIST = MACDresult[index] ? MACDresult[index].histogram : null;
    item.ATR = ATRresult[index] || null;
  });

  return data;
}

module.exports = applyIndicators;
