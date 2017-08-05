const Datastore = require('nedb');
let options     = {
  filename: './db/db.json',
  autoload: true,
  timestampData: true,
};

module.exports = new Datastore(options);