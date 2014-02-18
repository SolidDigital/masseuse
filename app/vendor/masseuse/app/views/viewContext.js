define(['../utilities/accessors'], function (accessors) {
    'use strict';

    ViewContext.prototype.getBoundFunction = function (context) {
        return accessors.getProperty(context, this.field);
    };

    return ViewContext;

    /**
     * Allows the storage of a method for later retrieval and attachment to a context.
     * @namespace masseuse/ViewContext
     * @param field
     */
    function ViewContext (field) {
        if (!(this instanceof ViewContext)) {
            return new ViewContext(field);
        }
        this.field = field;
    }
});
