define([], function () {
    /**
     * @param propertyName
     * @param propertyNameOnModel
     * @param model
     * @returns {ProxyProperty}
     * @constructor
     */
    function ProxyProperty (propertyName, propertyNameOnModel, model) {
        if (!(this instanceof ProxyProperty)) {
            return new ProxyProperty(propertyName, propertyNameOnModel, model);
        }

        this.propertyName = propertyName;
        this.propertyNameOnModel = propertyNameOnModel;
        this.model = model;
    }

    return ComputedProperty;
});
