define(function () {
    'use strict';

    return ProxyProperty;

    /**
     * A ProxyProperty will allow a field on a model to depend on a field on another model.
     * See tests for use case.
     *
     * Proxy Properties are properties on a model that are equal to properties on another model. The link is two way, so
     * if one property changes, the other changes with it.
     *
     * For example if you have a User and Permissions model, and you want the User model to stay
     * up to date with the role in Permission.
     *
     * ```javascript
     * var permissions = new Backbone.Model({
     *                            role: 'admin'
     * }),
     * user = new Backbone.Model({
     *                            name: 'Jane',
     *                            role: ProxyProperty('role', permissions)
     * });
     *
     * console.log('admin' === user.get('role');
     *
     * permissions.set('role', 'superuser');
     * console.log('superuser' === user.get('role');
     *
     * user.set('role', 'consultant');
     * console.log('consultant' === permissions.get('role');
     * ```
     *
     * ### Nested Properties:
     * Proxy Properties can be infinitely nested references.
     * ```javascript
     * model1.set('object.nestedObject.tripleNested', 'Papas Emeritus');
     * model2.set('popeName', new ProxyProperty('object.nestedObject.tripleNested', model1));
     * console.log(model2.get('popeName')); ==> Papas Emeritus
     *
     * model2.set('popeName', 'Papas Victorious');
     * console.log(model1.get('object.nestedObject.tripleNested')); ==> Papas Victorious
     * ```
     *
     * ### Tests:
     * Proxy Properties are tested in `masseuseModelTests.js`.
     *
     * @namespace masseuse/ProxyProperty
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
});
