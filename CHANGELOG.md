## v1.1.0
- Allow `options.host` to connect to any GitHub server. This allows the use of GitHub Enterprise.

### v1.0.1
- Fix testing for 2FA since SMS fix when user has no 2FA.

# v1.0.0
- Only allow prompt types of input and password.
- Move prompt options code into separate function to allow testing.
- Add JSCS checker and reformat code to match rules.
- Add code coverage checker that hooks to [coveralls.io](coveralls.io) from Travis CI, and a corresponding badge to the README.
- Update release history in README with film names for major/minor versions and quotes from the film for patch versions.
- Add licence file. Type already stated in the README but a file provides more info, and follows repository conventions.

### v0.2.2
- Ensure SMS 2FA code is triggered from `userRequires2FA()`.

### v0.2.1
- Don't throw error at the end: the callback should handle it. This ensures we are keeping with the Node callback style.
- Fix auth checking for `requiresCode` where `auth.username` was being checked twice and `auth.password` wasn't being checked at all.

## v0.2.0
- Chang test log output to be more verbose.
- Allow options object to be passed to prompt creation.
- Fix `getOptions` tests to call the static method.
- Add `function` to type checking in tests.
- Rename `0` and `1` identifiers to `falsey number` and `truthy number` for test logs.
- Skip empty tests instead of them succeeding by doing nothing.

### v0.1.3
- Hide password on input.

### v0.1.2
- Fix package name internally.
- Move options checking to `getOptions` function, statically accessible also.
- Remove some unnecessary tests.

### v0.1.1
- Fix package name in docs.

# v0.1.0
- The first full working state.
