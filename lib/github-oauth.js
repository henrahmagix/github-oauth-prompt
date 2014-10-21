/*
 * github-oauth
 * github.com/henrahmagix/github-oauth
 *
 * Copyright (c) 2014 Henry Blyth
 * Licensed under the MIT license.
 */

'use strict';

// Packages
var _ = require('lodash');
var async = require('async');
var inquirer = require('inquirer');
var github = new (require('github'))({version: '3.0.0'});

// Main.
function main (options, mainCallback) {

    var TESTING = process.env.GITHUB_OAUTH_TESTING;

    function testBreakpoint (name, args) {
        if (TESTING === name) {
            mainCallback.apply(null, args);
            return true;
        }
        return false;
    }

    // Option: name -> note.
    if (!options || !_.has(options, 'name') || !options.name) {
        throw new Error('Option name is required');
    }
    if (!_.isString(options.name)) {
        throw new Error('Option name must be a string');
    }
    if (_.isString(options.name) && options.name.length === 0) {
        throw new Error('Option name is required');
    }

    // Option: scopes -> scopes.
    if (_.isUndefined(options.scopes)) {
        options.scopes = [];
    }
    if (!_.isArray(options.scopes)) {
        throw new Error('Option scopes must be an array');
    }

    // Option: url -> note_url.
    if (_.isUndefined(options.url)) {
        options.url = '';
    }
    if (!_.isString(options.url)) {
        throw new Error('Option url must be a string');
    }

    var prompt = inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'username',
            validate: function (answer) {
                var requiredMessage = 'username is required';
                if (testBreakpoint('VALIDATE_USERNAME', [answer, requiredMessage])) {
                    return 'BREAK';
                }
                return (answer.length > 0) ? true : requiredMessage;
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'password',
            validate: function (answer) {
                var requiredMessage = 'password is required';
                if (testBreakpoint('VALIDATE_PASSWORD', [answer, requiredMessage])) {
                    return 'BREAK';
                }
                return (answer.length > 0) ? true : requiredMessage;
            }
        }
    ], function (answers) {
        if (testBreakpoint('AUTH_ANSWERS', arguments)) {
            return 'BREAK';
        }
        github.authenticate({
            type: 'basic',
            username: answers.username,
            password: answers.password
        });
        if (testBreakpoint('AUTH_BASIC', [github])) {
            return 'BREAK';
        }
        async.waterfall([
            // userRequires2FA,
            // createHeaders,
            // createAuth
            // Check if the user has two-factor authentication enabled.
            function (callback) {
                if (testBreakpoint('ASYNC_START', arguments)) {
                    return 'BREAK';
                }
                github.authorization.getAll({}, function (err, res) {
                    if (testBreakpoint('CHECK_2FA', arguments)) {
                        return 'BREAK';
                    }
                    var has2FA = false;
                    if (err) {
                        // Can't check the response headers on error, so do a
                        // string match on the message.
                        if (err.code === 401 && JSON.parse(err.message).message === 'Must specify two-factor authentication OTP code.') {
                            has2FA = true;
                            if (testBreakpoint('CHECK_2FA_MESSAGE', [has2FA])) {
                                return 'BREAK';
                            }
                        } else {
                            if (testBreakpoint('CHECK_2FA_ERROR', arguments)) {
                                return 'BREAK';
                            }
                            callback(err, has2FA);
                        }
                    }
                    callback(null, has2FA);
                });
            },
            // Set token request headers for the possibility of a 2FA code.
            function (has2FA, callback) {
                if (testBreakpoint('CREATE_HEADERS', arguments)) {
                    return 'BREAK';
                }
                var headers = {};
                if (has2FA) {
                    var prompt = inquirer.prompt([
                        {
                            type: 'input',
                            name: 'code',
                            message: 'two-factor authentication code',
                            validate: function (answer) {
                                var requiredMessage = 'code is required';
                                if (testBreakpoint('VALIDATE_CODE', [answer, requiredMessage])) {
                                    return 'BREAK';
                                }
                                return (answer.length > 0) ? true : requiredMessage;
                            }
                        }
                    ], function (answers) {
                        if (testBreakpoint('CODE_ANSWERS', arguments)) {
                            return 'BREAK';
                        }
                        if (answers.code) {
                            headers['X-GitHub-OTP'] = answers.code;
                        }
                        callback(null, headers);
                    });
                    if (testBreakpoint('GET_2FA', [prompt])) {
                        return 'BREAK';
                    }
                } else {
                    callback(null, headers);
                }
            },
            // Create an authorization token.
            function (headers, callback) {
                if (testBreakpoint('CREATE_TOKEN', arguments)) {
                    return 'BREAK';
                }
                var authOptions = {
                    scopes: options.scopes,
                    note: options.name,
                    note_url: options.url,
                    headers: headers
                };
                if (testBreakpoint('CREATE_TOKEN_OPTIONS', [authOptions])) {
                    return 'BREAK';
                }
                github.authorization.create(authOptions, function (err, res) {
                    if (testBreakpoint('CREATE_TOKEN_RESPONSE', arguments)) {
                        return 'BREAK';
                    }
                    if (err) {
                        if (err.code === 422) {
                            if (testBreakpoint('TOKEN_EXISTS', [true])) {
                                return 'BREAK';
                            }
                            // Token for this name already exists so fetch it.
                            github.authorization.getAll({
                                headers: headers
                            }, function (err, res) {
                                if (testBreakpoint('GET_TOKEN_RESPONSE', arguments)) {
                                    return 'BREAK';
                                }
                                if (err) {
                                    callback(err);
                                } else {
                                    var token;
                                    res.forEach(function (authItem) {
                                        if (authItem.note === options.name) {
                                            console.log('Existing token found!');
                                            token = authItem.token;
                                        }
                                    });
                                    if (testBreakpoint('EXISTING_TOKEN', [token])) {
                                        return 'BREAK';
                                    }
                                    callback(null, token);
                                }
                            });
                        } else {
                            callback(err);
                        }
                    } else {
                        // Token get! ACHIEVEMENT
                        console.log('Token created!');
                        if (testBreakpoint('TOKEN_CREATED', [res.token])) {
                            return 'BREAK';
                        }
                        callback(null, res.token);
                    }
                });
            }
        ], mainCallback);
    });

    if (TESTING) {
        return prompt;
    }
    return;
}

main.requiresCode = function () {
    return true;
};

module.exports = main;
