/*global define:false*/
define(['./deepExtend'], function (deepExtend) {
    'use strict';

    /**
     * `createOptions` allows for the proper creation of options objects, so that the object references passed in to it
     * are not modified.
     *
     * The method returns a new object.
     *
     * The order of arguments is that of `_.extend`. Passing an empty object in as the first argument is not required.
     *
     * Example:
     *
     * ```javascript
     * new BaseView(createOptions(generalOptions, specificOptions));
     * ```
     *
     * The options are deep extended, so fields are combined if both objects.
     *
     * `undefined` can be used to clobber fields:
     *
     * ```javascript
     * // will return {a:undefined}
     * createOptions({a:1},{a:undefined});
     * ```
     *
     * @namespace masseuse/utilities/createOptions
     */
    return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        return deepExtend.apply(null, [{}].concat(args));
    };
});
