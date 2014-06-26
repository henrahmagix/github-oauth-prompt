# github-oauth [![Build Status](https://secure.travis-ci.org/henrahmagix/github-oauth.png?branch=master)](http://travis-ci.org/henrahmagix/github-oauth)

Easy creation of GitHub OAuth tokens.

Currently in an alpha, non-working state.

## Getting Started
Install the module with: `npm install github-oauth`

```javascript
var oauth = require('github-oauth');
oauth({name: 'my-token'}, function (token) {
    // Now you have a token.
});
```

## Documentation
_(Coming soon)_

## Examples
```javascript
// Prompt for username, password, two-factor auth code if required,
// and return a GitHub token with basic scope.
var moonriseToken = oauth({
    name: 'moonrise-kingdom'
}, callback);

// Prompt for a token for read/write access to all repositories
// and organisations and write access to Gists.
// More scopes: https://developer.github.com/v3/oauth/#scopes
var rushmoreToken = oauth({
    name: 'rushmore',
    scopes: ['repo', 'gist']
}, callback);

// Set prompt messages.
var aquaticToken = oauth({
    name: 'the-life-aquatic',
    prompt: {
        username: 'Enter username:',
        password: 'Enter password:',
        code: 'Enter two-factor authorisation code'
    }
}, callback);

// Use own prompt. Must deal with two-factor authentication.
// Setup a function to call oauth with a code.
function getToken (code) {
    // Get a token with a two-factor authentication code.
    var royalToken = oauth({
        name: 'the-royal-tenenbaums'
        username: username,
        password: password,
        code: code
    }, callback);
}
// Test to see if a code is required.
oauth.requiresCode(
    {
        username: 'username',
        password: '********'
    },
    function (hasTwoFactorAuth) {
        if (!hasTwoFactorAuth) {
            // No need for a code.
            getToken();
        } else {
            // You need to get a two-factor authentication code from
            // the user.
            // Asynchronous: pass a callback.
            askForCode(function (code) {
                getToken(code);
            });
            // Synchronous: code is returned.
            var code = askForCode();
            getToken(code);
        }
    }
);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

```bash
npm install && grunt && grunt watch
```

## Release History
- **v0.0.1**, *TBD*
    - Bottle Rocket

## License
Copyright (c) 2014 Henry Blyth. Licensed under the MIT license.
