const coinTicker = require('coin-ticker');

module.exports = function coinTickerLoop() {
  setTimeout(async () => {
    // console.log('time updated'){
    let usd;
    coinTicker('poloniex', 'DOGE_USD')
      .then((pairs) => {
        console.log(pairs);
        usd = pairs.last;
      });

    globalMode.tick.values.coinTicker = `1 DOGE = ${usd}`;
    if (!globalMode.tick.coinTicker || globalMode.brightness === 1) globalMode.tick.values.coinTicker = undefined;
    coinTickerLoop();
  }, 60000);
};
