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

    var tokenNote = options.name;
    if (!_.isString(tokenNote) || tokenNote.length === 0) {
        throw new Error('Required option: name');
    }

    var scopes = options.scopes;
    if (scopes == null) {
        scopes = [];
    }
    if (!_.isArray(scopes)) {
        throw new Error('Scopes must be an array');
    }
};

main.requiresCode = function () {
    return true;
};

module.exports = main;
