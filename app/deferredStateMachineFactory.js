define(['underscore', 'jquery'], function(_, $) {

    /**
     * A finite state machine that works with deferreds.
     * FSMs are created using the factory method that this module returns.
     *
     * Since the state machine factory creates a finite state machine from a passed in
     * object, any object can be used. This includes things like Backbone Views.
     *

     */
    return function(obj, states) {

        var Factory = this,
            methods = {
                getState: getState,
                getStates: getStates,
                transition: deferIt(transition),
                transitionAllowed: transitionAllowed
            },

            // Private variables
            _currentState,
            _stateNames = _.keys(states),
            _allMethodNames = _.keys(obj)

        // Constants
        Factory.TRANSITION_NOT_ALLOWED = 'transition not allowed';
        Factory.METHOD_NOT_ALLOWED = 'method not allowed';


        _.forEach(_allMethodNames, function(methodName) {
            var method = obj[methodName];
            if (Function !== method.constructor) {
                return;
            }

            obj[methodName] = deferIt(function(deferred) {
                var allowedMethods,
                    args = Array.prototype.slice.call(arguments);

                if (!_currentState) {
                    deferred.reject(Factory.METHOD_NOT_ALLOWED);
                    return;
                }

                args.shift();

                allowedMethods = states[_currentState].allowedMethods;

                if (allowedMethods && _.contains(allowedMethods, methodName)) {
                    deferred.resolve(method.apply(obj, args));
                } else {
                    deferred.reject(Factory.METHOD_NOT_ALLOWED);
                }
            }.bind(obj));
        });
        _.extend(obj, methods);
        return obj;

        function getState() {
            return _currentState;
        }

        function getStates() {
            return _stateNames;
        }

        function transition(deferred, newState) {
            var oldState;

            if (transitionAllowed(newState)) {
                oldState = _currentState;
                _currentState = newState;
                deferred.resolve({
                    oldState: oldState,
                    newState: newState
                });
            } else {
                deferred.reject(Factory.TRANSITION_NOT_ALLOWED);
            }
        }

        function transitionAllowed(newState) {
            var allowed = true,
                allowedTransitions;

            if (!_currentState) {
                allowed = _.contains(_stateNames, newState);
            } else {
                allowedTransitions = states[_currentState].allowedTransitions;
                allowed = allowedTransitions || _.contains(allowedTransitions, newState);
            }
            return allowed;
        }

        // A helper method that creates a new deferred, returns its promise and calls the method with the deferred
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