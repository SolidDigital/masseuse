define([], function () {
    function ComputedProperty (listenablePropertyNames, callback) {
        if (!(this instanceof ComputedProperty)) {
            return new ComputedProperty(listenablePropertyNames, callback);
        }

        this.listenables = listenablePropertyNames;
        this.callback = callback;
    }

    return ComputedProperty;
});
