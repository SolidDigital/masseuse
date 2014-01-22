define(['../../views/baseView', './plugin', 'underscore'], function(BaseView, plugin, _) {
    'use strict';
    return BaseView.extend({
        initialize : initialize,
        start : start
    });

    function initialize (options) {
        options.plugins = options.plugins || [];
        options.viewOptions = _.uniq((options.viewOptions || []).concat(['rivetConfig','rivetFormatters']));
        options.rivetConfig = 'auto';
        options.plugins.push(plugin);
        BaseView.prototype.initialize.call(this, options);
    }

    function start () {
        var $promise = BaseView.prototype.start.apply(this, arguments),
            self = this;
        $promise.progress(function (event) {
            switch (event) {
            case BaseView.afterRenderDone:
                if (self.rivetConfig) {
                    self.rivetView();
                }
                break;
            }
        });

        return $promise;
    }
});
