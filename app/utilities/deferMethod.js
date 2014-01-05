define(['jquery'], function ($) {
    'use strict';
    return deferMethod;

    /**
     * A method can be passed in and a closure will be returned. When the closure is called the method will receive a
     * deferred that it can resolve or reject at leisure.
     * Calling the closure will return the promise for the deferred.
     * @modlue utilities/deferMethod
     * @param method
     * @returns {{closure: Function}}
     */
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