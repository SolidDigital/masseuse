define(['underscore', 'jquery', 'mixin'], function(_, $, mixin) {

    /**
     * A finite state machine that works with deferreds.
     *
     * A state machine is created using two passed in functions. The first function returns the object that will be
     * extended into a state machine. The second functions return the object that is the state machine options. The second
     * function will have its context bound to the first. this.options are the state machine options.
     *
     * Each state is defined by a function that returns its description. All functions on the options
     * object will have the context of the state machine.
     *
     * Since the state machine factory creates a finite state machine from a passed in
     * object, any object can be used. This includes things like Backbone Views.
     *

     */
    return function(obj, options) {
        var machine,
            methods,
            methodsArray = [];
        machine = obj();
        machine.options = {};

        _.forEach(_.keys(options), function(state) {
            machine.options[state] = options[state]();
            console.log(state);
        });

//        methods = _.pluck(options, 'allowedMethods');
//        _.map(methods, function(oneMethodArray) {
//            methodsArray.concat(oneMethodArray);
//        });
        return machine;
    }
})