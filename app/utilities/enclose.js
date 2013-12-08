/*global define:false */
define(function () {
    'use strict';

    return function(method) {
        return {
            context : function(context) {
                var args = arguments;
                return {
                    closure : function() {
                        method.apply(context, args);
                    }
                }
            },
            with : function() {
                var args = arguments;
                return {
                    closure : function() {
                        method.apply(this, args);
                    },
                    context : function(context) {
                        return {
                            closure : function() {
                                method.apply(context, args);
                            }
                        }
                    }
                }
            }
        }
    }
});
