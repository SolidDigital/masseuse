# masseuse
==========

Masseuse is a collection of helpers for Backbone. It includes the following:

* Computed Properties for Models
* Proxy Properties for Models
* Model / Collection data binding to the DOM using Rivets
* A simple Finite State Machine that uses `$.Deferred`
* A Channels Backbone event bus for View to View communication
* A custom router
* A mixin pattern that allows functions to be customized with default and actual properties as well as jQuery deferred.
* A BaseView

## Computed Properties

Computed Properties are properties on models that are computed from an array of other properties on the same model. Any
time one of the dependent properties are chenged, the computed property is recalculated.

Computed Properties are set, optionally, when the computed property is defined, and subsequently anytime one of the
dependent properties are chnaged.

For example if there is a `PurchasedItem` model with properties of `price`, `taxes`, `discounts` then a Computed
Property could be created like this:

```javascript
var item = new PurchasedItem({
                                'price': 10,
                                'taxes': 0.8,
                                'discounts': 3,
                                'total':
                                    ComputedProperty(['price', 'taxes', 'discounts'],
                                        function (price, taxes, discounts) {
                                                         return price + taxes - discounts;
                                        })
                            });

console.log(7.8 == item.get('total'));
```

Computed Properties can be set like other Backbone properties. This is they can be set on initialization or after, and
they can be set using a key, value or as part of a larger attributes object.

An optional thired parameter of a Computed Property can be set to truthy to skip the initial Computed Property
calculation:

```javascript
var item = new PurchasedItem({
                                'total': ComputedProperty(['price'], function(price) { return ++price; }, true)
                            });

console.log(undefined === item.get('total'));

item.set('price', 1);
console.log(2 === item.get('total'));
```

Since Computed Properties depend on other properties, the should not be set directly.

Computed Properties are tested in `masseuseModelTests.js`.

## Proxy Properties

Proxy Properties are properties on a model that are equal to properties on another model. The link is two way, so
if one property changes, the other changes with it.

For example if you have a User and Permissions model, and you want the User model to stay
up to date with the role in Permission.

```javascript
var permissions = new Backbone.Model({
                                role: 'admin'
    }),
    user = new Backbone.Model({
                                name: 'Jane',
                                role: ProxyProperty('role', permissions)
    });

console.log('admin' === user.get('role');

permissions.set('role', 'superuser');
console.log('superuser' === user.get('role');

user.set('role', 'consultant');
console.log('consultant' === permissions.get('role');
```

Proxy Properties are test in `masseuseModelTests.js`.

## Rivet Views

Masseuse depends on Rivets, and Masseuse comes with a custom Rivets adapter that works with Backbone Collections.

Rivets is a library that two way binds the DOM to Backbone data.
