/*global define:false*/
define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {
    'use strict';

    return function(options, defaultOptions) {
        var optionsClone = $.extend(true, {}, options),
            defaultOptionsClone = $.extend(true, {}, defaultOptions);

        // Undefined properties are not copied. http://api.jquery.com/jquery.extend/
        // For shadowing only the root level needs to be checked
        _.each(options, function(value, key) {
            if (undefined === value) {
                optionsClone[key] = value;
            }
        });

        if (!options && !defaultOptions) {
            return undefined;
        }

        if (!options && defaultOptions) {
            return defaultOptionsClone;
        }

        if (options) {
            if (defaultOptions) {
                return _.extend(defaultOptionsClone, optionsClone);
            }
            return optionsClone;
        }
    };
});
