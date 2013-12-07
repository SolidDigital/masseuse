/*global define:false*/
define(function () {
    'use strict';

    ViewContext.prototype.getBoundFunction = function (context) {
        return _getProperty(context, this.field);
    }

    function ViewContext (field) {
        if (!(this instanceof ViewContext)) {
            return new ViewContext(field);
        }
        this.field = field;
    }

    return ViewContext;

    function _getProperty (obj, parts, create) {
        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

        var part;
        while (typeof obj === 'object' && obj && parts.length) {
            part = parts.shift();
            if (!(part in obj) && create) {
                obj[part] = {};
            }
            obj = obj[part];
        }

        return obj;
    }
});