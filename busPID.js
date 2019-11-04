const axios = require('axios');
const moment = require('moment');

const fonts = require('./fonts');
const scrollAMessage = require('./scrollAMessage');

const stopId = '2035193';
let busData;
let alerts;
const font = 3;
const fontHeight = 6;

const fromNow = function fromNow(depatureTime) {
  const timeNow = moment().unix();
  const duration = depatureTime - timeNow;
  const longStrH = moment().startOf('day')
    .seconds(duration)
    .format('H');
  const longStrM = moment().startOf('day')
    .seconds(duration)
    .format('m');

  if (longStrH !== '0') return [longStrH, 'hr', longStrM, 'min'];
  if (longStrM === '0') return ['now'];
  return [longStrM, 'min'];
//   if (longStrH !== '0') return `${longStrH}hr${longStrM}min`;
//   if (longStrM === '0') return 'now';
//   return `${longStrM}min`;
};

function compare(a, b) {
  if (a.stopTimeInstance.arrival.time < b.stopTimeInstance.arrival.time) {
    return -1;
  }
  if (a.stopTimeInstance.arrival.time > b.stopTimeInstance.arrival.time) {
    return 1;
  }
  return 0;
}

const getBusData = async function getBusData() {
  try {
    // const response = await axios.get('https://anytrip.com.au/api/v3/region/au2/departures/au2:200060?stopId=au2:200060&offset=0', {
    //   params: {
    //     limit: '25',
    //     ts: moment().unix(),
    //   },
    const response = await axios.get(`https://anytrip.com.au/api/v3/region/au2/departures/au2:${stopId}`, {
      params: {
        limit: '25',
        ts: moment().unix(),
      },
    });
    // console.log('Moment: ', moment().valueOf());
    // console.log(response.data);
    // console.log(response.data.response.departures);
    busData = response.data.response.departures;
    // alerts = response.data.response.alerts;
    alerts = response.data.response.alerts;
  } catch (error) {
    console.error(error);
  }
};


module.exports = async function busPID() {
  const startX = globalMode.led.getWidth();
  const endX = 0;
  const speed = 1000000;

  function delay() {
    return new Promise((resolve) => setTimeout(resolve, speed));
  }

  async function func2() {
    console.log('Started func2');
    let line = -2;
    const sortedBusData = busData.sort(compare);
    let col = 0;
    let sortedPass = 0;
    console.log(alerts);
    for (let x = 0; x < sortedBusData.length; x++) {
      if (sortedBusData[x].stopTimeInstance.arrival.time > moment().unix()) {
        if (sortedPass === 3) { col += 10; line = fontHeight + 5; }
        console.log(sortedBusData[x].tripInstance.trip.route.name, sortedBusData[x].stopTimeInstance.arrival.time, fromNow(sortedBusData[x].stopTimeInstance.arrival.time), sortedPass, col);
        const timeTill = fromNow(sortedBusData[x].stopTimeInstance.arrival.time);
        const route = sortedBusData[x].tripInstance.trip.route.name;
        globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, '', (0 + col)), line, route, fonts.fontFiles[5], 255, 0, 0);
        if (timeTill.length === 1) { globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), line, timeTill[0], fonts.fontFiles[5], 255, 255, 255); }
        if (timeTill.length === 2) {
          globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), line, timeTill[0], fonts.fontFiles[5], 0, 255, 0);
          globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route + timeTill[1], (col + 0.2)), (line + 3), timeTill[1], fonts.fontFiles[2], 255, 255, 255);
        }
        if (timeTill.length === 4) {
          globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), line, timeTill[0], fonts.fontFiles[5], 0, 255, 0);
          globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route + timeTill[1], (col - 0.5)), (line + 3), timeTill[1], fonts.fontFiles[2], 255, 255, 255);
          globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route + timeTill[1] + timeTill[2], (col + 0.5)), line, timeTill[2], fonts.fontFiles[5], 0, 255, 0);
          globalMode.led.drawText(fonts.getFontDimentionsSpacing('x', 5, route + timeTill[1] + timeTill[2] + timeTill[3], (col - 1.5)), (line + 3), timeTill[3], fonts.fontFiles[2], 255, 255, 255);
        }

        line += fontHeight + 5;
        sortedPass++;
      }
    }
    if (alerts.length >= 1) {
      for (let x = 0; x < alerts.length; x++) {
        await scrollAMessage(`${alerts[x].header.toUpperCase()} - ${alerts[x].description}`, 5, 1, 1, false);
      }
    } else {
      globalMode.led.drawText(60, 0, moment().format('h:mm a'), fonts.fontFiles[15], 100, 255, 255);
    }
    globalMode.led.update();
  }

  async function func1() {
    await func2();
    await delay(speed);
  }

  await getBusData();
  await func1();
  console.log('finished');
};
