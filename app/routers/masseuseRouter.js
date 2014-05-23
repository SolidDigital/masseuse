/*global define:false*/
define([
    'backbone',
    'underscore'
],
    function (Backbone, _) {
        'use strict';

        /**
         * @class A router with an optionally overridable `.beforeRouting()`
         * @namespace masseuse/MasseuseRouter
         * @extends Backbone.Router
         */
        return Backbone.Router.extend({
            initialize : initialize,
            // Override bindRoutes and call it later from the prototype, since _bindRoutes gets called in the constructor
            // and we don't want it called until after beforeRouting methods are attached
            _bindRoutes : noop,
            onRouteFail : noop
        });

        function noop () {
        }

        function initialize () {
            var self = this;

            if (_.isFunction(this.beforeRouting)) {
                _(this.routes).chain()
                    .omit(this.excludeFromBeforeRouting)
                    .values()
                    .uniq()
                    .each(function (methodName) {
                        wrapRoute.call(self, methodName);
                    });
            }
            Backbone.Router.prototype._bindRoutes.call(this);
        }

        function wrapRoute (methodName) {
            var self = this,
                oldMethod = this[methodName];

            self[methodName] = function () {
                var args = arguments;

                this.beforeRouting()
                    .done(function () {
                        oldMethod.apply(self, args);
                    })
                    .fail(function () {
                        self.onRouteFail.apply(self, args);
                    });
            };
        }

    });
