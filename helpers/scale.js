// scales a number from one scale to another
// used to convert mqtt message (0-255 range) to bightness range (0-100)
module.exports = (number) => {
    const inMin = 0;
    const inMax = 255;
    const outMin = 0;
    const outMax = 100;

    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

}