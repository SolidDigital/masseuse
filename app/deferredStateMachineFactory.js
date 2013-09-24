define(['underscore', 'jquery', 'mixin'], function(_, $, mixin) {

    /**
     * A finite state machine that works with deferreds.
     *
     * Since the state machine factory creates a finite state machine from a passed in
     * object, any object can be used. This includes things like Backbone Views.
     *

     */
    return function(obj, options) {

        // options stored in argument and not on context
        var methods = {
            transition: deferIt(transition)
        };

        _.extend(obj, methods);
        return obj;

        function transition(deferred) {

        }

        function deferIt(method) {
            return function() {
                var args = Array.prototype.slice.call(arguments),
                    $deferred = $.Deferred();

                args.unshift($deferred);
                method.apply(this,args);
                return $deferred.promise();
            }
        }
    }
});