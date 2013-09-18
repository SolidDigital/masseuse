define(['underscore', 'jquery'], function (_, $) {

    /**
     * mixin allows the reuse of a function
     *
     * a mixin is curried twice. in other words, first mixin is called with the mixinFunction and the default options.
     * this creates a "general" mixin function. this general function can then be called with the actual, specific
     * options for the situation. this will return the final function that can be attached to your object.
     *
     * in addition to the availability of options, mixins provide two other pieces of functionality that can be deployed
     * through options.
     *
     * 1) mixins can implement $.Deferred. to do this set options.async to true. if async is true, then the first argument
     * passed to the mixinFunction will be a deferred instance. this instance can be resolved or rejected as seen fit. its
     * promise will be returned by the final function attached to the object.
     *
     * 2) pre and post fire events can be triggered by including either or both preEvent or postEvent object. the object
     * should include the event name and the object to trigger the Backbone event on:
     *
     * ```
     * preEvent : {
     *  name: 'onBefore',
     *  channel: channel.views.login
     * }
     * ```
     *
     * If events are used, then there is a dependency on Backbone or something with the same Events interface.
     *
     * @param defaultOptions
     * @param mixinFunction
     * @returns {Function}
     */
    function mixin (defaultOptions, mixinFunction) {

        // Return a once curried function that can be customized for a particular use
        return function (options) {
            var config = {};

            // Create the final config object from the default options and actual options
            _.extend(config, defaultOptions, options);

            // Return the final function that can be attached to the object
            return function () {
                // Arguments is not an array, so we create an array out of it
                var args = Array.prototype.slice.call(arguments),
                    $deferred,
                    returned;

                args.unshift(config);

                if (config.async) {
                    $deferred = new $.Deferred();
                    args.unshift($deferred);
                }

                if (config.preEvent && config.preEvent.name && config.preEvent.channel) {
                    config.preEvent.channel.trigger(config.preEvent.name, $deferred);
                }
                returned = mixinFunction.apply(this, args);
                if (config.postEvent && config.postEvent.name && config.postEvent.channel) {
                    config.postEvent.channel.trigger(config.postEvent.name, $deferred);
                }

                return config.async ? $deferred.promise() : returned;
            }
        }
    }

    return mixin;
});
