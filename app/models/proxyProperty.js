define(function () {
    'use strict';

    /**
     * A ProxyProperty will allow a field on a model to depend on a field on another model.
     * See tests for use case.
     * @namespace ProxyProperty
     * @param propertyNameOnModel
     * @param model
     */
    function ProxyProperty (propertyNameOnModel, model) {
        if (!(this instanceof ProxyProperty)) {
            return new ProxyProperty(propertyNameOnModel, model);
        }

        this.propertyNameOnModel = propertyNameOnModel;
        this.model = model;
    }

    return ProxyProperty;
});
