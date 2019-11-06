const fonts = require('./fonts');
const drawStaticMessages = require('./drawStaticMessages');

module.exports = async function scrollAMessage(message, speed = 500, loops, y = 12, includeStaticMessages = false, fontIndex = 5) {
  const placeEndX = 50;
  const visibleLengthChars = 6;
  const startX = placeEndX + visibleLengthChars * fonts.getFontDimentions(fontIndex).x;
  const endXa = Math.abs((message.length + 1 + visibleLengthChars) * fonts.getFontDimentions(fontIndex).x) * -1;
  const endX = placeEndX + endXa;


  function delay() {
    return new Promise((resolve) => setTimeout(resolve, speed));
  }

  // function replaceAt(index, replacement) {
  //   return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  // }


  async function func2() {
    console.log('Started func2');
    let mystring = ' '.repeat(visibleLengthChars);
    let removed = 0;
    const mainMessage = ' '.repeat(visibleLengthChars) + message;
    const messageArray = mainMessage.split('');
    mystring = mystring.substring(0, (visibleLengthChars + removed));
    for (let x = startX; x > endX; x--) {
      // console.log('runn', x)
      // if (x <= placeEndX) {
      if (x <= placeEndX && x % fonts.getFontDimentions(fontIndex).x === 0) {
        // speed = 100;
        // mystring = mystring.substring(1);
        // mystring = mystring.replaceAt(0, ' ');
        // mystring = mystring.substr(0, 0) + ' ' + mystring.substr(0 + mystring.length);
        // mystring = message.substring(removed, mystring.length);
        mystring = ' '.repeat(removed) + mainMessage.substring(removed, mystring.length);
        mystring = mystring.substring(0, (visibleLengthChars + removed));
        if (messageArray[visibleLengthChars + removed] !== undefined) mystring += messageArray[visibleLengthChars + removed];
        removed++;
        console.log('>', mystring, '<');
        console.log(mystring.length);
        console.log('removed', removed);
      }
      // if (x <= placeEndX && x % 1 === 0) {
      //   mystring = mystring.substring(1);
      // }
      globalMode.led.clear();
      // if (removed > 0) globalMode.led.drawText(x, y, mystring, fonts.fontFiles[fontIndex], 0, 255, 0);
      globalMode.led.drawText(x, y, mystring, fonts.fontFiles[fontIndex], 0, 255, 0);
      // globalMode.led.drawLine(endX, 0, endX, 64, 255, 0, 0);
      // globalMode.led.drawLine(x, y, mystring, fonts.fontFiles[fontIndex], 0, 255, 0);
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
