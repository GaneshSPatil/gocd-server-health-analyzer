const path = require('path');
const request = require('request');
const LOGGER = require(path.resolve('lib/services/logger'));
const dataAccessService = require(path.resolve('lib/services/dataAccessService'));

const capture = (supportLogUrl, username, password) => {
  const options = {
    'url': supportLogUrl,
    'method': 'GET',
    'auth': {
      username,
      password
    }
  };

  request(options, (err, _response, body) => {
    if (err) {
      return LOGGER.error(err);
    }
    dataAccessService.saveSupportLogs(JSON.parse(body));
  });
};

module.exports = (goServerUrl, username, password) => {
  capture(`${goServerUrl}/api/support`, username, password);
};
