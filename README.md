# masseuse [![Build Status](https://travis-ci.org/Solid-Interactive/masseuse.png?branch=master)](https://travis-ci.org/Solid-Interactive/masseuse)

Version: _0.1.1_

https://github.com/Solid-Interactive/masseuse

## Docs & Tests

* [JSDocs](http://solid-interactive.github.io/masseuse/docs/)
* [Tests - unoptimized for readability](http://solid-interactive.github.io/masseuse/tests/)
* See the [wiki](https://github.com/Solid-Interactive/masseuse/wiki) for more detailed explanations.
    * [BaseView](https://github.com/Solid-Interactive/masseuse/wiki/BaseView)
    * [ComputedProperty](https://github.com/Solid-Interactive/masseuse/wiki/ComputedProperty)
    * [MasseuseModel](https://github.com/Solid-Interactive/masseuse/wiki/MasseuseModel)
    * [Options](https://github.com/Solid-Interactive/masseuse/wiki/Options)
    * [ProxyProperty](https://github.com/Solid-Interactive/masseuse/wiki/ProxyProperty)
    * [RivetView](https://github.com/Solid-Interactive/masseuse/wiki/Rivetview)

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

Masseuse does five main things:

1. Adds lifecycle methods to Views that are optionally async using jQuery promises.
1. Allows easier separation of Views into a config and functionality sections by providing several shortcut configs.
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

## Release Notes

* 0.2.0 - 2013-01-14 - [features](release_notes/0.2.0.md)
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
* Jesse McCabe
* Travis McHattie
