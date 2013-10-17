/*global define*/
define([
    'backbone',
    'underscore'
],
    function (Backbone, _) {

        /**
         * @class MasseuseRouter
         * @extends Backbone.Router
         */
        return Backbone.Router.extend({
            initialize : initialize,
            _bindRoutes: noop
        });

        function noop() {}

        function initialize() {
            var self = this;

            if (this.beforeRouting) {
                _(this.routes).chain()
                    .omit(this.excludeFromBeforeRouting)
                    .each(function (methodName) {
                        var oldMethod = self[methodName];

                        self[methodName] = function () {
                            var args = arguments;

                            this.beforeRouting()
                                .done(function () {
                                    oldMethod.apply(self, args);
                                })
                                .fail(function () {
                                    self.onRouteFail && self.onRouteFail.apply(self, args);
                                });
                        };
                    });
            }
            Backbone.Router.prototype._bindRoutes.call(this);
        }
    });