define(['../utilities/getProperty'], function (getProperty) {
    'use strict';

    /**
     * @class Allows the storage of a method for later retrieval and attachment to a context.
     * @module views/ViewContext
     * @param context
     * @returns {*}
     */
    ViewContext.prototype.getBoundFunction = function (context) {
        return getProperty.getProperty(context, this.field);
    };

    return ViewContext;

    function ViewContext (field) {
        if (!(this instanceof ViewContext)) {
            return new ViewContext(field);
        }
        this.field = field;
    }
});