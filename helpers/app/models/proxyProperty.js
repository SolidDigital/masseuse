/*global define:false*/
define(function () {
    'use strict';

    /**
     * @param propertyNameOnModel
     * @param model
     * @returns {ProxyProperty}
     * @constructor
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
