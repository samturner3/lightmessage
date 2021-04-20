const coinTicker = require('coin-ticker');

module.exports = function coinTickerLoop() {
  setTimeout(async () => {
    // console.log('time updated'){
    coinTicker('poloniex', 'DOGE_USD')
      .then((pairs) => {
        console.log(pairs);
        globalMode.tick.values.coinTicker = `1 DOGE = ${pairs.last} USD = ${3163*pairs.last}`;
      });

    if (!globalMode.tick.coinTicker || globalMode.brightness === 1) globalMode.tick.values.coinTicker = undefined;
    coinTickerLoop();
  }, 5000);
};
