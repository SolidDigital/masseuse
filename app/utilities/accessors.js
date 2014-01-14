define(function () {

    'use strict';
    return {
        getProperty : getProperty,
        setProperty : setProperty
    };

    /**
     * Get properties from a passed in object based on a string descriptor of the desired field.
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

    function setProperty (obj, parts, value) {
        var part;

        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

        part = parts.shift();
        obj = this.getProperty(obj, parts, true);
        if (obj && typeof obj === 'object') {
            obj[part] = value;
            return obj;
        }
    }

});
