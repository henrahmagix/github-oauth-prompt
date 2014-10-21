var _ = require('lodash');

var NOCK_API_URL = 'https://api.github.com:443';
var NOCK_API_ENDPOINT = '/authorizations';

// POSTS
var NOCK_POST_TEST = {"scopes":[],"note":"test","note_url":""};

// BODY MESSAGES
var NOCK_BODY_BAD_USERPASS = {"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"};
var NOCK_BODY_BAD_2FA = {"message":"Must specify two-factor authentication OTP code.","documentation_url":"https://developer.github.com/v3/auth#working-with-two-factor-authentication"};
var NOCK_BODY_BAD_TOKEN_EXISTS = {"message":"Validation Failed","documentation_url":"https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization","errors":[{"resource":"OauthAccess","code":"already_exists","field":"description"}]};

// BODY RESULTS
var NOCK_BODY_TOKEN = {"id":9999999,"url":"https://api.github.com/authorizations/9999999","app":{"name":"test","url":"https://developer.github.com/v3/oauth_authorizations/","client_id":"00000000000000000000"},"token":"abcdefghijklmnopqrstuvwxyzabcdefghijklmn","note":"test","note_url":"","created_at":"1970-01-01T00:00:00Z","updated_at":"1970-01-01T00:00:00Z","scopes":[]};
var NOCK_BODY_EMPTY_AUTHORIZATIONS = [];
var NOCK_BODY_ALL_AUTHORIZATIONS = [NOCK_BODY_TOKEN];

// HEADERS
var DEFAULT_HEADERS = {
    server: 'GitHub.com',
    date: 'Wed, 02 Jul 2014 00:00:00 GMT',
    'content-type': 'application/json; charset=utf-8',
    'x-github-media-type': 'github.beta; format=json',
    'x-ratelimit-reset': '1404343458',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'deny',
    'content-security-policy': 'default-src \'none\'',
    'content-length': '160',
    'access-control-allow-credentials': 'true',
    'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
    'access-control-allow-origin': '*',
    'x-github-request-id': '00000000:0000:000000:00000000',
    'strict-transport-security': 'max-age=31536000; includeSubdomains',
    'x-content-type-options': 'nosniff'
};
var RATELIMIT_NO2FA = {
    'x-ratelimit-limit': '60',
    'x-ratelimit-remaining': '59'
};
var RATELIMIT_HAS2FA = {
    'x-ratelimit-limit': '5000',
    'x-ratelimit-remaining': '4999'
};
var RESULT_HEADERS = {
    'cache-control': 'private, max-age=60, s-maxage=60',
    etag: '"abcdefghijklmnopqrstuvwxyzabcdef"',
    vary: 'Accept, Authorization, Cookie, X-GitHub-OTP'
};

var NOCK_HEADERS_BAD_USERPASS = _.defaults({
    status: '401 Unauthorized'
}, RATELIMIT_NO2FA, DEFAULT_HEADERS);

var NOCK_HEADERS_BAD_2FA = _.defaults({
    'x-github-otp': 'required; app'
}, NOCK_HEADERS_BAD_USERPASS);

var NOCK_HEADERS_BAD_TOKEN_EXISTS = _.defaults({
    status: '422 Unprocessable Entity'
}, RATELIMIT_HAS2FA, DEFAULT_HEADERS);

var NOCK_HEADERS_CREATED = _.defaults({
    status: '201 Created',
    location: 'https://api.github.com/authorizations/9999999'
}, RATELIMIT_HAS2FA, RESULT_HEADERS, DEFAULT_HEADERS);

var NOCK_HEADERS_ALL_AUTHORIZATIONS = _.defaults({
    status: '200 OK',
    'x-served-by': 'abcdefghijklmnopqrstuvwxyzabcdef'
}, RESULT_HEADERS, DEFAULT_HEADERS);
var NOCK_HEADERS_ALL_AUTHORIZATIONS_NO2FA = _.defaults({}, RATELIMIT_NO2FA);
var NOCK_HEADERS_ALL_AUTHORIZATIONS_HAS2FA = _.defaults({}, RATELIMIT_HAS2FA);

var NOCK_HEADERS_EMPTY_AUTHORIZATIONS = _.defaults({
    link: '<https://api.github.com/authorizations?page=0>; rel="last"'
}, NOCK_HEADERS_ALL_AUTHORIZATIONS);
var NOCK_HEADERS_EMPTY_AUTHORIZATIONS_NO2FA = _.defaults({}, RATELIMIT_NO2FA);
var NOCK_HEADERS_EMPTY_AUTHORIZATIONS_HAS2FA = _.defaults({}, RATELIMIT_HAS2FA);

