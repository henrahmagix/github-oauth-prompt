'use strict';

var oauth = require('../lib/github-oauth.js');
var _ = require('lodash');

// Mock the GitHub API.
var nock = require('nock');
var apiResponse = require('./api-response')(nock);

// Allow a pseudo-breakpoint to be passed through to the main code.
function setBreakpoint (name) {
    process.env.GITHUB_OAUTH_TESTING = name;
}
function clearBreakpoint() {
    // Default the testing environment variable to the string of 'true'.
    setBreakpoint(true);
}
// Init the testing env.
clearBreakpoint();

// Dry the calling of oauth().
function run (options, callback) {
    if (_.isUndefined(options)) {
        options = {};
    }
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }
    options = _.extend({name: 'my-token'}, options);
    if (_.isUndefined(callback)) {
        callback = function () {};
    }
    var thisPrompt = oauth(options, callback);
    thisPrompt.rl.output.mute();
    return thisPrompt;
}

var assert = require('assert');
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

describe('Oauth', function () {

    var prompt;

    beforeEach(function () {
        clearBreakpoint();
        if (prompt && prompt.rl) {
            prompt.close();
            prompt = null;
        }
        process.setMaxListeners(0);
        nock.cleanAll();
    });



    // Init option.
    describe('Option: name', function () {

        it('should error if nothing is passed', function () {
            assert.throws(
                function () {
                    oauth();
                },
                /Option name is required/
            );
        });

        it('should not error if required field "name" is given as a string of length', function () {
            assert.doesNotThrow(function () {
                oauth({name: 'my-token'});
            });
        });

        // Falsey.
        _.each(
            {
                'undefined': void 0,
                'null': null,
                'false': false,
                '0': 0,
                'NaN': NaN,
                'empty string': ''
            },
            function (wrongType, identifier) {
                it('should error if required field "name" is given as: ' + identifier, function () {
                    assert.throws(
                        function () {
                            oauth({name: wrongType});
                        },
                        /Option name is required/
                    );
                });
            }
        );

        // Truthy.
        _.each(
            {
                'true': true,
                '1': 1,
                'Infinity': Infinity,
                'array': [],
                'object': {}
            },
            function (wrongType, identifier) {
                it('should error if required field "name" is given as: ' + identifier, function () {
                    assert.throws(
                        function () {
                            oauth({name: wrongType});
                        },
                        /Option name must be a string/
                    );
                });
            }
        );

    });



    // Init option.
    describe('Option: scopes', function () {

        // Optional: defined or passed.
        _.each(
            {
                'null': null,
                'false': false,
                'true': true,
                'number': 1,
                'NaN': NaN,
                'empty string': '',
                'string of length': 'string',
                'object': {}
            },
            function (wrongType, identifier) {
                it('should error if optional field "scopes" is given as: ' + identifier, function () {
                    assert.throws(
                        function () {
                            oauth({
                                name: 'my-token',
                                scopes: wrongType
                            });
                        },
                        /Option scopes must be an array/
                    );
                });
            }
        );

        // Optional: undefined or not passed.
        _.each(
            {
                'undefined': void 0,
                'array': [],
                'array of length': ['scopes'],
            },
            function (rightType, identifier) {
                it('should not error if optional field "scopes" is given as: ' + identifier, function () {
                    assert.doesNotThrow(function () {
                        oauth({
                            name: 'my-token',
                            scopes: rightType
                        });
                    });
                });
            }
        );

    });



    // Init option.
    describe('Option: url', function () {

        // Optional: defined or passed.
        _.each(
            {
                'null': null,
                'false': false,
                'true': true,
                'number': 1,
                'NaN': NaN,
                'array': [],
                'array of length': ['url'],
                'object': {}
            },
            function (wrongType, identifier) {
                it('should error if optional field "url" is given as: ' + identifier, function () {
                    assert.throws(
                        function () {
                            oauth({
                                name: 'my-token',
                                url: wrongType
                            });
                        },
                        /Option url must be a string/
                    );
                });
            }
        );

        // Optional: undefined or not passed.
        _.each(
            {
                'undefined': void 0,
                'empty string': '',
                'string of length': 'string'
            },
            function (rightType, identifier) {
                it('should not error if optional field "url" is given as: ' + identifier, function () {
                    assert.doesNotThrow(function () {
                        oauth({
                            name: 'my-token',
                            url: rightType
                        });
                    });
                });
            }
        );

    });


    // Normal use: asks for details.
    describe('prompt', function () {

        describe('username', function () {
            it('should show message on empty username input', function (done) {
                setBreakpoint('VALIDATE_USERNAME');
                prompt = run(function (answer, message) {
                    assert.equal(answer.length, 0);
                    assert.equal(message, 'username is required');
                    done();
                });
                prompt.rl.write('\n');
            });
            it('should not error on username input', function (done) {
                assert.doesNotThrow(function () {
                    prompt = run();
                    prompt.rl.write('username\n');
                    done();
                });
            });
            it('should have a username after successful input', function (done) {
                prompt = run();
                prompt.rl.write('username\n');
                assert.ok(_.has(prompt.answers, 'username'));
                assert.equal(prompt.answers.username, 'username');
                done();
            });
        });

        describe('password', function () {
            it('should show message on empty password input', function (done) {
                setBreakpoint('VALIDATE_PASSWORD');
                prompt = run(function (answer, message) {
                    assert.equal(answer.length, 0);
                    assert.equal(message, 'password is required');
                    done();
                });
                prompt.rl.write('username\n');
                prompt.rl.write('\n');
            });
            it('should not error on password input', function (done) {
                assert.doesNotThrow(function () {
                    prompt = run();
                    prompt.rl.write('username\n');
                    prompt.rl.write('password\n');
                    done();
                });
            });
            it('should have a username and password after successful input', function (done) {
                prompt = run();
                prompt.rl.write('username\n');
                prompt.rl.write('password\n');
                assert.ok(_.has(prompt.answers, 'password'));
                assert.equal(prompt.answers.password, 'password');
                done();
            });
        });

        describe('2FA', function () {
            it('should continue after password input when no 2FA code required', function (done) {
                apiResponse.testAuth.no2FA.good();
                setBreakpoint('CREATE_HEADERS');
                prompt = run(function (has2FA) {
                    assert(!has2FA);
                    done();
                });
                prompt.rl.write('username\n');
                prompt.rl.write('password\n');
            });
            it('should ask for a 2FA code when required', function (done) {
                apiResponse.testAuth.has2FA.good();
                setBreakpoint('CREATE_HEADERS');
                prompt = run(function (has2FA) {
                    assert(has2FA);
                    done();
                });
                prompt.rl.write('username\n');
                prompt.rl.write('password\n');
            });
            it('should not error on 2FA code input');
            it('should error and ask for input again on no 2FA code input');
        });

    });



    // Static use: accepts details.
    it('should error when username is not passed to static call');
    it('should error when password is not passed to static call');
    it('should return a 2FA code request from a static call if required');
    it('should error when 2FA code is required and not given for a static call');



    // Authentication test.
    describe('authentication', function () {

        it('should error an authentication test with bad credentials when 2FA not required', function (done) {
            apiResponse.testAuth.no2FA.bad();
            setBreakpoint('CHECK_2FA');
            prompt = run(function (err, res) {
                assert.throws(function () {
                    assert.ifError(err);
                });
                done();
            });
            prompt.rl.write('username\n');
            prompt.rl.write('password\n');
        });
        it('should error an authentication test with bad credentials when 2FA required');
        it('should succeed an authentication test with good basic credentials');
        it('should succeed an authentication test with good 2FA credentials');
    });



    // Token creation.
    it('should error when it cannot connect to the api');
    it('should explain when rate limit remaining is 0');
    it('should create and return a new token');
    it('should get and return an existing token by name');

});
