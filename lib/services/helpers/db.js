const Datastore = require('nedb');
const options = {
  'filename': './db/db.json',
  'autoload': true,
  'timestampData': true
};

module.exports = new Datastore(options);
