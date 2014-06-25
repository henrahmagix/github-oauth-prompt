# github-oauth [![Build Status](https://secure.travis-ci.org/henrahmagix/github-oauth.png?branch=master)](http://travis-ci.org/henrahmagix/github-oauth)

### ALPHA
Currently in an alpha, non-working state.

Easy creation of GitHub OAuth tokens.

## Getting Started
Install the module with: `npm install github-oauth`

```javascript
var oauth = require('github-oauth');
var callback = function (token) {
    // Now you have a token.
};
oauth({name: 'my-token'}, callback);
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

// Prompt for a token for read/write access to public repositories
// and organisations and write access to Gists.
// More scopes: https://developer.github.com/v3/oauth/#scopes
var rushmoreToken = oauth({
    name: 'rushmore',
    scopes: ['public_repo', 'gist']
}, callback);

// Set prompt messages (mild customisation).
var aquaticToken = oauth({
    name: 'the-life-aquatic',
    prompt: {
        username: 'Enter username:',
        password: 'Enter password:',
        code: 'Enter two-factor authorisation code'
    }
}, callback);

// Skip prompt (spicy customisation).
// First test to see if a code is required.
oauth.requiresCode({
    username: 'username',
    password: '********'
}, function (hasTwoFactorAuth) {
    if (hasTwoFactorAuth) {
        // Get a code from the user.
        code = getCode();
    }
    // Get a token with a two-factor authentication code.
    var royalToken = oauth({
        name: 'the-royal-tenenbaums'
        username: username,
        password: password,
        code: code
    }, callback);
});
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
