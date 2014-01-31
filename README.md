# masseuse [![Build Status](https://travis-ci.org/Solid-Interactive/masseuse.png?branch=bower)](https://travis-ci.org/Solid-Interactive/masseuse)

Version: _1.5.0_

Bower pulls from the [bower branch](https://github.com/Solid-Interactive/masseuse/tree/bower) (build badge is showing results for [bower branch](https://github.com/Solid-Interactive/masseuse/tree/bower)):

https://github.com/Solid-Interactive/masseuse

## Docs & Tests

* [JSDocs](http://solid-interactive.github.io/masseuse/docs/)
    * [masseuse](http://solid-interactive.github.io/masseuse/docs/masseuse.html)
        * [BaseView](http://solid-interactive.github.io/masseuse/docs/BaseView.html)
        * [channels](http://solid-interactive.github.io/masseuse/docs/Channels.html)
        * [ComputedProperty](http://solid-interactive.github.io/masseuse/docs/ComputedProperty.html)
        * [MasseuseModel](http://solid-interactive.github.io/masseuse/docs/MasseuseModel.html)
        * [MasseuseRouter](http://solid-interactive.github.io/masseuse/docs/MasseuseRouter.html)
        * [ProxyProperty](http://solid-interactive.github.io/masseuse/docs/ProxyProperty.html)
        * [ViewContext](http://solid-interactive.github.io/masseuse/docs/ViewContext.html)
        * plugins
            * rivets
                * [RivetsView](http://solid-interactive.github.io/masseuse/docs/RivetsView.html)

* [Tests - unoptimized for readability](http://solid-interactive.github.io/masseuse/tests/)


## Installation

```shell
bower install masseuse
```

After getting masseuse, include it as a package in your requirejs config:

```javascript
require.config({
    ...
    packages : [
        {
            name : 'masseuse',
            location : 'components/masseuse/app'
        }
    ]
    ...
});
```

## Description

Masseuse is a Backbone helper library that uses RequireJS AMDs.

Masseuse is functional, and documentation and tests are being fleshed out.

Masseuse does six main things:

1. Adds lifecycle methods to Views that are optionally async using jQuery promises.
1. Allows easier separation of Views into a config and functionality sections by providing several shortcut configs.
1. Adds support of a View that uses Rivets
1. Adds support for adding child Views.
1. Provides Proxy and Computed Properties for Masseuse Models
1. Provides a Masseuse Router extension of the Backbone Router with a before routing callback.

Additionally there is support for append or replacing the `el` of views, optional plugin methods on view initialization,
and a channels singleton for use as an event bus.

## Usage

Look at the tests for example usage. More documentation coming soon.

## Contributing

Fork git repo, then:

```shell
bower install
```

For use in the browser:

```shell
npm install -g grunt-cli
```

To setup headless browses testing:

```shell
npm install -g mocha-phantomjs phantomjs
```

`grunt test` runs, opens, and watches the tests in the browser. Pull requests welcomed!
`grunt test-cli` runs tests headless.

## Utilities

* grunt task called `notes:since` to show release notes since a version number (have to match versions exactly)

    ```shell
    # all release notes
    grunt notes:since

    # all release notes since 1.0.0
    grunt notes:since:1.0.0

    # all release notes since the beginning until 0.0.3
    grunt notes:since::0.0.3
    ```

## Release Notes

* 1.4.0 - 2014-01-30 - [features](release_notes/1.4.0.md)
* 1.3.4 - 2014-01-29 - [patches](release_notes/1.3.4.md)
* 1.3.3 - 2014-01-28 - [patches](release_notes/1.3.3.md)
* 1.3.2 - 2014-01-24 - [patches](release_notes/1.3.2.md)
* 1.3.1 - 2014-01-24 - [patches](release_notes/1.3.1.md)
* 1.3.0 - 2014-01-24 - [features](release_notes/1.3.0.md)
* 1.2.1 - 2014-01-23 - [patches](release_notes/1.2.1.md)
* 1.2.0 - 2014-01-23 - [features](release_notes/1.2.0.md)
* 1.1.0 - 2014-01-22 - [features](release_notes/1.1.0.md)
* 1.0.3 - 2014-01-21 - [patches](release_notes/1.0.3.md)
* 1.0.2 - 2014-01-20 - [patches](release_notes/1.0.2.md)
* 1.0.1 - 2014-01-20 - [patches](release_notes/1.0.1.md)
* 1.0.0 - 2014-01-20 - [backwards incompatibilities](release_notes/1.0.0.md)
* 0.2.2 - 2014-01-16 - [patches](release_notes/0.2.2.md)
* 0.2.1 - 2014-01-15 - [patches](release_notes/0.2.1.md)
* 0.2.0 - 2014-01-14 - [features](release_notes/0.2.0.md)
* 0.1.1 - 2014-01-09 - [patches](release_notes/0.1.1.md)
* 0.1.0 - 2014-01-08 - [features](release_notes/0.1.0.md)
* 0.0.3 - 2014-01-07 - [patches](release_notes/0.0.3.md)
* 0.0.2 - 2014-01-07 - [patches](release_notes/0.0.2.md)
* 0.0.1-alpha - 2014-01-03 - [patches](release_notes/0.0.1.md)

## Contributors (`git shortlog -s -n`)

* Peter Ajtai
* Greg Larrenaga
* Cooper Hilscher
* Jonathan Waltner
* Travis McHattie
* michael.fenwick
* Jesse McCabe


_Compiled file. Do not modify directly. Created: 2014-01-31 09:36:29_
