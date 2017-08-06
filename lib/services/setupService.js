const fs = require('fs');
const path = require('path');

const deleteFolderRecursive = function (pathToFolder) {
  if (fs.existsSync(pathToFolder)) {
    fs.readdirSync(pathToFolder).forEach((file) => {
      const curPath = `${pathToFolder}/${file}`;

      fs.lstatSync(curPath).isDirectory()
        ? deleteFolderRecursive(curPath)
        : fs.unlinkSync(curPath);
    });

    fs.rmdirSync(pathToFolder);
  }
};

const dataFolder = path.resolve('data');
const goAnalyzerLog = path.resolve('logs');
const goAnalyzerDb = path.resolve('db');

module.exports = {
  'clean': () => {
    deleteFolderRecursive(dataFolder);
    deleteFolderRecursive(goAnalyzerLog);
    deleteFolderRecursive(goAnalyzerDb);

    process.env.GO_SERVER_URL = '';
    process.env.GO_SERVER_USERNAME = '';
    process.env.GO_SERVER_PASSWORD = '';
    process.env.GO_ANALYZER_FETCH_INTERVAL = '';
  },

  'prepare': () => {
    fs.mkdirSync(dataFolder);
    fs.mkdirSync(goAnalyzerLog);
    fs.mkdirSync(goAnalyzerDb);

    process.env.GO_SERVER_URL = 'http://localhost:8153/go';
    process.env.GO_SERVER_USERNAME = 'admin';
    process.env.GO_SERVER_PASSWORD = 'badger';
    process.env.GO_ANALYZER_FETCH_INTERVAL = '1000';
  }
};
