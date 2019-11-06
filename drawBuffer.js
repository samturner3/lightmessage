module.exports = async function drawBuffer() {
  globalMode.buffer.forEach((item) => {
    globalMode.led.drawText(item[0], item[1], item[2], item[3], item[4], item[5], item[6]);
  });
};
