/*
 * github-oauth-prompt
 * github.com/henrahmagix/github-oauth-prompt
 *
 * Copyright (c) 2014 Henry Blyth
 * Licensed under the MIT license.
 */

'use strict';

// Packages
var _ = require('lodash');
var async = require('async');
var inquirer = require('inquirer');
var GitHubAPI = require('github');
var github;

function isHash (obj) {
    return _.isObject(obj) && !_.isArray(obj) && !_.isFunction(obj);
}

function getPromptOptions (options) {
    if (!isHash(options)) {
        throw new Error('Prompt options object is required');
    }

    var promptName = options.name;
    if (!_.isString(promptName) || promptName.length === 0) {
        throw new Error('Prompt option name must be a string of length');
    }

    var promptType = options.type;
    if (!_.isString(promptType) || promptType.length === 0) {
        promptType = 'input';
    }
    if (promptType !== 'input' && promptType !== 'password') {
        throw new Error('Prompt option type must be input or password');
    }

    var promptMessage = options.message;
    if (!_.isString(promptMessage)) {
        promptMessage = promptName;
    }

    return {
        name: promptName,
        type: promptType,
        message: promptMessage,
        validate: function (answer) {
            return (answer.length > 0) ? true : promptName + ' is required';
        }
    };
}

function promptValue (options, callback) {
    var promptSettings = getPromptOptions(options);
    var questions = [promptSettings];
    var prompt = inquirer.prompt(questions, function (answers) {
        callback(null, answers[promptSettings.name]);
    });
    return prompt;
}

function promptUsername (promptMessage, callback) {
    if (!callback && _.isFunction(promptMessage)) {
        callback = promptMessage;
        promptMessage = null;
    }
    return promptValue({
        name: 'username',
        message: promptMessage
    }, callback);
}

function promptPassword (promptMessage, callback) {
    if (!callback && _.isFunction(promptMessage)) {
        callback = promptMessage;
        promptMessage = null;
    }
    return promptValue({
        name: 'password',
        type: 'password',
        message: promptMessage
    }, callback);
}

function prompt2FACode (promptMessage, callback) {
    if (!callback && _.isFunction(promptMessage)) {
        callback = promptMessage;
        promptMessage = null;
    }
    return promptValue({
        name: 'code',
        message: promptMessage
    }, callback);
}

function saveBasicAuth (username, password) {
    // Setup basic authentication.
    github.authenticate({
        type: 'basic',
        username: username,
        password: password
    });
    return github;
}

// Check if the user has two-factor authentication enabled.
function userRequires2FA (callback) {
    github.authorization.create({}, function (err, res) {
        var has2FA = false;
        if (err) {
            // Can't check the response headers on error, so do a string
            // match on the message.
            var errData = JSON.parse(err.message);
            if (errData.message === 'Must specify two-factor authentication OTP code.') {
                has2FA = true;
                callback(null, has2FA);
            } else if (errData.errors && errData.errors[0] && errData.errors[0].code === 'missing_field') {
                has2FA = false;
                callback(null, has2FA);
            } else {
                callback(err);
            }
        } else {
            callback(null, has2FA);
        }
    });
}

// Set token request headers for the possibility of a 2FA code.
function createRequestHeaders (has2FA, code) {
    var headers = {};
    if (has2FA) {
        if (!code) {
            throw new Error('Code required but not given');
        }
        headers['X-GitHub-OTP'] = code;
    }
    return headers;
}

function getExistingToken (name, headers, callback) {
    // `note` is unique but is not the uid so we must get and search through
    // all tokens.
    github.authorization.getAll({
        headers: headers
    }, function (err, res) {
        if (err) {
            callback(err);
        } else {
            var existingAuthItem = _.find(res, function (authItem) {
                return authItem.note === name;
            });
            if (existingAuthItem) {
                console.log('Existing token found!');
                callback(null, existingAuthItem.token);
            } else {
                callback(new Error('No existing token found'));
            }
        }
    });
}

// Create an authorization token.
function createAuth (headers, options, callback) {
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    var authOptions = {
        scopes: options.scopes,
        note: options.name,
        note_url: options.url,
        headers: headers
    };
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    github.authorization.create(authOptions, function (err, res) {
        if (err) {
            if (err.code === 422) {
                // Token for this name already exists so fetch it.
                getExistingToken(authOptions.note, authOptions.headers, callback);
            } else {
                callback(err);
            }
        } else {
            // Token get! ACHIEVEMENT
            console.log('Token created!');
            callback(null, res.token);
        }
    });
}

