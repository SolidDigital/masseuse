/*global define:false*/
define(['underscore'], function (_) {
    'use strict';

    var methods = {
        cacheNotification : cacheNotification
    };

    return DeferredHelper;

    /**
     * A helper that you can store a deferred in for future reference.
     * @param $deferred
     * @constructor
     */
    function DeferredHelper ($deferred) {
        var self = this;

        this.cache = {};

        _.each($deferred, function (value, method) {
            self[method] = $deferred[method].bind(self);
        });

        _.each(methods, function (value, method) {
            self[method] = methods[method].bind(self);
        });
    }

    /**
     * Can be used to cache notification for later use.
     * Mutiple notification can be cached on each $deferred
     *
     * Usage: helper.cacheNotification(value).notifyFromCache
     *
     * @param notify
     * @returns {{notifyFromCache: Function}}
     */
    function cacheNotification (notify) {
        var self = this;

        return {
            notifyFromCache : function () {
                self.notify(notify);
            }
        }
    }
});

