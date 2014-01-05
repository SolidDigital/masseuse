define(function () {

    'use strict';
    return getProperty;

    /**
     * Get properties from a passed in object bassed on a string descriptor of the desired field.
     * @module utilities/getProperty
     * @param obj
     * @param parts
     * @param create
     * @returns {*}
     */
    function getProperty (obj, parts, create) {
        var part;

        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

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