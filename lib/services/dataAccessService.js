const path = require('path');
const fs = require('fs');
const LOGGER = require(path.resolve('lib/services/logger.js'));
// const db = require(path.resolve('lib/services/helpers/db.js'));
const dataDirectory = path.resolve('data/');

module.exports = {
  'saveSupportLogs': (logsJson) => {
    const timestamp = logsJson.Timestamp;

    fs.writeFile(`${dataDirectory}/${timestamp}`, logsJson, (err) => {
      err
        ? LOGGER.error(`Failed Saving API support logs. Error: ${err}`, {timestamp})
        : LOGGER.info('Done Saving API support logs.', {timestamp});
    });
  }
};
