define([], function () {
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
