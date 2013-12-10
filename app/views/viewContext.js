define(['../utilities/getProperty'], function (getProperty) {
    'use strict';

    ViewContext.prototype.getBoundFunction = function (context) {
        return getProperty(context, this.field);
    };

    return ViewContext;

    function ViewContext (field) {
        if (!(this instanceof ViewContext)) {
            return new ViewContext(field);
        }
        this.field = field;
    }
});