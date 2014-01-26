/*global define:false*/
define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {
    'use strict';

    return function(options, defaultOptions, useDefaultOptions) {
        var optionsClone = $.extend(true, {}, options),
            defaultOptionsClone = $.extend(true, {}, defaultOptions);

        useDefaultOptions = false !== useDefaultOptions;

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

        if (!options && defaultOptions && useDefaultOptions) {
            return defaultOptionsClone;
        }

        if (options) {
            if (defaultOptions && useDefaultOptions) {
                return _.extend(defaultOptionsClone, optionsClone);
            }
            return optionsClone;
        }
    };
});
