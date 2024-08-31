function checkSignals(data) {
    data.forEach((item, index) => {
      if (index === 0) {
        item.Buy = false;
        item.Sell = false;
      } else {
        const prev = data[index - 1];
        item.Buy = (item.KAMA3 > item.KAMA9) && (prev.KAMA3 <= prev.KAMA9) && (item.MACD_HIST > prev.MACD_HIST);
        item.Sell = (item.KAMA3 < item.KAMA9) && (prev.KAMA3 >= prev.KAMA9);
      }
    });
  
    return data;
  }
  
  module.exports = checkSignals;
  