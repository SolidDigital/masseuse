define(['../../views/baseView', './plugin'], function(BaseView, plugin) {
    'use strict';
    return BaseView.extend({
        initialize : initialize,
        start : start
    });

    function initialize (options) {
        options.plugins = [];
        options.viewOptions = ['rivetConfig'];
        options.rivetConfig = 'auto';
        options.plugins.push(plugin);
        this.options = options;
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