function getOptions (userOptions) {

    if (!isHash(userOptions)) {
        throw new Error('Options object is required');
    }

    // Deep clone to avoid mutating the users' object.
    var options = _.clone(userOptions, true);

    function isNonEmptyString (value) {
        return _.isString(value) && value.length > 0;
    }

    // Option: name -> note.
    if (_.isUndefined(options.name)) {
        throw new Error('Option name is required');
    }
    if (!isNonEmptyString(options.name)) {
        throw new Error('Option name must be a non-empty string');
    }

    // Option: host.
    if (options.host !== undefined && !isNonEmptyString(options.host)) {
        throw new Error('Option host must be a non-empty string');
    }

    // Option: scopes.
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

    // Option: prompt messages.
    if (_.isUndefined(options.prompt)) {
        options.prompt = {};
    }
    if (!isHash(options.prompt)) {
        throw new Error('Option prompt must be an object');
    }

    // Option: username.
    if (!_.isUndefined(options.username) && !_.isString(options.username)) {
        throw new Error('Option username must be a string');
    }

    // Option: password.
    if (!_.isUndefined(options.password) && !_.isString(options.password)) {
        throw new Error('Option password must be a string');
    }

    // Option: code.
    if (!_.isUndefined(options.code) && !_.isString(options.code)) {
        throw new Error('Option code must be a string');
    }

    return options;
}

// Main.
module.exports = function main (options, mainCallback) {

    if (!_.isObject(options) || _.isArray(options)) {
        throw new Error('Options object is required as the first parameter');
    }

    if (_.isUndefined(mainCallback)) {
        throw new Error('Callback is required as the second parameter');
    }

    if (!_.isFunction(mainCallback)) {
        throw new Error('Callback must be a function');
    }

    options = getOptions(options);
    github = new GitHubAPI({
      version: '3.0.0',
      port: '80',
      pathPrefix: options.host ? '/api/v3/' : '',
      protocol: 'http',
      host: options.host || 'api.github.com'
    });

    // Run.
    async.series([
        function authenticate (callback) {
            async.series([
                function getUsername (callback) {
                    if (options.username) {
                        callback(null, options.username);
                    } else {
                        promptUsername(options.prompt.username, callback);
                    }
                },
                function getPassword (callback) {
                    if (options.password) {
                        callback(null, options.password);
                    } else {
                        promptPassword(options.prompt.password, callback);
                    }
                }
            ], function saveResults (err, res) {
                if (res) {
                    saveBasicAuth(res[0], res[1]);
                }
                callback(err, res);
            });
        },
        function token (callback) {
            async.waterfall([
                function checkFor2FA (callback) {
                    userRequires2FA(callback);
                },
                function getRequestHeaders (has2FA, callback) {
                    var headers = createRequestHeaders();
                    if (has2FA) {
                        if (options.code) {
                            headers = createRequestHeaders(has2FA, options.code);
                            callback(null, headers);
                        } else {
                            prompt2FACode(options.prompt.code, function (err, code) {
                                if (err) {
                                    callback(err);
                                } else {
                                    headers = createRequestHeaders(has2FA, code);
                                    callback(null, headers);
                                }
                            });
                        }
                    } else {
                        callback(null, headers);
                    }
                },
                function getToken (headers, callback) {
                    createAuth(headers, options, callback);
                }
            ], function returnToken (err, res) {
                callback(err, res);
            });
        }
    ], function end (err, res) {
        // Clear basic authentication.
        github.authenticate();
        // res[0] is user credentials, res[1] is the token.
        mainCallback(err, res[1]);
    });
};

module.exports.getPromptOptions = getPromptOptions;
module.exports.promptValue = promptValue;
module.exports.promptUsername = promptUsername;
module.exports.promptPassword = promptPassword;
module.exports.prompt2FACode = prompt2FACode;
module.exports.saveBasicAuth = saveBasicAuth;
module.exports.userRequires2FA = userRequires2FA;
module.exports.createRequestHeaders = createRequestHeaders;
module.exports.getExistingToken = getExistingToken;
module.exports.createAuth = createAuth;
module.exports.getOptions = getOptions;

module.exports.requiresCode = function (auth, callback) {
    if (!_.isObject(auth) || !_.isString(auth.username) || !_.isString(auth.password)) {
        throw new Error('Username and password required to user requiresCode');
    }
    saveBasicAuth(auth.username, auth.password);
    userRequires2FA(callback);
};
