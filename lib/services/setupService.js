const fs   = require('fs');
const path = require('path');

var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const dataFolder    = path.resolve('data');
const goAnalyzerLog = path.resolve('logs');
const goAnalyzerDb = path.resolve('db');

module.exports      = {
  clean: () => {
    deleteFolderRecursive(dataFolder);
    deleteFolderRecursive(goAnalyzerLog);
    deleteFolderRecursive(goAnalyzerDb);

    process.env.GO_SERVER_URL              = '';
    process.env.GO_SERVER_USERNAME         = '';
    process.env.GO_SERVER_PASSWORD         = '';
    process.env.GO_ANALYZER_FETCH_INTERVAL = '';
  },

  prepare: () => {
    fs.mkdirSync(dataFolder);
    fs.mkdirSync(goAnalyzerLog);
    fs.mkdirSync(goAnalyzerDb);

    process.env.GO_SERVER_URL              = 'http://localhost:8153/go';
    process.env.GO_SERVER_USERNAME         = 'admin';
    process.env.GO_SERVER_PASSWORD         = 'badger';
    process.env.GO_ANALYZER_FETCH_INTERVAL = '1000';
  }
};
