const axios = require('axios');
const moment = require('moment');

const fonts = require('./fonts');
const scrollAMessage = require('./scrollAMessage');
const scrollMessageInPlace = require('./scrollMessageInPlace');
const drawBuffer = require('./drawBuffer');
const BufferItem = require('./bufferItem');

// const stopId = '2035193'; // Home bus
const stopId = '200073'; // St James
// const stopId = '2000392'; // Townhall platform 2
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
  if (a.stopTimeInstance.departure.time < b.stopTimeInstance.departure.time) {
    return -1;
  }
  if (a.stopTimeInstance.departure.time > b.stopTimeInstance.departure.time) {
    return 1;
  }
  return 0;
}

const getBusData = async function getBusData() {
  if (globalMode.static.busPid.lastUpdated === null || Math.abs(moment().unix() - globalMode.static.busPid.lastUpdated > 10)) { // in seconds
    globalMode.static.busPid.lastUpdated = moment().unix();
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
      // alerts = [];
      globalMode.static.busPid.fetched = true;
      // console.log('Updated bus data', globalMode.static.busPid.lastUpdated);
    } catch (error) {
      console.log(moment().format(), error);
      globalMode.static.busPid.error = true;
    }
  } // else //console.log('no need to update bus data', globalMode.static.busPid.lastUpdated, moment().unix(), moment().unix() - globalMode.static.busPid.lastUpdated);
};


