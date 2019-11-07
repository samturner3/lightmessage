module.exports = async function drawBuffer() {
  globalMode.buffer.forEach((item) => {
    globalMode.led.drawText(item.x, item.y, item.text, item.font, item.r, item.g, item.b);
  });
};

// drawText (x, y, text, font, r, g, b)
