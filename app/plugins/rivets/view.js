define(['../../views/baseView', './plugin'], function(BaseView, plugin) {
    'use strict';
    return BaseView.extend({
        initialize : initialize
    });

    function initialize (options) {
        options.plugins = options.plugins || [];
        options.plugins.push(plugin);
        BaseView.prototype.initialize.call(this, options);
    }
});
