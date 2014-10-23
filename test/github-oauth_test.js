'use strict';

var oauth = require('../lib/github-oauth.js');
var _ = require('lodash');

// Mock the GitHub API.
var nock = require('nock');
var apiResponse = require('./api-response')(nock);

function getOptions (options) {
    return _.extend({name: 'test'}, options);
}

// Dry the calling of oauth().
function run (options, callback) {
    if (_.isUndefined(options)) {
        options = {};
    }
    if (_.isFunction(options)) {
        callback = options;
        options = {};
    }
    options = getOptions(options);
    if (_.isUndefined(callback)) {
        callback = function () {};
    }
    oauth(options, callback);
}

function writeNewline (prompt) {
    prompt.rl.write('\n');
}

function writeToPrompt (prompt, str) {
    prompt.rl.write(str + '\n');
}

function writeUsername (prompt) {
    writeToPrompt(prompt, 'username');
}

function writePassword (prompt) {
    writeToPrompt(prompt, 'password');
}

function writeUserPass (prompt) {
    writeToPrompt(prompt, 'username');
    writeToPrompt(prompt, 'password');
}

function write2FACode (prompt) {
    writeToPrompt(prompt, '123456');
}

function reduceListeners (prompt) {
    if (prompt && prompt.rl) {
        prompt.rl.setMaxListeners(0);
        prompt.rl.input.setMaxListeners(0);
        prompt.rl.output.setMaxListeners(0);
    }
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
    var cb = function () {};

    beforeEach(function () {
        if (prompt && prompt.rl) {
            prompt.close();
            prompt = null;
        }
        nock.cleanAll();
    });

    afterEach(function () {
        reduceListeners(prompt);
    });



    describe('main', function () {

        it('should error if a callback is not given', function () {
            assert.throws(
                function () {
                    oauth({name: 'test'});
                },
                /Callback not provided/
            );
        });

        describe('options.name', function () {

            it('should error if nothing is passed', function () {
                assert.throws(
                    function () {
                        oauth(null, cb);
                    },
                    /Option name is required/
                );
            });

            it('should not error if required field "name" is given as a string of length', function () {
                assert.doesNotThrow(function () {
                    oauth({name: 'test'}, cb);
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
                                oauth({name: wrongType}, cb);
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
                                oauth({name: wrongType}, cb);
                            },
                            /Option name must be a string/
                        );
                    });
                }
            );

        });



        describe('options.scopes', function () {

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
                                    name: 'test',
                                    scopes: wrongType
                                }, cb);
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
                                name: 'test',
                                scopes: rightType
                            }, cb);
                        });
                    });
                }
            );

        });



        describe('options.url', function () {

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
                                    name: 'test',
                                    url: wrongType
                                }, cb);
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
                                name: 'test',
                                url: rightType
                            }, cb);
                        });
                    });
                }
            );

        });



        describe('options.prompt', function () {

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
                    'array': []
                },
                function (wrongType, identifier) {
                    it('should error if optional field "prompt" is given as: ' + identifier, function () {
                        assert.throws(
                            function () {
                                oauth({
                                    name: 'test',
                                    prompt: wrongType
                                }, cb);
                            },
                            /Option prompt must be an object/
                        );
                    });
                }
            );

            // Optional: undefined or not passed.
            _.each(
                {
                    'undefined': void 0,
                    'object': {}
                },
                function (rightType, identifier) {
                    it('should not error if optional field "prompt" is given as: ' + identifier, function () {
                        assert.doesNotThrow(function () {
                            oauth({
                                name: 'test',
                                prompt: rightType
                            }, cb);
                        });
                    });
                }
            );

        });



        _.each(['username', 'password', 'code'], function (option) {
            describe('options.' + option, function () {

                // Optional: defined or passed.
                _.each(
                    {
                        'null': null,
                        'false': false,
                        'true': true,
                        'number': 1,
                        'NaN': NaN,
                        'array': [],
                        'array of length': ['string'],
                        'object': {}
                    },
                    function (wrongType, identifier) {
                        it('should error if optional field "' + option + '" is given as: ' + identifier, function () {
                            assert.throws(
                                function () {
                                    var authOptions = {
                                        name: 'test'
                                    };
                                    authOptions[option] = wrongType;
                                    oauth(authOptions, cb);
                                },
                                new RegExp('Option ' + option + ' must be a string')
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
                        it('should not error if optional field "' + option + '" is given as: ' + identifier, function () {
                            assert.doesNotThrow(function () {
                                oauth({
                                    name: 'test',
                                    username: rightType
                                }, cb);
                            });
                        });
                    }
                );

            });
        });

    });




    describe('promptValue', function () {
        it('should have a custom value on the prompt after successful input', function (done) {
            prompt = oauth.promptValue('custom', function () {
                assert.ok(_.has(prompt.answers, 'custom'));
                assert.equal(prompt.answers.custom, 'my-custom-value');
                done();
            });
            writeToPrompt(prompt, 'my-custom-value');
        });
        it('should send a custom value to the prompt callback after successful input', function (done) {
            prompt = oauth.promptValue('custom', function (err, custom) {
                assert.equal(custom, 'my-custom-value');
                done();
            });
            writeToPrompt(prompt, 'my-custom-value');
        });
    });

    // Normal use: asks for details.
    describe('promptUsername', function () {
        it.skip('should show message on empty username input', function () {
            // Need to be able to act on prompt error.
            // See inquirer/lib/prompts/base.js
        });
        it('should not error on username input', function (done) {
            // I don't think this test should exist unless we can test for
            // an error also.
            assert.doesNotThrow(function () {
                prompt = oauth.promptUsername(function (err, username) {
                    done();
                });
                writeUsername(prompt);
            });
        });
        it('should have a username on the prompt after successful input', function (done) {
            prompt = oauth.promptUsername(function () {
                assert.ok(_.has(prompt.answers, 'username'));
                assert.equal(prompt.answers.username, 'my-username');
                done();
            });
            writeToPrompt(prompt, 'my-username');
        });
        it('should send a username to the prompt callback after successful input', function (done) {
            prompt = oauth.promptUsername(function (err, username) {
                assert.equal(username, 'my-username');
                done();
            });
            writeToPrompt(prompt, 'my-username');
        });
    });

    describe('promptPassword', function () {
        it('should show message on empty password input', function () {
            // Need to be able to act on prompt error.
            // See inquirer/lib/prompts/base.js
        });
        it('should not error on password input', function (done) {
            // I don't think this test should exist unless we can test for
            // an error also.
            assert.doesNotThrow(function () {
                prompt = oauth.promptPassword(function (err, password) {
                    done();
                });
                writePassword(prompt);
            });
        });
        it('should have a password on the prompt after successful input', function (done) {
            prompt = oauth.promptPassword(function (err, password) {
                assert.ok(_.has(prompt.answers, 'password'));
                assert.equal(prompt.answers.password, 'my-password');
                done();
            });
            writeToPrompt(prompt, 'my-password');
        });
        it('should send a password to the prompt callback after successful input', function (done) {
            prompt = oauth.promptPassword(function (err, password) {
                assert.equal(password, 'my-password');
                done();
            });
            writeToPrompt(prompt, 'my-password');
        });
    });

    describe('prompt2FACode', function () {
        it('should show message on empty code input', function () {
            // Need to be able to act on prompt error.
            // See inquirer/lib/prompts/base.js
        });
        it('should not error on code input', function (done) {
            // I don't think this test should exist unless we can test for
            // an error also.
            assert.doesNotThrow(function () {
                prompt = oauth.prompt2FACode(function (err, code) {
                    done();
                });
                write2FACode(prompt);
            });
        });
        it('should have a code on the prompt after successful input', function (done) {
            prompt = oauth.prompt2FACode(function (err, code) {
                assert.ok(_.has(prompt.answers, 'code'));
                assert.equal(prompt.answers.code, '123456');
                done();
            });
            writeToPrompt(prompt, '123456');
        });
        it('should send a code to the prompt callback after successful input', function (done) {
            prompt = oauth.prompt2FACode(function (err, code) {
                assert.equal(code, '123456');
                done();
            });
            writeToPrompt(prompt, '123456');
        });
    });

    describe('saveBasicAuth', function () {
        it('should error when no parameters given', function () {
            assert.throws(function () {
                oauth.saveBasicAuth();
            });
        });
        it('should error when username not given', function () {
            assert.throws(function () {
                oauth.saveBasicAuth(null, 'password');
            });
        });
        it('should error when password not given', function () {
            assert.throws(function () {
                oauth.saveBasicAuth('username');
            });
        });
        it('should not error when username and password are given', function () {
            assert.doesNotThrow(function () {
                oauth.saveBasicAuth('username', 'password');
            });
        });
    });

    describe('2FA', function () {
        it.skip('should continue after password input when no 2FA code required', function (done) {
            apiResponse.testAuth.no2FA.good();
            apiResponse.makeNew.has2FA.good();
            prompt = run(function () {
                assert(true);
                done();
            });
            writeUserPass(prompt);
        });
        it.skip('should ask for a 2FA code when required', function (done) {
            apiResponse.testAuth.has2FA.good();
            apiResponse.makeNew.has2FA.good();
            prompt = run(function () {
                assert(true);
                done();
            });
            writeUserPass(prompt);
        });
        var count = 0;
        it.skip('should not error on 2FA code input', function (done) {
            apiResponse.testAuth.has2FA.good();
            apiResponse.makeNew.has2FA.good();
            prompt = run(function (prompt) {
                console.log('run PROMPT_2FA', count++);
                assert.doesNotThrow(function () {
                    write2FACode(prompt);
                });
                done();
            });
            writeUserPass(prompt);
        });
        it.skip('should output the correct message on no 2FA code input', function (done) {
            apiResponse.testAuth.has2FA.good();
            apiResponse.makeNew.has2FA.good();
            prompt = run(function (answer, msg) {
                writeNewline(prompt);
                assert(answer.length > 0);
                assert.equal(msg, 'code is required');
                done();
            });
            writeUserPass(prompt);
        });
        it.skip('should error and ask for input again on no 2FA code input', function (done) {
            apiResponse.testAuth.has2FA.good();
            prompt = run(function (answer, msg) {
                assert.doesNotThrow(function () {
                    writeNewline(prompt);
                });
                done();
            });
            writeUserPass(prompt);
        });
    });



    // Static use: accepts details.
    it('should error when username is not passed to static call');
    it('should error when password is not passed to static call');
    it('should return a 2FA code request from a static call if required');
    it('should error when 2FA code is required and not given for a static call');



    // Authentication test.
    describe('authentication', function () {

        it.skip('should error an authentication test with bad credentials when 2FA not required', function (done) {
            apiResponse.testAuth.no2FA.bad();
            prompt = run(function (err, res) {
                assert.throws(function () {
                    assert.ifError(err);
                });
                done();
            });
            writeUserPass(prompt);
        });
        it.skip('should error an authentication test with bad credentials when 2FA required', function (done) {
            apiResponse.testAuth.has2FA.bad();
            prompt = run(function (err, res) {
                assert.throws(function () {
                    assert.ifError(err);
                });
                done();
            });
            writeUserPass(prompt);
        });
        it.skip('should succeed an authentication test with good basic credentials', function (done) {
            apiResponse.testAuth.no2FA.good();
            prompt = run(function (err, res) {
                assert.doesNotThrow(function () {
                    assert.ifError(err);
                });
                done();
            });
            writeUserPass(prompt);
        });
        it.skip('should succeed an authentication test with good 2FA credentials', function (done) {
            apiResponse.testAuth.has2FA.good();
            prompt = run(function (err, res) {
                assert.doesNotThrow(function () {
                    assert.ifError(err);
                });
                done();
            });
            writeUserPass(prompt);
        });
    });



    // Token creation.
    it('should error when it cannot connect to the api');
    it('should explain when rate limit remaining is 0');
    it('should create and return a new token');
    it('should get and return an existing token by name');

});