// B A D
// Bad no 2FA: test auth
function testAuthNo2FABad () {
    this.nock(NOCK_API_URL)
        .get(NOCK_API_ENDPOINT)
        .reply(
            401,
            NOCK_BODY_BAD_USERPASS,
            NOCK_HEADERS_BAD_USERPASS
        );
}
// Bad has 2FA: test auth
function testAuthHas2FABad () {
    this.nock(NOCK_API_URL)
        .get(NOCK_API_ENDPOINT)
        .reply(
            401,
            NOCK_BODY_BAD_2FA,
            NOCK_HEADERS_BAD_2FA
        );
}
// Bad no 2FA: make new token
function makeNewNo2FABad () {
    this.nock(NOCK_API_URL)
        .post(NOCK_API_ENDPOINT, NOCK_POST_TEST)
        .reply(
            401,
            NOCK_BODY_BAD_USERPASS,
            NOCK_HEADERS_BAD_USERPASS
        );
}
// Bad has 2FA: make new token
function makeNewHas2FABad () {
    this.nock(NOCK_API_URL)
        .post(NOCK_API_ENDPOINT, NOCK_POST_TEST)
        .reply(
            401,
            NOCK_BODY_BAD_2FA,
            NOCK_HEADERS_BAD_2FA
        );
}

// G O O D
// Good no 2FA: test auth
function testAuthNo2FAGood () {
    this.nock(NOCK_API_URL)
        .get(NOCK_API_ENDPOINT)
        .reply(
            200,
            NOCK_BODY_EMPTY_AUTHORIZATIONS,
            NOCK_HEADERS_EMPTY_AUTHORIZATIONS_NO2FA
        );
}
// Good has 2FA: test auth
function testAuthHas2FAGood () {
    this.nock(NOCK_API_URL)
        .get(NOCK_API_ENDPOINT)
        .reply(
            401,
            NOCK_BODY_BAD_2FA,
            NOCK_HEADERS_BAD_2FA
        );
}
// Good no 2FA: make new token
function makeNewNo2FAGood () {
    this.nock(NOCK_API_URL)
        .post(NOCK_API_ENDPOINT, NOCK_POST_TEST)
        .reply(
            201,
            NOCK_BODY_TOKEN,
            NOCK_HEADERS_CREATED
        );
}
// Good has 2FA: make new token
function makeNewHas2FAGood () {
    this.nock(NOCK_API_URL)
        .post(NOCK_API_ENDPOINT, NOCK_POST_TEST)
        .reply(
            201,
            NOCK_BODY_TOKEN,
            NOCK_HEADERS_CREATED
        );
}
// Good no 2FA: make new token, already exists
function makeNewExistsNo2FAGood () {
    this.nock(NOCK_API_URL)
        .post(NOCK_API_ENDPOINT, NOCK_POST_TEST)
        .reply(
            422,
            NOCK_BODY_BAD_TOKEN_EXISTS,
            NOCK_HEADERS_BAD_TOKEN_EXISTS
        );
}
// Good has 2FA: make new token, already exists
function makeNewExistsHas2FAGood () {
    this.nock(NOCK_API_URL)
        .post(NOCK_API_ENDPOINT, NOCK_POST_TEST)
        .reply(
            422,
            NOCK_BODY_BAD_TOKEN_EXISTS,
            NOCK_HEADERS_BAD_TOKEN_EXISTS
        );
}
// Good no 2FA: get existing token (gets all tokens)
function getExistingNo2FAGood () {
    this.nock(NOCK_API_URL)
        .get(NOCK_API_ENDPOINT)
        .reply(
            200,
            NOCK_BODY_ALL_AUTHORIZATIONS,
            NOCK_HEADERS_ALL_AUTHORIZATIONS_NO2FA
        );
}
// Good has 2FA: get existing token (gets all tokens)
function getExistingHas2FAGood () {
    this.nock(NOCK_API_URL)
        .get(NOCK_API_ENDPOINT)
        .reply(
            200,
            NOCK_BODY_ALL_AUTHORIZATIONS,
            NOCK_HEADERS_ALL_AUTHORIZATIONS_HAS2FA
        );
}

// - - - G E T T E R S - - -

var responses = {
    testAuth: {
        no2FA: {
            good: testAuthNo2FAGood,
            bad: testAuthNo2FABad
        },
        has2FA: {
            good: testAuthHas2FAGood,
            bad: testAuthHas2FABad
        }
    },
    makeNew: {
        no2FA: {
            good: makeNewNo2FAGood,
            bad: makeNewNo2FABad
        },
        has2FA: {
            good: makeNewHas2FAGood,
            bad: makeNewHas2FABad
        }
    },
    makeNewExists: {
        no2FA: {
            good: makeNewExistsNo2FAGood
        },
        has2FA: {
            good: makeNewExistsHas2FAGood
        }
    },
    getExisting: {
        no2FA: {
            good: getExistingNo2FAGood
        },
        has2FA: {
            good: getExistingHas2FAGood
        }
    }
};

function ApiResponse (nock) {
    var self = this;
    function createPrototype (obj, methods) {
        var _ = require('lodash');
        _.each(methods, function (method, name) {
            if (!_.isFunction(method)) {
                obj[name] = {};
                createPrototype(obj[name], method);
            } else {
                obj[name] = _.bind(method, self);
            }
        });
    }
    createPrototype(this, responses);
    this.nock = nock;
    return this;
}

module.exports = function main (nock) {
    return new ApiResponse(nock);
};
