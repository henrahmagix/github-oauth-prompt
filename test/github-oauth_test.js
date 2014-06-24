'use strict';

var oauth = require('../lib/github-oauth.js');

// Mock the GitHub API.
var nock = require('nock');
var api = nock('https://api.github.com').log(console.log);
api.get('/').reply(200);

/*
    ======== A Handy Little Mocha Reference ========
    https://github.com/visionmedia/mocha/

    Test assertions:
        assert.fail(actual, expected, message, operator)
        assert(value, message), assert.ok(value, [message])
        assert.equal(actual, expected, [message])
        assert.notEqual(actual, expected, [message])
        assert.deepEqual(actual, expected, [message])
        assert.notDeepEqual(actual, expected, [message])
        assert.strictEqual(actual, expected, [message])
        assert.notStrictEqual(actual, expected, [message])
        assert.throws(block, [error], [message])
        assert.doesNotThrow(block, [message])
        assert.ifError(value)

        Apart from assert, Mocha allows you to use any of the following assertion libraries:
        - should.js
        - chai
        - expect.js
        - better-assert
*/

var assert = require('assert');

describe('Oauth', function () {

    beforeEach(function () {
        nock.cleanAll();
    });

    it("should return 'Token' string when called", function () {
        assert.equal(oauth(), 'Token');
    });

    // Init.
    it('should error if required field "name" not given');
    it('should error if field "scopes" cannot be made into an array');

    // Normal use: asks for details.
    it('should not error on username input');
    it('should error and ask for input again on no username input');
    it('should not error on password input');
    it('should error and ask for input again on no password input');
    it('should continue after password input when no 2FA code required');
    it('should ask for a 2FA code when required');
    it('should not error on 2FA code input');
    it('should error and ask for input again on no 2FA code input');

    // Static use: accepts details.
    it('should error when username is not passed to static call');
    it('should error when password is not passed to static call');
    it('should return a 2FA code request from a static call if required');
    it('should error when 2FA code is required and not given for a static call');

    // Authentication test.
    it('should error an authentication test with bad credentials when 2FA not required');
    it('should error an authentication test with bad credentials when 2FA required');
    it('should succeed an authentication test with good basic credentials');
    it('should succeed an authentication test with good 2FA credentials');

    // Token creation.
    it('should error when it cannot connect to the api');
    it('should explain when rate limit remaining is 0');
    it('should create and return a new token');
    it('should get and return an existing token by name');

});
