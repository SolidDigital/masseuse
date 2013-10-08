define(['backbone', 'underscore', 'channels', 'mixin', 'rivetView'], function (Backbone, _, channels, mixin, rivetView) {

    var BaseView = Backbone.View.extend({
        options : {
            name : 'BaseView',
            bindings: [
                // Example: [stringObjectToListenTo, stringEventName, stringCallbackFunction]
                //          ['model', 'change:something', 'callbackFunction']
                // Bindings have to be all strings, since config does not have access to the view's context
                // if strings are provided it is assumed that the context is the view
            ]
        },
        defaultBindings: [],
        initialize : initialize,
        start : start,
        render : render,
        dataToJSON : dataToJSON,
        bindEventListeners: bindEventListeners
        // Dynamically created, so the cache is not shared on the prototype:
        // elementCache: elementCache
    });

    function initialize () {
        var ModelType = this.options.ModelType || Backbone.Model;
        this.elementCache = _.memoize(elementCache);
        if (this.options.templateHtml) {
            this.template = _.template(this.options.templateHtml);
        }
        this.model = new ModelType(this.options.modelData);
        if (this.options.bindings) {
            this.bindEventListeners(this.options.bindings);
        }
        if(this.options.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : this.options.rivetConfig.scope,
                rivetPrefix : this.options.rivetConfig.prefix
            })
        }
    }

    function start () {
        var $deferred = new $.Deferred();


        $
            .when(_runLifeCycleMethod.call(this, this.beforeRender, 'BeforeRender'))
            .then(
                _lifeCycleMethodReference.call(this, this.render, 'Render'),
                _rejectStart.call(this, $deferred))
            .then(
                _lifeCycleMethodReference.call(this, this.afterRender, 'AfterRender'),
                _rejectStart.call(this, $deferred))
            .then(
                _resolveStart.call(this, $deferred),
                _rejectStart.call(this, $deferred));

        return $deferred.promise();
    }

    function render () {
        if (this.$el && this.template) {
            this.$el.html(this.template(this.dataToJSON()));
        }
    }

    function elementCache(selector) {
        return this.$el.find(selector);
    }

    function dataToJSON () {
        return this.model ? this.model.toJSON() : {};
    }

    /**
     * bindEventListeners
     * Bind all event listerns specified in 'defaultListeners' and 'options.listeners' using 'listenTo'
     *
     * @param (Array[Array]) listenerArray - A collection of arrays of arguments that will be used with 'Backbone.Events.listenTo'
     *
     * @example:
     *      bindEventListeners([['myModel', 'change:something', 'myCallbackFunction']]);
     *
     * @remarks
     * Passing in an array with a string as the first parameter will attempt to bind to this[firstArgument] so that
     * it is possible to listen to view properties that have not yet been instantiated (i.e. viewModels)
     */
    function bindEventListeners (listenerArray) {
        var self = this,
            listenerArgs;

        this.stopListening();

        listenerArgs = _.map(listenerArray.concat(this.defaultBindings), function (argsArray) {

            // Since the view config object doesn't have access to the view's context, we must provide it
            _.each([argsArray[0], argsArray[1] ,argsArray[2]], function(arg, index) {
                if (_.isString(arg) && index != 1) {
                    argsArray[index] = _getProperty(self, arg);
                } else if (index == 1) {
                    argsArray[index] = arg;
                }
            });

            return argsArray;
        });

        // TODO: test that duplicate itmems will pick the bindings from options, throwing out defaults
        listenerArray = _.uniq(listenerArgs, function (a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        });

        _.each(listenerArray, function (listenerArgs) {
            self.listenTo.apply(self, listenerArgs);
        });
    }

    // Share channels among all Views
    BaseView.prototype.channels = BaseView.prototype.channels || channels;

    // --------------------------
    // Private Methods

    /**
     * Life cycle methods have an event triggered before the run.
     * If a life cycle method has one or more arguments, then the first argument passed in is its deferred.
     * The life cycle method will automatically return this deferred, otherwise it will pass through whatever
     * the method itself returns.
     *
     * @param lifeCycleMethod
     * @param lifeCycleMethodName
     * @returns {*}
     * @private
     */
    function _runLifeCycleMethod (lifeCycleMethod, lifeCycleMethodName) {
        if (!lifeCycleMethod) {
            return undefined;
        }

        return mixin({}, lifeCycleMethod)({
            async : lifeCycleMethod.length,
            preEvent : {
                name : this.options.name + ':on' + lifeCycleMethodName,
                channel : this.channels.views
            }
        }).call(this);
    }

    /**
     * A convenience wrapper for creating life cycle method references.
     * @param lifeCycleMethod
     * @param lifeCycleMethodName
     * @returns {*}
     * @private
     */
    function _lifeCycleMethodReference (lifeCycleMethod, lifeCycleMethodName) {
        return function () {
            return _runLifeCycleMethod.call(this, lifeCycleMethod, lifeCycleMethodName);
        }.bind(this);
    }

    function _resolveStart ($deferred) {
        return function () {
            $deferred.resolve();
        }.bind(this);
    }

    function _rejectStart ($deferred) {
        return function () {
            $deferred.reject();
        }.bind(this);
    }

    function _getProperty(obj, parts, create) {
        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

        var part;
        while (typeof obj === 'object' && obj && parts.length) {
            part = parts.shift();
            if (!(part in obj) && create) {
                obj[part] = {};
            }
            obj = obj[part];
        }

        return obj;
    };

    return BaseView;
});
