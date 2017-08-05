const winston = require('winston');
const path    = require('path');

module.exports = new winston.Logger({
  'transports': [
    new winston.transports.Console(),
    new winston.transports.File({'filename': './logs/go-anlayzer.log'})
  ]
});