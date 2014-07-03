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

    function breakpoint (name, args) {
        if (TESTING === name) {
            mainCallback.apply(null, args);
        }
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
                breakpoint('VALIDATE_USERNAME', [answer, requiredMessage]);
                return (answer.length > 0) ? true : requiredMessage;
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'password',
            validate: function (answer) {
                var requiredMessage = 'password is required';
                breakpoint('VALIDATE_PASSWORD', [answer, requiredMessage]);
                return (answer.length > 0) ? true : requiredMessage;
            }
        }
    ], function (answers) {
        breakpoint('AUTH_ANSWERS', arguments);
        github.authenticate({
            type: 'basic',
            username: answers.username,
            password: answers.password
        });
        breakpoint('AUTH_BASIC', [github]);
        async.waterfall([
            // userRequires2FA,
            // createHeaders,
            // createAuth
            // Check if the user has two-factor authentication enabled.
            function (callback) {
                breakpoint('ASYNC_START', arguments);
                github.authorization.getAll({}, function (err, res) {
                    breakpoint('CHECK_2FA', arguments);
                    var has2FA = false;
                    if (err) {
                        // Can't check the response headers on error, so do a
                        // string match on the message.
                        if (err.code === 401 && JSON.parse(err.message).message === 'Must specify two-factor authentication OTP code.') {
                            has2FA = true;
                            breakpoint('CHECK_2FA_MESSAGE', [has2FA]);
                        } else {
                            breakpoint('CHECK_2FA_ERROR', arguments);
                            callback(err, has2FA);
                        }
                    }
                    callback(null, has2FA);
                });
            },
            // Set token request headers for the possibility of a 2FA code.
            function (has2FA, callback) {
                breakpoint('CREATE_HEADERS', arguments);
                var headers = {};
                if (has2FA) {
                    var prompt = inquirer.prompt([
                        {
                            type: 'input',
                            name: 'code',
                            message: 'two-factor authentication code',
                            validate: function (answer) {
                                var requiredMessage = 'code is required';
                                breakpoint('VALIDATE_CODE', [answer, requiredMessage]);
                                return (answer.length > 0) ? true : requiredMessage;
                            }
                        }
                    ], function (answers) {
                        breakpoint('CODE_ANSWERS', arguments);
                        if (answers.code) {
                            headers['X-GitHub-OTP'] = answers.code;
                        }
                        callback(null, headers);
                    });
                    breakpoint('GET_2FA', [prompt]);
                } else {
                    callback(null, headers);
                }
            },
            // Create an authorization token.
            function (headers, callback) {
                breakpoint('CREATE_TOKEN', arguments);
                var authOptions = {
                    scopes: options.scopes,
                    note: options.name,
                    note_url: options.url,
                    headers: headers
                };
                breakpoint('CREATE_TOKEN_OPTIONS', [authOptions]);
                github.authorization.create(authOptions, function (err, res) {
                    breakpoint('CREATE_TOKEN_RESPONSE', arguments);
                    if (err) {
                        if (err.code === 422) {
                            breakpoint('TOKEN_EXISTS', [true]);
                            // Token for this name already exists so fetch it.
                            github.authorization.getAll({
                                headers: headers
                            }, function (err, res) {
                                breakpoint('GET_TOKEN_RESPONSE', arguments);
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
                                    breakpoint('EXISTING_TOKEN', [token]);
                                    callback(null, token);
                                }
                            });
                        } else {
                            callback(err);
                        }
                    } else {
                        // Token get! ACHIEVEMENT
                        console.log('Token created!');
                        breakpoint('TOKEN_CREATED', [res.token]);
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
