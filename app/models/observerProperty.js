define(function () {
    'use strict';

    return ObserverProperty;

    /**
     * ObserverProperties are one way ProxyProperties.
     * See ProxyProperties for more information.
     *
     * @namespace masseuse/ObserverProperty
     * @param propertyNameOnModel
     * @param model
     */
    function ObserverProperty (propertyNameOnModel, model) {
        if (!(this instanceof ObserverProperty)) {
            return new ObserverProperty(propertyNameOnModel, model);
        }

        this.propertyNameOnModel = propertyNameOnModel;
        this.model = model;
    }
});
