const fonts = require('./fonts');
const drawStaticMessages = require('./drawStaticMessages');

module.exports = async function scrollAMessage(message, speed = 5, y = 12, includeStaticMessages = false) {
  const startX = (32 * 4);
  const endX = Math.abs(message.length * 10) * -1;

  function delay() {
    return new Promise((resolve) => setTimeout(resolve, speed));
  }

  async function func2() {
    console.log('Started func2');
    for (let x = startX; x > endX; x--) {
      // console.log('runn', x)
      globalMode.led.clear();
      if (includeStaticMessages) {
        drawStaticMessages();
      }
      globalMode.led.drawText(x, y, message, fonts.fontFiles[5], 0, 255, 0);
      globalMode.led.update();
      await delay(speed);
    }
  }

  async function func1() {
    for (let i = 0; i < 1; i++) {
      console.log(`func1 waiting for func2 #${i + 1}`);
      await func2(); // await in loop until func2() completed
      console.log(`Finished iteration ${i} for func1`);
    }
  }

  await func1();
  console.log('finished');
};