module.exports = async function busPID() {
  const startX = globalMode.led.getWidth();
  const endX = 0;
  const speed = 3000; // in millasecondsd

  function delay() {
    return new Promise((resolve) => setTimeout(resolve, speed));
  }

  async function displayBusData() {
    // console.log('Started displayBusData');
    let line = -2;
    const sortedBusData = busData.sort(compare);
    let col = 0;
    let sortedPass = 0;
    if (globalMode.static.busPid.routeTimeDisplayChangedLast === null || Math.abs(moment().unix() - globalMode.static.busPid.routeTimeDisplayChangedLast > 1)) {
      console.log('displayMode', globalMode.static.busPid.displayMode);
      if (globalMode.static.busPid.displayMode === 'time') { globalMode.static.busPid.displayMode = 'countDown'; } else if (globalMode.static.busPid.displayMode === 'countDown') { globalMode.static.busPid.displayMode = 'delay'; } else { globalMode.static.busPid.displayMode = 'time'; }
      // if (globalMode.static.busPid.displayMode === 1) { globalMode.static.busPid.displayMode = 2; } else if (globalMode.static.busPid.displayMode === 2) { globalMode.static.busPid.displayMode = 3; } else if (globalMode.static.busPid.displayMode === 3) { globalMode.static.busPid.displayMode = 1; } else globalMode.static.busPid.displayMode = 1;
      globalMode.static.busPid.routeTimeDisplayChangedLast = moment().unix();
    }
    // console.log(alerts);
    for (let x = 0; x < sortedBusData.length; x++) {
      if (sortedBusData[x].stopTimeInstance.departure.time > moment().unix()) {
        if (sortedPass === 3) { col += 10; line = fontHeight + 5; }
        // console.log(sortedBusData[x].tripInstance.trip.route.name, sortedBusData[x].stopTimeInstance.departure.time, fromNow(sortedBusData[x].stopTimeInstance.departure.time), sortedPass, col);
        const timeTill = fromNow(sortedBusData[x].stopTimeInstance.departure.time);
        const route = sortedBusData[x].tripInstance.trip.route.name;
        const departureTime = moment.unix(sortedBusData[x].stopTimeInstance.departure.time).format('h:mma');
        const delayDeparture = sortedBusData[x].stopTimeInstance.departure.delay ? sortedBusData[x].stopTimeInstance.departure.delay : null;
        let delayDisplay;
        let delayDisplayColours = [255, 255, 255];
        let delayFactor = 'min';
        if (delayDeparture !== null && delayDeparture !== undefined) {
          delayFactor = `${Math.abs(Math.round((delayDeparture / 60))).toString()}m`;
          if (delayDeparture > -60 && delayDeparture < 60) { delayDisplay = 'ON TIME'; delayDisplayColours = [0, 255, 0]; } else if (delayDeparture > 60) { delayDisplay = `${delayFactor} LATE`; delayDisplayColours = [255, 0, 0]; } else if (delayDeparture < -60) { delayDisplay = `${delayFactor} EARLY`; delayDisplayColours = [0, 0, 255]; }
        }
        globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, '', (0 + col)), line, route, fonts.fontFiles[5], 255, 0, 0));
        if (timeTill.length === 1) { globalMode.buffer.push(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), line, timeTill[0], fonts.fontFiles[5], 255, 255, 255); }
        if (timeTill.length === 2) {
          if (globalMode.static.busPid.displayMode === 'countDown') {
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), line, timeTill[0], fonts.fontFiles[5], 0, 255, 0));
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, route + timeTill[0], (col + 1)), (line + 3), timeTill[1], fonts.fontFiles[2], 255, 255, 255));
          } else if (globalMode.static.busPid.displayMode === 'time') {
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), (line + 3), departureTime, fonts.fontFiles[2], 0, 255, 0));
          } else if (globalMode.static.busPid.displayMode === 'delay') {
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), (line + 3), delayDisplay, fonts.fontFiles[2], delayDisplayColours[0], delayDisplayColours[1], delayDisplayColours[2]));
          }
        }
        if (timeTill.length === 4) {
          if (globalMode.static.busPid.displayMode === 'countDown') {
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), line, timeTill[0], fonts.fontFiles[5], 0, 255, 0));
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, `${route} ${timeTill[0]}`, (col)), (line + 3), timeTill[1], fonts.fontFiles[2], 255, 255, 255));
            // globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, `${route} ${timeTill[0]}${timeTill[1]}`, (col)), line, timeTill[2], fonts.fontFiles[5], 0, 255, 0));
            // globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, `${route} ${timeTill[0]} ${timeTill[1]} ${timeTill[2]}`, (col - 1.5)), (line + 3), timeTill[3], fonts.fontFiles[2], 255, 255, 255));
          } else if (globalMode.static.busPid.displayMode === 'time') {
            globalMode.buffer.push(new BufferItem(fonts.getFontDimentionsSpacing('x', 5, route, (0.5 + col)), (line + 3), departureTime, fonts.fontFiles[2], 0, 255, 0));
          }
        }

        line += fontHeight + 5;
        sortedPass++;
      }
    }
    if (alerts.length >= 1) {
      if (globalMode.static.busPid.alertsLastScrolled === null || Math.abs(moment().unix() - globalMode.static.busPid.alertsLastScrolled > 120)) { // in seconds
        for (let x = 0; x < alerts.length; x++) {
          if (alerts[x].active === true) {
            const createdTime = moment.unix(alerts[x].createdTime);
            console.log(alerts[x]);
            await scrollMessageInPlace(`${alerts[x].header.toUpperCase()} - ${createdTime.format('h:mma')} - ${alerts[x].description}`, 70, 0, 12, 10);
            // await scrollMessageInPlace(`${alerts[x].header.toUpperCase()} - (${moment.unix(alerts[x].activePeriods.start).format('h:mma')} - ${moment.unix(alerts[x].activePeriods.end).format('h:mma')}) ${alerts[x].description}`, 70, 0, 12, 10);=
            await scrollMessageInPlace(`${moment().format('h:mma')}`, 70, 0, 12, 10, 15, false, true, 255, 255, 0);
          }
        }
        globalMode.static.busPid.alertsLastScrolled = moment().unix();
        globalMode.buffer = [];
      } else {
        globalMode.led.drawText(60, 0, moment().format('h:mma'), fonts.fontFiles[15], 255, 255, 0);
        // globalMode.buffer.push(45, 0, 'Town Hall Plat 2', fonts.fontFiles[1], 100, 255, 255);
        drawBuffer();
        globalMode.led.update();
        globalMode.buffer = [];
      }
    } else {
      globalMode.led.drawText(60, 0, moment().format('h:mma'), fonts.fontFiles[15], 255, 255, 0);
      // globalMode.buffer.push(45, 0, 'Town Hall Plat 2', fonts.fontFiles[1], 100, 255, 255);
      drawBuffer();
      globalMode.led.update();
      globalMode.buffer = [];
    }
  }

  async function func1() {
    while (globalMode.busPIDMode === true) {
      globalMode.led.clear();
      getBusData();
      if (globalMode.static.busPid.fetched === true) await displayBusData();
      else {
        globalMode.led.drawText(0, 0, 'Loading Data...', fonts.fontFiles[4], 100, 255, 255);
        globalMode.led.update();
      }
      await delay(speed);
    }
  }

  await func1();
  console.log('finished');
};
