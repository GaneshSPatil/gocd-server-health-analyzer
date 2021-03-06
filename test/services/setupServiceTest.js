const path = require('path');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const expect = require('chai').expect;
const stubbedRequires = {};

const stubbedFs = {
  'existsSync': sinon.stub(),
  'rmdirSync': sinon.stub(),
  'readdirSync': sinon.stub(),
  'lstatSync': sinon.stub(),
  'unlinkSync': sinon.stub(),
  'mkdirSync': sinon.stub()
};
const stubbedPath = {};

stubbedRequires.fs = stubbedFs;
stubbedRequires.path = stubbedPath;

const setup = proxyquire(path.resolve('lib/services/setupService'), stubbedRequires);

describe('Setup Service', () => {
  beforeEach(() => {
    stubbedFs.existsSync.returns(true);
    stubbedFs.readdirSync.returns([]);
  });

  afterEach(() => {
    stubbedFs.existsSync.reset();
    stubbedFs.rmdirSync.reset();
    stubbedFs.unlinkSync.reset();
    stubbedFs.readdirSync.reset();
  });

  describe('clean', () => {
    it('should clean app specific folders', () => {
      const dataFolderPath = path.resolve('data/');
      const logsFolderPath = path.resolve('logs/');
      const dbFolderPath = path.resolve('db/');

      setup.clean();

      expect(stubbedFs.existsSync.getCall(0).args[0]).to.equal(dataFolderPath);
      expect(stubbedFs.existsSync.getCall(1).args[0]).to.equal(logsFolderPath);
      expect(stubbedFs.existsSync.getCall(2).args[0]).to.equal(dbFolderPath);

      expect(stubbedFs.rmdirSync.callCount).to.equal(3);

      expect(stubbedFs.rmdirSync.getCall(0).args[0]).to.equal(dataFolderPath);
      expect(stubbedFs.rmdirSync.getCall(1).args[0]).to.equal(logsFolderPath);
      expect(stubbedFs.rmdirSync.getCall(2).args[0]).to.equal(dbFolderPath);
    });

    it('should clean folders recursively', () => {
      const dataFolderPath = path.resolve('data/');
      const fileName = 'some-file';
      const folderName = 'recursive-folder';

      stubbedFs.lstatSync.onCall(0).returns({'isDirectory': () => false});
      stubbedFs.lstatSync.onCall(1).returns({'isDirectory': () => true});
      stubbedFs.readdirSync.onCall(0).returns([fileName, folderName]);
      stubbedFs.readdirSync.onCall(1).returns([]);
      setup.clean();

      expect(stubbedFs.unlinkSync.getCall(0).args[0]).to.equal(`${dataFolderPath}/${fileName}`);

      expect(stubbedFs.rmdirSync.getCall(0).args[0]).to.contains(folderName);
      expect(stubbedFs.rmdirSync.getCall(1).args[0]).to.equal(dataFolderPath);
    });

    it('should not clean when folders doesnt exists', () => {
      stubbedFs.existsSync.returns(false);
      setup.clean();
      expect(stubbedFs.rmdirSync.callCount).to.equal(0);
    });

    it('should unset environment variables', () => {
      process.env = {};
      process.env.GO_SERVER_URL = 'server-url';
      process.env.GO_SERVER_USERNAME = 'username';
      process.env.GO_SERVER_PASSWORD = 'password';
      process.env.GO_ANALYZER_FETCH_INTERVAL = 'timeout';

      setup.clean();

      expect(process.env.GO_SERVER_URL).to.equal('');
      expect(process.env.GO_SERVER_USERNAME).to.equal('');
      expect(process.env.GO_SERVER_PASSWORD).to.equal('');
      expect(process.env.GO_ANALYZER_FETCH_INTERVAL).to.equal('');
    });
  });

  describe('prepare', () => {
    it('should create app specific folders', () => {
      const dataFolderPath = path.resolve('data/');
      const logsFolderPath = path.resolve('logs/');
      const dbFolderPath = path.resolve('db/');

      setup.prepare();
      expect(stubbedFs.mkdirSync.callCount).to.equal(3);

      expect(stubbedFs.mkdirSync.getCall(0).args[0]).to.equal(dataFolderPath);
      expect(stubbedFs.mkdirSync.getCall(1).args[0]).to.equal(logsFolderPath);
      expect(stubbedFs.mkdirSync.getCall(2).args[0]).to.equal(dbFolderPath);
    });

    it('should unset environment variables', () => {
      setup.prepare();

      expect(process.env.GO_SERVER_URL).to.equal('http://localhost:8153/go');
      expect(process.env.GO_SERVER_USERNAME).to.equal('admin');
      expect(process.env.GO_SERVER_PASSWORD).to.equal('badger');
      expect(process.env.GO_ANALYZER_FETCH_INTERVAL).to.equal('1000');
    });
  });
});
