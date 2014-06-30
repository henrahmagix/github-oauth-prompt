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
var main = function (options, mainCallback) {

    var TESTING = process.env.GITHUB_OAUTH_TESTING;

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
                if (TESTING === 'VALIDATE_USERNAME') {
                    mainCallback(answer, requiredMessage);
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
                if (TESTING === 'VALIDATE_PASSWORD') {
                    mainCallback(answer, requiredMessage);
                }
                return (answer.length > 0) ? true : requiredMessage;
            }
        }
    ], function (answers) {
        if (TESTING === 'AUTH_ANSWERS') {
            mainCallback.apply(null, arguments);
        }
        github.authenticate({
            type: 'basic',
            username: answers.username,
            password: answers.password
        });
        if (TESTING === 'AUTH_BASIC') {
            mainCallback(github);
        }
        async.waterfall([
            // userRequires2FA,
            // createHeaders,
            // createAuth
            // Check if the user has two-factor authentication enabled.
            function (callback) {
                if (TESTING === 'ASYNC_START') {
                    mainCallback();
                }
                github.authorization.getAll({}, function (err, res) {
                    if (TESTING === 'CHECK_2FA') {
                        mainCallback.apply(null, arguments);
                    }
                    var has2FA = false;
                    if (err) {
                        // Can't check the response headers on error, so do a
                        // string match on the message.
                        if (err.code === 401 && JSON.parse(err.message).message === 'Must specify two-factor authentication OTP code.') {
                            has2FA = true;
                            if (TESTING === 'CHECK_2FA_MESSAGE') {
                                mainCallback.call(null, has2FA);
                            }
                        } else {
                            if (TESTING === 'CHECK_2FA_ERROR') {
                                mainCallback.apply(null, arguments);
                            }
                            callback(err, has2FA);
                        }
                    }
                    callback(null, has2FA);
                });
            },
            // Set token request headers for the possibility of a 2FA code.
            function (has2FA, callback) {
                if (TESTING === 'CREATE_HEADERS') {
                    mainCallback.apply(null, arguments);
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
                                if (TESTING === 'VALIDATE_CODE') {
                                    mainCallback(answer, requiredMessage);
                                }
                                return (answer.length > 0) ? true : requiredMessage;
                            }
                        }
                    ], function (answers) {
                        if (TESTING === 'CODE_ANSWERS') {
                            mainCallback.apply(null, arguments);
                        }
                        if (answers.code) {
                            headers['X-GitHub-OTP'] = answers.code;
                        }
                        callback(null, headers);
                    });
                } else {
                    callback(null, headers);
                }
            },
            // Create an authorization token.
            function (headers, callback) {
                if (TESTING === 'CREATE_TOKEN') {
                    mainCallback.apply(null, arguments);
                }
                var authOptions = {
                    scopes: options.scopes,
                    note: options.name,
                    note_url: options.url,
                    headers: headers
                };
                if (TESTING === 'CREATE_TOKEN_OPTIONS') {
                    mainCallback.call(null, authOptions);
                }
                github.authorization.create(authOptions, function (err, res) {
                    if (TESTING === 'CREATE_TOKEN_RESPONSE') {
                        mainCallback.apply(null, arguments);
                    }
                    if (err) {
                        if (err.code === 422) {
                            if (TESTING === 'TOKEN_EXISTS') {
                                mainCallback(true);
                            }
                            // Token for this name already exists so fetch it.
                            github.authorization.getAll({
                                headers: headers
                            }, function (err, res) {
                                if (TESTING === 'GET_TOKEN_RESPONSE') {
                                    mainCallback.apply(null, arguments);
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
                                    if (TESTING === 'EXISTING_TOKEN') {
                                        mainCallback(token);
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
                        if (TESTING === 'TOKEN_CREATED') {
                            mainCallback(res.token);
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
};

main.requiresCode = function () {
    return true;
};

module.exports = main;
