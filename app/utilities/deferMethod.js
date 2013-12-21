define(['jquery'], function ($) {
    'use strict';
    return deferMethod;

    function deferMethod (method) {
        return {
            closure : function () {
                var $deferred = new $.Deferred(),
                    args = Array.prototype.slice.call(arguments);
                args.unshift($deferred);
                method.apply(this, args);
                return $deferred.promise();
            }
        };
    }
});