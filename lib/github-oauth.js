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
var main = function (options, callback) {

    if (!_.has(options, 'name') || !options.name) {
        throw new Error('Option name is required');
    }
    if (!_.isString(options.name)) {
        throw new Error('Option name must be a string');
    }
    if (_.isString(options.name) && options.name.length === 0) {
        throw new Error('Option name is required');
    }
    var tokenNote = options.name;

    var scopes = options.scopes;
    if (scopes == null) {
        scopes = [];
    }
    if (!_.isArray(scopes)) {
        throw new Error('Option scopes must be an array');
    }

    // Helper functions
    function testUser (callback) {
        github.authorization.getAll({}, function (err, res) {
            if (err && JSON.parse(err.message).message === 'Bad credentials') {
                return callback(new Error('GitHub username or password is incorrect.'));
            }
            callback(null);
        });
    }

    function userRequires2FA (callback) {
        github.authorization.getAll({}, function (err, res) {
            var has2FA = false;
            if (err) {
                // Can't check the response headers on error, so do a string
                // match on the message.
                if (err.code === 401 && JSON.parse(err.message).message === 'Must specify two-factor authentication OTP code.') {
                    has2FA = true;
                } else {
                    callback(err, has2FA);
                }
            }
            callback(null, has2FA);
        });
    }

    function get2FA (callback) {
        inquirer.prompt([
            {
                type: 'input',
                name: 'code',
                message: 'two-factor authentication code',
                validate: function (answer) {
                    return (answer.length > 0) ? true : 'Code cannot be blank.';
                }
            }
        ], function (answers) {
            callback(null, answers.code);
        });
    }

    function createHeaders (has2FA, callback) {
        var headers = {};
        if (has2FA) {
            get2FA(function (err, code) {
                if (code) {
                    headers['X-GitHub-OTP'] = code;
                }
                callback(err, headers);
            });
        } else {
            callback(null, headers);
        }
    }

    function getCurrentToken (headers, callback) {
        github.authorization.getAll({
            headers: headers
        }, function (err, res) {
            if (err) {
                return callback(new Error(err));
            } else {
                var token;
                res.forEach(function (authItem) {
                    if (authItem.note === 'img2iss') {
                        console.log('Existing token found!');
                        token = authItem.token;
                    }
                });
                callback(null, token);
            }
        });
    }

    function createAuth (headers, callback) {
        github.authorization.create({
            scopes: ['read:org', 'repo'],
            note: 'img2iss',
            note_url: 'http://github.com/rogerhutchings/img2iss',
            headers: headers
        }, function (err, res) {
            if (err) {
                if (err.code === 422) {
                    // Token for img2iss already exists.
                    getCurrentToken(headers, callback);
                } else {
                    return callback(new Error(err));
                }
            } else {
                // Token get! ACHIEVEMENT
                console.log('Token created!');
                callback(null, res.token);
            }
        });
    }

    return inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'username',
            validate: function (answer) {
                return (answer.length > 0) ? true : 'username is required';
            }
        },
        {
            type: 'password',
            name: 'password',
            message: 'password',
            validate: function (answer) {
                return (answer.length > 0) ? true : 'password is required';
            }
        }
    ], function (answers) {
        github.authenticate({
            type: 'basic',
            username: answers.username,
            password: answers.password
        });
        async.waterfall([
            userRequires2FA,
            createHeaders,
            createAuth
        ], callback);
    });
};

main.requiresCode = function () {
    return true;
};

module.exports = main;
