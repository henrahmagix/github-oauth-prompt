# github-oauth [![Build Status](https://secure.travis-ci.org/henrahmagix/github-oauth.png?branch=master)](http://travis-ci.org/henrahmagix/github-oauth)

Easy creation of GitHub OAuth tokens.

## Getting Started
Install the module with: `npm install github-oauth`

```javascript
var oauth = require('github-oauth');

// Prompt for username, password, two-factor auth code if required,
// and return a GitHub token with basic scope.
var moonriseToken = oauth({
    name: 'moonrise-kingdom'
});

// Prompt for a token for read/write access to public repositories
// and organisations and write access to Gists.
var rushmoreToken = oauth({
    name: 'rushmore',
    scopes: ['public_repo', 'gist']
});

// Set prompt messages (mild customisation).
var aquaticToken = oauth({
    name: 'the-life-aquatic',
    prompt: {
        username: 'Enter username:',
        password: 'Enter password:',
        code: 'Enter two-factor authorisation code'
    }
});

// Skip prompt (spicy customisation).
var username = promptForUsername();
var password = promptForPassword();
var code = null;
// First test to see if a code is required.
var hasTwoFactorAuth = oauth.requiresCode({
    username: username,
    password: password
});
if (hasTwoFactorAuth) {
    // Ask for a code.
    code = promptForCode();
}
// Get a token with a two-factor authentication code.
var royalToken = oauth({
    name: 'the-royal-tenenbaums'
    username: username,
    password: password,
    code: code
});
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

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
