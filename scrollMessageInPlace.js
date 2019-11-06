const fonts = require('./fonts');
const drawBuffer = require('./drawBuffer');
const drawStaticMessages = require('./drawStaticMessages');


module.exports = async function scrollMessageInPlace(message, placeEndX = 50, y = 12, visibleLengthChars = 6, speed = 10, fontIndex = 5, includeStaticMessages = false, executeBuffer = true, r = 0, g = 255, b = 0) {
  const startX = placeEndX + visibleLengthChars * fonts.getFontDimentions(fontIndex).x;
  const endXa = Math.abs((message.length + 1 + visibleLengthChars) * fonts.getFontDimentions(fontIndex).x) * -1;
  const endX = placeEndX + endXa;

  function delay() {
    return new Promise((resolve) => setTimeout(resolve, speed));
  }

  async function func2() {
    console.log('Started func2');
    let mystring = ' '.repeat(visibleLengthChars);
    let removed = 0;
    const mainMessage = ' '.repeat(visibleLengthChars) + message;
    const messageArray = mainMessage.split('');
    mystring = mystring.substring(0, (visibleLengthChars + removed));
    for (let x = startX; x > endX; x--) {
      if (x <= placeEndX && x % fonts.getFontDimentions(fontIndex).x === 0) {
        mystring = ' '.repeat(removed) + mainMessage.substring(removed, mystring.length);
        mystring = mystring.substring(0, (visibleLengthChars + removed));
        if (messageArray[visibleLengthChars + removed] !== undefined) mystring += messageArray[visibleLengthChars + removed];
        removed++;
      }
      globalMode.led.clear();
      if (includeStaticMessages === true) {
        drawStaticMessages();
      }
      if (executeBuffer === true) {
        drawBuffer();
      }
      globalMode.led.drawText(x, y, mystring, fonts.fontFiles[fontIndex], r, g, b);
      globalMode.led.update();
      await delay(speed);
    }
  }

  // async function func1() {
  //   for (let i = 0; i < 1; i++) {
  //     // console.log(`func1 waiting for func2 #${i + 1}`);
  //     await func2(); // await in loop until func2() completed
  //     // console.log(`Finished iteration ${i} for func1`);
  //   }
  // }

  await func2();
  // console.log('finished');
};
