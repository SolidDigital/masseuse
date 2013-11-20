/*global define:false*/
define(function () {
    'use strict';

    Self.prototype.getBoundFunction = function(context) {
        return _getProperty(context, this.field);
    }

    function Self(field) {
        if (!(this instanceof Self)) {
            return new Self(field);
        }
        this.field = field;
    }

    return Self;

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