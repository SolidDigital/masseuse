/*global define:false */
define(function () {
    'use strict';

    return function(method) {
        return {
            context : function(context) {
                return {
                    closure : function() {
                        method.apply(context, arguments);
                    },
                    using : function() {
                        var withArguments = arguments;
                        return {
                            closure : function() {
                                method.apply(this, withArguments);
                            }
                        }
                    }
                }
            },
            using : function() {
                var withArguments = arguments;
                return {
                    closure : function() {
                        method.apply(this, withArguments);
                    },
                    context : function(context) {
                        return {
                            closure : function() {
                                method.apply(context, withArguments);
                            }
                        }
                    }
                }
            }
        }
    };
});
