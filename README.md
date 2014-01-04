# masseuse
==========

Version: _0.0.0-alpha_

## Installation

```
bower install masseuse
```

## Description

Masseuse is a Backbone helper library.

This is an alpha release. Masseuse is functional, and documentation and tests are being fleshed out.

Masseuse does five main things:

1. Adds lifecycle methods to Views that are optionally async using jQuery promises.
1. Allows the separations of Views into a config and functionality sections.
1. Adds support for adding child Views.
1. Provides Proxy and Computed Properties for Masseuse Models
1. Provides a Masseuse Router extension of the Backbone Router with a before routing callback.

Additionally there is support for append or replacing the `el` of views, optional plugin methods on view initialization,
and a channels singleton for use as an event bus.

## Usage

Look at the tests for example usage. More documentation coming soon.

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

Proxy Properties are tested in `masseuseModelTests.js`.

## BaseView

The BaseView is a custom extension of Backbone.View with some built in functionality and a defined life cycle. The life
cycle methods can be run either synchronously or asynchronously.

To initialize a BaseView, there are several choices of options to pass in:

```javascript
var view = new BaseView({
    name : 'MyName',
        // A string that can later be used to identify the view
    appendView : false,
        // If truthy this view will be appended to this.$el
        // If falsey this view will be the innerHtml of this.$el
    ModelType : MyCustomModel,
        // The model "class" to be used for this.model
        // If left undefined or falsey Backbone.Model is used by default
    bindings : [
        ['model', 'change:price', 'showNewPrice'],
        ['model', 'change:discount', 'animateAdvertisement']
    ],
        // Bindings are a shortcut for adding event listeners to a view.
        // They are arrays of strings. The context is assumed to be the view.
    templateHtml : '<div><%= price %> : <%= discount %></div>',
        // Underscore templating that will - if provided - be turned into this.template using _.template(templateHtml)
    rivetConfig : 'auto'
        // The configuration options for Rivets that this view uses. If left out the view doesn't use Rivets.
        // Setting to auto will have the scope of Rivets be `# + this.cid`, the Rivets prefix `rv` and `this.model.viewId`
        // will be ths cid. A templating solution would have to be used to populate the DOM with the cid
        // Otherwise, the RivetConfigs can be set manually.

});
```

Release Notes:

* 0.0.0-alpha - 2014-01-03