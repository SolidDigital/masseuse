# masseuse [![Bower version](https://badge.fury.io/bo/masseuse.png)](http://badge.fury.io/bo/masseuse) [![Build Status](https://travis-ci.org/Solid-Interactive/masseuse.png?branch=bower)](https://travis-ci.org/Solid-Interactive/masseuse)

Version: <%= pkg.version %>

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

<%= releaseNotes.notes %>

## Contributors (`git shortlog -s -n`)

<%= contributors %>

_<%= warning + ' Created: ' + grunt.template.today('yyyy-mm-dd hh:MM:ss') %>_
