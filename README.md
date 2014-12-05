# masseuse [![Bower version](https://badge.fury.io/bo/masseuse.png)](http://badge.fury.io/bo/masseuse) [![Build Status](https://travis-ci.org/Solid-Interactive/masseuse.png?branch=bower)](https://travis-ci.org/Solid-Interactive/masseuse)

Version: 3.0.0-alpha

Bower pulls from the [bower branch](https://github.com/Solid-Interactive/masseuse/tree/bower) (build badge is showing results for [bower branch](https://github.com/Solid-Interactive/masseuse/tree/bower)):

https://github.com/Solid-Interactive/masseuse

## Docs & Tests

* [JSDocs](http://solid-interactive.github.io/masseuse/docs/)
    * [masseuse](http://solid-interactive.github.io/masseuse/docs/masseuse.html)
        * [BaseView](http://solid-interactive.github.io/masseuse/docs/BaseView.html)
        * [ComputedProperty](http://solid-interactive.github.io/masseuse/docs/ComputedProperty.html)
        * [MasseuseModel](http://solid-interactive.github.io/masseuse/docs/MasseuseModel.html)
        * [MasseuseRouter](http://solid-interactive.github.io/masseuse/docs/MasseuseRouter.html)
        * [ProxyProperty](http://solid-interactive.github.io/masseuse/docs/ProxyProperty.html)
        * [ViewContext](http://solid-interactive.github.io/masseuse/docs/ViewContext.html)
        * utilities
            * [channels](http://solid-interactive.github.io/masseuse/docs/channels.html)
        * plugins
            * rivets
                * [RivetsView](http://solid-interactive.github.io/masseuse/docs/RivetsView.html)

* [Tests - unoptimized for readability](http://solid-interactive.github.io/masseuse/tests/)


## Installation

You can use either [grunt-init](http://gruntjs.com/project-scaffolding) to setup your initial project scaffolding or [bower](http://bower.io/) to pull in masseuse as a dependency to an existing project.

   1. Use the [grunt-init-masseuse](https://github.com/Solid-Interactive/grunt-init-masseuse) template to create your  initial project scaffolding:

      ```
      # after following the setup instructions on grunt-init-masseuse
      cd my-new-project
      grunt-init masseuse
      [answer some questions about your project]
      npm install && bower install && grunt server
      ```

   1. Pull masseuse into an existing project:

      ```shell
      bower install masseuse
      ```

      1. Include it as a package in your requirejs config:

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

Masseuse does the following:

1. Adds lifecycle methods to Views that are optionally async using jQuery promises.
1. Allows simiple two way binding between DOM and Model / Colection data through a View with Rivets support
1. Allows easier separation of Views into a config containing options and functionality sections by providing several declarative shortcuts.
1. Adds support for adding child Views.
1. Provides Proxy and Computed Properties for Masseuse Models
1. Support getters and setters using dot notation with support for nested models.
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

* 0.0.1-alpha - 2014-01-03 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.0.1-alpha_2014-01-03.md)
* 0.0.2 - 2014-01-07 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.0.2_2014-01-07.md)
* 0.0.3 - 2014-01-07 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.0.3_2014-01-07.md)
* 0.1.0 - 2014-01-08 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.1.0_2014-01-08.md)
* 0.1.1 - 2014-01-09 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.1.1_2014-01-09.md)
* 0.2.0 - 2014-01-14 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.2.0_2014-01-14.md)
* 0.2.1 - 2014-01-15 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.2.1_2014-01-15.md)
* 0.2.2 - 2014-01-16 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/0.2.2_2014-01-16.md)
* 1.0.0 - 2014-01-20 - [backward incompatibilities](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.0.0_2014-01-20.md)
* 1.0.1 - 2014-01-20 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.0.1_2014-01-20.md)
* 1.0.2 - 2014-01-20 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.0.2_2014-01-20.md)
* 1.0.3 - 2014-01-21 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.0.3_2014-01-21.md)
* 1.1.0 - 2014-01-22 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.1.0_2014-01-22.md)
* 1.2.0 - 2014-01-23 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.2.0_2014-01-23.md)
* 1.2.1 - 2014-01-23 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.2.1_2014-01-23.md)
* 1.3.0 - 2014-01-24 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.3.0_2014-01-24.md)
* 1.3.2 - 2014-01-24 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.3.2_2014-01-24.md)
* 1.3.3 - 2014-01-28 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.3.3_2014-01-28.md)
* 1.3.4 - 2014-01-29 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.3.4_2014-01-29.md)
* 1.4.0 - 2014-01-30 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.4.0_2014-01-30.md)
* 1.5.0 - 2014-01-31 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.5.0_2014-01-31.md)
* 1.5.1 - 2014-02-03 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.5.1_2014-02-03.md)
* 1.5.2 - 2014-02-03 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.5.2_2014-02-03.md)
* 1.5.3 - 2014-02-04 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.5.3_2014-02-04.md)
* 1.6.0 - 2014-02-04 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.6.0_2014-02-04.md)
* 1.6.1 - 2014-02-04 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.6.1_2014-02-04.md)
* 1.6.2 - 2014-02-04 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.6.2_2014-02-04.md)
* 1.7.0 - 2014-02-05 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.0_2014-02-05.md)
* 1.7.1 - 2014-02-05 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.1_2014-02-05.md)
* 1.7.2 - 2014-02-06 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.2_2014-02-06.md)
* 1.7.3 - 2014-02-06 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.3_2014-02-06.md)
* 1.7.4 - 2014-02-06 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.4_2014-02-06.md)
* 1.7.5 - 2014-02-06 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.5_2014-02-06.md)
* 1.7.6 - 2014-02-09 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.7.6_2014-02-09.md)
* 1.8.0 - 2014-02-11 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.8.0_2014-02-11.md)
* 1.9.0 - 2014-02-18 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.9.0_2014-02-18.md)
* 1.9.1 - 2014-02-18 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.9.1_2014-02-18.md)
* 1.9.2 - 2014_02_19 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.9.2_2014_02_19.md)
* 1.10.0 - 2014-02-19 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.10.0_2014-02-19.md)
* 1.11.0 - 2014-02-20 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.11.0_2014-02-20.md)
* 1.11.1 - 2014-02-21 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.11.1_2014-02-21.md)
* 1.11.2 - 2014_02_24 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.11.2_2014_02_24.md)
* 1.11.3 - 2014-02-27 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.11.3_2014-02-27.md)
* 1.12.0 - 2014-02-28 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.12.0_2014-02-28.md)
* 1.13.0 - 2014-03-02 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.13.0_2014-03-02.md)
* 1.13.1 - 2014-03-02 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.13.1_2014-03-02.md)
* 1.13.2 - 2014-03-02 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.13.2_2014-03-02.md)
* 1.13.3 - 2014-03-03 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.13.3_2014-03-03.md)
* 1.13.4 - 2014-03-04 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.13.4_2014-03-04.md)
* 1.13.5 - 2014-03-04 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/1.13.5_2014-03-04.md)
* 2.0.0 - 2014-03-10 - [backward incompatibilities](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.0.0_2014-03-10.md)
* 2.0.1 - 2014-03-11 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.0.1_2014-03-11.md)
* 2.0.2 - 2014-03-12 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.0.2_2014-03-12.md)
* 2.0.3 - 2014-02-13 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.0.3_2014-02-13.md)
* 2.1.0 - 2014-03-28 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.1.0_2014-03-28.md)
* 2.1.1 - 2014-04-05 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.1.1_2014-04-05.md)
* 2.1.2 - 2014-04-07 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.1.2_2014-04-07.md)
* 2.1.3 - 2014-04-11 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.1.3_2014-04-11.md)
* 2.2.0 - 2014-04-13 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.0_2014-04-13.md)
* 2.2.1 - 2014-04-15 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.1_2014-04-15.md)
* 2.2.2 - 2014-04-25 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.2_2014-04-25.md)
* 2.2.3 - 2014-04-29 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.3_2014-04-29.md)
* 2.2.4 - 2014-05-22 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.4_2014-05-22.md)
* 2.2.5 - 2014-05-28 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.5_2014-05-28.md)
* 2.2.6 - 2014-06-10 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.2.6_2014-06-10.md)
* 2.3.0 - 2014-06-20 - [features](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.3.0_2014-06-20.md)
* 2.3.1 - 2014-08-13 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.3.1_2014-08-13.md)
* 2.3.2 - 2014-12-05 - [patches](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/2.3.2_2014-12-05.md)
* 3.0.0-alpha - 2014-12-05 - [backward incompatibilities](https://github.com/Solid-Interactive/masseuse/tree/master/release_notes/3.0.0-alpha_2014-12-05.md)


## Contributors (`git shortlog -s -n`)

* Peter Ajtai
* Greg Larrenaga
* Cooper Hilscher
* Jonathan Waltner
* kaijarayne
* Andrew Gurinovich
* michael.fenwick
* Travis McHattie
* Jesse McCabe
* Main Conf Room


_Compiled file. Do not modify directly. Created: 2014-12-05 02:02:37_
