const fonts = require('./fonts');
const drawStaticMessages = require('./drawStaticMessages');

module.exports = async function scrollAMessage(message, speed = 5, loops, y = 12, includeStaticMessages = true) {
  const startX = (32 * 4);
  const endX = Math.abs(message.length * 6) * -1;

  function delay() {
    return new Promise((resolve) => setTimeout(resolve, speed));
  }

  async function func2() {
    console.log('Started func2');
    for (let x = startX; x > endX; x--) {
      // console.log('runn', x)
      globalMode.led.clear();
      globalMode.led.drawText(x, y, message, fonts.fontFiles[3], 0, 255, 0);
      if (includeStaticMessages) {
        drawStaticMessages();
      }
      globalMode.led.update();
      await delay(speed);
    }
  }

  async function func1() {
    for (let i = 0; i < loops; i++) {
      console.log(`func1 waiting for func2 #${i + 1}`);
      await func2(); // await in loop until func2() completed
      console.log(`Finished iteration ${i} for func1`);
    }
  }

  await func1();
  console.log('finished');
};
