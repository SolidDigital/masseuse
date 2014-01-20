/*global define:false*/
define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {
    'use strict';

    return function(options, defaultOptions) {
        var optionsClone = $.extend(true, {}, options),
            defaultOptionsClone = $.extend(true, {}, defaultOptions),
            optionsOverrideClone = optionsClone.optionsOverride ?
                $.extend(true, {}, optionsClone.optionsOverride) :
                undefined,
            hasOptionsOverride = !!optionsClone.optionsOverride;

        delete optionsClone.optionsOverride;

        if (!options && !defaultOptions) {
            return undefined;
        }

        if (!options && defaultOptions) {
            return defaultOptionsClone;
        }

        if (options) {
            if (hasOptionsOverride) {
                return _.extend(optionsOverrideClone, optionsClone);
            }
            if (defaultOptions) {
                return _.extend(defaultOptionsClone, optionsClone);
            }
            return optionsClone;
        }
    };
});
