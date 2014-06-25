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
var main = function (options) {

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
};

main.requiresCode = function () {
    return true;
};

module.exports = main;
