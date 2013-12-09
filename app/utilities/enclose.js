/*global define:false */
define(function () {
    'use strict';

    return function(method) {
        return {
            bindContext : function(context) {
                return {
                    closure : function() {
                        method.apply(context, arguments);
                    },
                    withArgs : function() {
                        var withArguments = arguments;
                        return {
                            closure : function() {
                                method.apply(this, withArguments);
                            }
                        }
                    }
                }
            },
            withArgs : function() {
                var withArguments = arguments;
                return {
                    closure : function() {
                        method.apply(this, withArguments);
                    },
                    bindContext : function(context) {
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
