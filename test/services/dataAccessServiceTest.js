const path = require('path');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const expect = require('chai').expect;
const stubbedRequires = {};

const stubbedFs = {'writeFile': sinon.stub()};
const stubbedPath = {};
const stubbedLogger = {
  'info': sinon.stub(),
  'error': sinon.stub()
};
const loggerPath = path.resolve('lib/services/logger.js');

stubbedRequires.fs = stubbedFs;
stubbedRequires.path = stubbedPath;
stubbedRequires[loggerPath] = stubbedLogger;

const dataAccessService = proxyquire(path.resolve('lib/services/dataAccessService'), stubbedRequires);

describe('Data Access Service', () => {
  describe('saveSupportLogs', () => {
    afterEach(() => {
      stubbedFs.writeFile.reset();
      stubbedLogger.info.reset();
      stubbedLogger.error.reset();
    });

    it('should save support logs under data directory', () => {
      stubbedFs.writeFile.resolves(undefined); //eslint-disable-line
      const logsJSON = {'Timestamp': 'current-time'};
      const expectedFilePath = `${path.resolve('data/')}/${logsJSON.Timestamp}`;

      dataAccessService.saveSupportLogs(logsJSON);

      expect(stubbedFs.writeFile.getCall(0).args[0]).to.equal(expectedFilePath);
      expect(stubbedFs.writeFile.getCall(0).args[1]).to.equal(JSON.stringify(logsJSON));
    });

    it('should log the status of save log operation', () => {
      const logsJSON = {'Timestamp': 'current-time'};

      stubbedFs.writeFile.yields(undefined); //eslint-disable-line

      dataAccessService.saveSupportLogs(logsJSON);
      expect(stubbedLogger.info.getCall(0).args[0]).to.equal('Done Saving API support logs.');
    });

    it('should log the failure of save log operation', () => {
      const logsJSON = {'Timestamp': 'current-time'};

      stubbedFs.writeFile.yields(new Error('Boom!')); //eslint-disable-line

      dataAccessService.saveSupportLogs(logsJSON);
      expect(stubbedLogger.error.getCall(0).args[0]).to.equal('Failed Saving API support logs. Error: Error: Boom!');
    });
  });
});
