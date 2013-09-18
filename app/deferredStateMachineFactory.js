define(['underscore', 'jquery', 'mixin'], function(_, $, mixin) {

    /**
     * A finite state machine that works with deferreds.
     *
     * A stateOptions object is passed in. The object defines the states and the allowed
     * methods on the states. The object also defines the allowed state transitions.
     *
     * Since the state machine factory creates a finite state machine from a passed in
     * object, any object can be used. This includes things like Backbone Views.
     *
     * Definitions are created using strings, so that order of definition is not a constraint:
     *
     * var obj = {
     *          fun1: function() { ...
     *          fun2: function() { ...
     *      },
     *      stateOptions = {
     *          state1: {
     *              allowedMethods: [
     *                  obj.fun1
     *              ],
     *              allowedTransitions: [
     *                  stateOptions.state2
     *              ]
     *          },
     *          state2: {
     *              ...
     *      }
     *
     */
    return function(obj, stateOptions) {
        var config = {},
            methods,
            methodsArray = [];

        methods = _.pluck(stateOptions, 'allowedMethods');
        _.map(methods, function(oneMethodArray) {
            methodsArray.concat(oneMethodArray);
        });
        console.log(methodsArray);
        return {};
    }
})