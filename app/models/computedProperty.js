define(function () {
    'use strict';

    /**
     * @class A ComputedProperty is a property that depends on one or more other model values. Each time one of the other
     * values is changed, the ComputeProperty callback is called with the values of all the dependent fields.
     * See the tests for example usage.
     * @module models/ComputedProperty
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
