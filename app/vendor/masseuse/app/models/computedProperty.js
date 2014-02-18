define(function () {
    'use strict';

    /**
     * A ComputedProperty is a property that depends on one or more other model values. Each time one of the other
     * values is changed, the ComputeProperty callback is called with the values of all the dependent fields.
     * See the tests for example usage.
     *
     * Computed Properties are properties on models that are computed from an array of other properties on the same
     * model. Any
     * time one of the dependent properties are chenged, the computed property is recalculated.
     *
     * Computed Properties are set, optionally, when the computed property is defined, and subsequently anytime one of
     * the
     * dependent properties are chnaged.
     *
     * For example if there is a `PurchasedItem` model with properties of `price`, `taxes`, `discounts` then a Computed
     * Property could be created like this:
     *
     * ```javascript
     * var item = new PurchasedItem({
     *                            'price': 10,
     *                            'taxes': 0.8,
     *                            'discounts': 3,
     *                            'total':
     *                                ComputedProperty(['price', 'taxes', 'discounts'],
     *                                    function (price, taxes, discounts) {
     *                                                     return price + taxes - discounts;
     *                                    })
     *                        });
     *
     * console.log(7.8 == item.get('total'));
     * ```
     *
     * Computed Properties can be set like other Backbone properties. This is they can be set on initialization or
     * after, and
     * they can be set using a key, value or as part of a larger attributes object.
     *
     * An optional thired parameter of a Computed Property can be set to truthy to skip the initial Computed Property
     * calculation:
     *
     * ```javascript
     * var item = new PurchasedItem({
     *                            'total': ComputedProperty(['price'], function(price) { return ++price; }, true)
     *                        });
     *
     * console.log(undefined === item.get('total'));
     *
     * item.set('price', 1);
     * console.log(2 === item.get('total'));
     * ```
     *
     * Since Computed Properties depend on other properties, the should not be set directly.
     *
     * Computed Properties are tested in `masseuseModelTests.js`.
     *
     * @namespace masseuse/ComputedProperty
     * @param listenablePropertyNames
     * @param callback
     * @param skipInitialComputation
     */
    function ComputedProperty (listenablePropertyNames, callback, skipInitialComputation) {
        if (!(this instanceof ComputedProperty)) {
            return new ComputedProperty(listenablePropertyNames, callback, skipInitialComputation);
        }

        this.listenables = listenablePropertyNames;
        this.callback = callback;
        this.skipInitialComputation = skipInitialComputation;
    }

    return ComputedProperty;
});
