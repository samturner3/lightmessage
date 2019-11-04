module.exports = {
  fontFiles: [
    `${__dirname}/fonts/4x6.bdf`, // 0
    `${__dirname}/fonts/5x7.bdf`, // 1
    `${__dirname}/fonts/5x8.bdf`, // 2
    `${__dirname}/fonts/6x9.bdf`, // 3
    `${__dirname}/fonts/6x10.bdf`, // 4
    `${__dirname}/fonts/6x12.bdf`, // 5
    `${__dirname}/fonts/6x13.bdf`, // 6
    `${__dirname}/fonts/6x13B.bdf`, // 7
    `${__dirname}/fonts/6x13O.bdf`, // 8
    `${__dirname}/fonts/7x13.bdf`, // 9
    `${__dirname}/fonts/7x13B.bdf`, // 10
    `${__dirname}/fonts/7x13O.bdf`, // 11
    `${__dirname}/fonts/7x14.bdf`, // 12
    `${__dirname}/fonts/7x14B.bdf`, // 13
    `${__dirname}/fonts/8x13.bdf`, // 14
    `${__dirname}/fonts/8x13B.bdf`, // 15
    `${__dirname}/fonts/8x13O.bdf`, // 16
    `${__dirname}/fonts/9x15.bdf`, // 17
    `${__dirname}/fonts/9x15B.bdf`, // 18
    `${__dirname}/fonts/9x18.bdf`, // 19
    `${__dirname}/fonts/9x18B.bdf`, // 20
    `${__dirname}/fonts/10x20.bdf`, // 21
    `${__dirname}/fonts/cIR6x12.bdf`, // 22
    `${__dirname}/fonts/helvR12.bdf`, // 23
    `${__dirname}/fonts/tom-thumb.bdf`, // 24
  ],
  getFontDimentions: function getFontDimentions(fontIndex) {
    const x = module.exports.fontFiles[fontIndex].split('/fonts/')[1].split('x')[0].replace(/\D/g, '');
    const y = module.exports.fontFiles[fontIndex].split('/fonts/')[1].split('x')[1].replace(/\D/g, '');

    return ({ x, y });
  },
  getFontDimentionsSpacing: function getFontDimentionsSpacing(pos, fontIndex, string, additonalSpace) {
    const x = module.exports.fontFiles[fontIndex].split('/fonts/')[1].split('x')[0].replace(/\D/g, '');
    const y = module.exports.fontFiles[fontIndex].split('/fonts/')[1].split('x')[1].replace(/\D/g, '');
    // console.log('x:', x, ' y:',y)

    if (pos === 'x') { return (x * string.length + additonalSpace * x); }
    return (y * string.length + additonalSpace * y);
  },
};
