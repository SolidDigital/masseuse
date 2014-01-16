/*global define:false*/
define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {
    'use strict';

    return function(options, defaultConfig) {
        var optionsClone = $.extend(true, {}, options),
            defaultConfigClone = $.extend(true, {}, defaultConfig),
            overridingConfigClone = optionsClone.config ? $.extend(true, {}, optionsClone.config) : undefined,
            hasOverridingConfig = !!optionsClone.config;

        delete optionsClone.config;

        if (!options && !defaultConfig) {
            return undefined;
        }

        if (!options && defaultConfig) {
            return defaultConfigClone;
        }

        if (options) {
            if (hasOverridingConfig) {
                return _.extend(overridingConfigClone, optionsClone);
            }
            if (defaultConfig) {
                return _.extend(defaultConfigClone, optionsClone);
            }
            return optionsClone;
        }
    };
});
