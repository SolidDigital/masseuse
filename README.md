# masseuse
==========

Masseuse is a collection of helpers for Backbone. It includes the following:

* Computed Properties for Models
* Proxy Properties for Models (TODO: coming soon!)
* Model / Collection data binding to the DOM using Rivets
* A simple Finite State Machine that uses `$.Deferred`
* A Channels Backbone event bus for View to View communication
* A custom router
* A mixin pattern that allows functions to be customized with default and actual properties as well as jQuery deferred.
* A BaseView

## Compute Properties

Computed Properties are properties on models that are computed from an array of other properties. Any time one of the
dependent properties are chenged, the computed property is recalculated.

Computed Properties are set

