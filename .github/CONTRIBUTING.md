# Contributing to resolution-editor
We're really happy you'd like to contribute to this project! You can help us make this project nicer in a variety of ways.

## How to contribute
Drop me (douira) a line if you are part of/affiliated with MUNOL or otherwise think you should have the right to directly contribute. You can also make a fork and create a pull request after having implemented the feature you really really want or fixed some bug or just helped out. Bug reports are possible through the editor itself. (it directs to the new issue page) You can also simply create an issue for this repo and we'll look into it.

Code style has to be adapted to the already used style and kept as consistent as possible.
Including but not limited to the following:
- Indent everything with 2 spaces
- Curly opening bracket right after closing round one (in functions)
- new features only on server side code (like arrow functions)
- use semicolons where possible
- name JS stuff and events in lowerCamelCase and pug IDs and classes with-hyphenation.
- JSON is also to be formatted appropriately (unless never looked at), use an online formatter if necessary
- Use JSHint with the given configuration file to validate your code before committing (and remove all errors!)
- HoundCi checks that all pull requests comply with the linting rules
- JS version is ES5 in browsers (so it's still mostly ok with IE10) and latest stable feature set in node.js (so without harmony flag) This will change when Materialize is updated to 1.0 and support for non-ES6 browsers will be dropped!
- enable bitwise operators and other special options per-file
- each js file must include a jsHint header to specify its use in browser or server

Typo fixes or small bugs are worthy of an issue too. So, if you find any bug that doesn't already have an issue, report it!

## How to file a bug
Make a screenshot of the bug as soon as it occurs. Also, make screenshots of any subsequent variations on the bug if there are any. Please try to provide as much helpful information as possible. See the template file or the filled in template text when you create a new issue. 

## Note on using git with this repo
Please run `git fetch -p` after having deleted a branch from a merged PR. This will actually delete the branch on the remote git servers instead of just "fake" deleting it.
Use `npm install` to resolve merge conflicts in package-lock.json if there are any. Npm will automatically detect and fix git merge conflicts.

## Tags
- The `bug` tag can be used on issues that describe a bug or on PRs that fix bugs.
- The `do not merge` tag may be added to a PR in order to show that the PR is still being worked on and should not be merged yet because it's a WIP.