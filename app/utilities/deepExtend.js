/*jshint maxdepth:5, eqnull:true*/
define(['jquery'], function(jQuery) {
    'use strict';

    return deepExtend;

    // A version of $.extend that is automatically deep and handles keys with values of undefined
    function deepExtend() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0],
            i = 0,
            length = arguments.length;

        for ( ; i < length; ++i) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];

                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[ name ] = deepExtend(clone, copy);

                    } else {
                        target[ name ] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

});