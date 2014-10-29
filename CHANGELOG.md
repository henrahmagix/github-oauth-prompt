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
