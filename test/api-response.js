// - - - N O   2 F A - - -

// B A D
// Bad no 2FA: test auth
function testAuthNo2FABad () {
    this.nock('https://api.github.com:443')
        .get('/authorizations')
        .reply(401, {"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '401 Unauthorized',
        'x-github-media-type': 'github.beta; format=json',
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '43',
        'x-ratelimit-reset': '1404343458',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '83',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff' });
}
// Bad no 2FA: make new token
function makeNewNo2FABad () {
    this.nock('https://api.github.com:443')
        .post('/authorizations', {"scopes":[],"note":"test","note_url":""})
        .reply(401, {"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '401 Unauthorized',
        'x-github-media-type': 'github.beta; format=json',
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '42',
        'x-ratelimit-reset': '1404343458',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '83',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff' });
}

// G O O D
// Good no 2FA: test auth
function testAuthNo2FAGood () {
    this.nock('https://api.github.com:443')
        .get('/authorizations')
        .reply(200, [], { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '200 OK',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4999',
        'x-ratelimit-reset': '1404343857',
        'cache-control': 'private, max-age=60, s-maxage=60',
        etag: '"abcdefghijklmnopqrstuvwxyzabcdef"',
        vary: 'Accept, Authorization, Cookie, X-GitHub-OTP',
        'x-github-media-type': 'github.beta; format=json',
        link: '<https://api.github.com/authorizations?page=0>; rel="last"',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '2',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff',
        'x-served-by': 'abcdefghijklmnopqrstuvwxyzabcdef' });
}
// Good no 2FA: make new token
function makeNewNo2FAGood () {
    this.nock('https://api.github.com:443')
        .post('/authorizations', {"scopes":[],"note":"test","note_url":""})
        .reply(201, {"id":9999999,"url":"https://api.github.com/authorizations/0000000","app":{"name":"test","url":"https://developer.github.com/v3/oauth_authorizations/","client_id":"xxxxxxxxxxxxxxxxxxxx"},"token":"abcdefghijklmnopqrstuvwxyzabcdefghijklmn","note":"test","note_url":"","created_at":"1970-01-01T00:00:00Z","updated_at":"1970-01-01T00:00:00Z","scopes":[]}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '201 Created',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4998',
        'x-ratelimit-reset': '1404343857',
        'cache-control': 'private, max-age=60, s-maxage=60',
        etag: '"abcdefghijklmnopqrstuvwxyzabcdef"',
        location: 'https://api.github.com/authorizations/0000000',
        vary: 'Accept, Authorization, Cookie, X-GitHub-OTP',
        'x-github-media-type': 'github.beta; format=json',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '356',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff' });
}
// Good no 2FA: make new token, already exists
function makeNewExistsNo2FAGood () {
    this.nock('https://api.github.com:443')
        .post('/authorizations', {"scopes":[],"note":"existing","note_url":""})
        .reply(422, {"message":"Validation Failed","documentation_url":"https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization","errors":[{"resource":"OauthAccess","code":"already_exists","field":"description"}]}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '422 Unprocessable Entity',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4998',
        'x-ratelimit-reset': '1404347502',
        'x-github-media-type': 'github.beta; format=json',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '218',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff' });
}
// Good no 2FA: get existing token (gets all tokens)
function getExistingNo2FAGood () {
    this.nock('https://api.github.com:443')
        .get('/authorizations')
        .reply(200, [{"id":9999999,"url":"https://api.github.com/authorizations/0000000","app":{"name":"test (API)","url":"https://developer.github.com/v3/oauth_authorizations/","client_id":"00000000000000000000"},"token":"abcdefghijklmnopqrstuvwxyzabcdefghijklmn","note":"existing","note_url":"","created_at":"1970-01-01T00:00:00Z","updated_at":"1970-01-01T00:00:00Z","scopes":[]}], { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '200 OK',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4997',
        'x-ratelimit-reset': '1404347502',
        'cache-control': 'private, max-age=60, s-maxage=60',
        etag: '"abcdefghijklmnopqrstuvwxyzabcdef"',
        vary: 'Accept, Authorization, Cookie, X-GitHub-OTP',
        'x-github-media-type': 'github.beta; format=json',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '738',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff',
        'x-served-by': 'abcdefghijklmnopqrstuvwxyzabcdef' });
}

// - - - H A S   2 F A - - -

// B A D
// Bad has 2FA: test auth
function testAuthHas2FABad () {
    this.nock('https://api.github.com:443')
        .get('/authorizations')
        .reply(401, {"message":"Must specify two-factor authentication OTP code.","documentation_url":"https://developer.github.com/v3/auth#working-with-two-factor-authentication"}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '401 Unauthorized',
        'x-github-otp': 'required; app',
        'x-github-media-type': 'github.beta; format=json',
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '41',
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
        'x-content-type-options': 'nosniff' });
}
// Bad has 2FA: make new token
function makeNewHas2FABad () {
    this.nock('https://api.github.com:443')
        .post('/authorizations', {"scopes":[],"note":"test","note_url":""})
        .reply(401, {"message":"Must specify two-factor authentication OTP code.","documentation_url":"https://developer.github.com/v3/auth#working-with-two-factor-authentication"}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '401 Unauthorized',
        'x-github-otp': 'required; app',
        'x-github-media-type': 'github.beta; format=json',
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '40',
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
        'x-content-type-options': 'nosniff' });
}

// G O O D
// Good has 2FA: test auth
function testAuthHas2FAGood () {
    this.nock('https://api.github.com:443')
        .get('/authorizations')
        .reply(401, {"message":"Must specify two-factor authentication OTP code.","documentation_url":"https://developer.github.com/v3/auth#working-with-two-factor-authentication"}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '401 Unauthorized',
        'x-github-otp': 'required; app',
        'x-github-media-type': 'github.beta; format=json',
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '39',
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
        'x-content-type-options': 'nosniff' });
}
// Good has 2FA: make new token
function makeNewHas2FAGood () {
    this.nock('https://api.github.com:443')
        .post('/authorizations', {"scopes":[],"note":"test-new","note_url":""})
        .reply(201, {"id":9999999,"url":"https://api.github.com/authorizations/0000000","app":{"name":"test","url":"https://developer.github.com/v3/oauth_authorizations/","client_id":"xxxxxxxxxxxxxxxxxxxx"},"token":"abcdefghijklmnopqrstuvwxyzabcdefghijklmn","note":"test","note_url":"","created_at":"1970-01-01T00:00:00Z","updated_at":"1970-01-01T00:00:00Z","scopes":[]}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '201 Created',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4997',
        'x-ratelimit-reset': '1404343901',
        'cache-control': 'private, max-age=60, s-maxage=60',
        etag: '"abcdefghijklmnopqrstuvwxyzabcdef"',
        location: 'https://api.github.com/authorizations/0000000',
        vary: 'Accept, Authorization, Cookie, X-GitHub-OTP',
        'x-github-media-type': 'github.beta; format=json',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '364',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff' });
}
// Good has 2FA: make new token, already exists
function makeNewExistsHas2FAGood () {
    this.nock('https://api.github.com:443')
        .post('/authorizations', {"scopes":[],"note":"existing","note_url":""})
        .reply(422, {"message":"Validation Failed","documentation_url":"https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization","errors":[{"resource":"OauthAccess","code":"already_exists","field":"description"}]}, { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '422 Unprocessable Entity',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4999',
        'x-ratelimit-reset': '1404343901',
        'x-github-media-type': 'github.beta; format=json',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '218',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff' });
}
// Good has 2FA: get existing token (gets all tokens)
function getExistingHas2FAGood () {
    this.nock('https://api.github.com:443')
        .get('/authorizations')
        .reply(200, [{"id":9999999,"url":"https://api.github.com/authorizations/0000000","app":{"name":"test (API)","url":"https://developer.github.com/v3/oauth_authorizations/","client_id":"00000000000000000000"},"token":"abcdefghijklmnopqrstuvwxyzabcdefghijklmn","note":"existing","note_url":"","created_at":"1970-01-01T00:00:00Z","updated_at":"1970-01-01T00:00:00Z","scopes":[]}], { server: 'GitHub.com',
        date: 'Wed, 02 Jul 2014 00:00:00 GMT',
        'content-type': 'application/json; charset=utf-8',
        status: '200 OK',
        'x-ratelimit-limit': '5000',
        'x-ratelimit-remaining': '4998',
        'x-ratelimit-reset': '1404343901',
        'cache-control': 'private, max-age=60, s-maxage=60',
        etag: '"abcdefghijklmnopqrstuvwxyzabcdef"',
        vary: 'Accept, Authorization, Cookie, X-GitHub-OTP',
        'x-github-media-type': 'github.beta; format=json',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'deny',
        'content-security-policy': 'default-src \'none\'',
        'content-length': '4087',
        'access-control-allow-credentials': 'true',
        'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
        'access-control-allow-origin': '*',
        'x-github-request-id': '00000000:0000:000000:00000000',
        'strict-transport-security': 'max-age=31536000; includeSubdomains',
        'x-content-type-options': 'nosniff',
        'x-served-by': 'abcdefghijklmnopqrstuvwxyzabcdef' });
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
