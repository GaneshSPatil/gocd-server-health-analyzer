const path = require('path');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const expect = require('chai').expect;
const stubbedRequires = {};

const request = sinon.stub();
const stubbedPath = {};
const stubbedLogger = {'error': sinon.stub()};
const stubbedDataAccessService = {'saveSupportLogs': sinon.stub()};

const loggerPath = path.resolve('lib/services/logger.js');
const dataAccessServicePath = path.resolve('lib/services/dataAccessService.js');

stubbedRequires.request = request;
stubbedRequires.path = stubbedPath;
stubbedRequires[loggerPath] = stubbedLogger;
stubbedRequires[dataAccessServicePath] = stubbedDataAccessService;

const capture = proxyquire(path.resolve('lib/capture/captureAPISupport'), stubbedRequires);

describe('Capture API Support', () => {
  afterEach(() => {
    request.reset();
    stubbedLogger.error.reset();
  });

  it('should capture and save API support logs', () => {
    const goServerUrl = 'go-server-url';
    const username = 'username';
    const password = 'password';

    const expectedOptions = {
      'url': `${goServerUrl}/api/support`,
      'method': 'GET',
      'auth': {
        username,
        password
      }
    };

    capture(goServerUrl, username, password);

    expect(request.getCall(0).args[0]).to.deep.equal(expectedOptions);
  });

  it('should log error occurred while requesting api support log', () => {
    const goServerUrl = 'go-server-url';
    const username = 'username';
    const password = 'password';

    request.yields(new Error('Boom!'));
    capture(goServerUrl, username, password);

    expect(stubbedLogger.error.getCall(0).args[0]).to.equal('An Error occurred while fetching API support log. Error:Error: Boom!');
  });

  it('should save api support log', () => {
    const goServerUrl = 'go-server-url';
    const username = 'username';
    const password = 'password';
    const supportLogs = {'foo': 'bar'};

    request.yields(null, {}, JSON.stringify(supportLogs));
    capture(goServerUrl, username, password);

    expect(stubbedDataAccessService.saveSupportLogs.getCall(0).args[0]).to.deep.equal(supportLogs);
  });
});
