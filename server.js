const path = require('path');
const captureAPISupport = require(path.resolve('lib/capture/captureAPISupport'));
const setup = require(path.resolve('lib/services/setupService'));

const GO_SERVER_URL = process.env.GO_SERVER_URL || 'http://localhost:8153/go';
const USERNAME = process.env.GO_SERVER_USERNAME || 'admin';
const PASSWORD = process.env.GO_SERVER_PASSWORD || 'badger';
const INTERVAL = process.env.GO_ANALYZER_FETCH_INTERVAL || 1000;

setup.clean();
setup.prepare();

setInterval(captureAPISupport, INTERVAL, GO_SERVER_URL, USERNAME, PASSWORD);
