/*global define:false*/
define([
    'backbone', 'underscore', '../utilities/channels', '../utilities/mixin', '../views/rivetView',
    '../views/viewContext', '../utilities/deferredHelper'
], function (Backbone, _, channels, mixin, rivetView, ViewContext, DeferredHelper) {
    'use strict';

    var BaseView = Backbone.View.extend({
        options : {
            name : 'BaseView',
            appendView : true,
            ModelType : undefined,
            bindings : [
                // Example: [stringObjectToListenTo, stringEventName, stringCallbackFunction]
                //          ['model', 'change:something', 'callbackFunction']
                // Bindings have to be all strings, since config does not have access to the view's context
                // if strings are provided it is assumed that the context is the view
            ],
            templateHtml : undefined,
            modelData : undefined,
            rivetConfig : undefined
        },
        defaultBindings : [],
        initialize : initialize,
        start : start,
        render : render,
        dataToJSON : dataToJSON,
        bindEventListeners : bindEventListeners,
        remove : remove,
        children : null,
        addChild : addChild,
        removeChild : removeChild,
        refreshChildren : refreshChildren

        // Dynamically created, so the cache is not shared on the prototype:
        // elementCache: elementCache
    });

    BaseView.beforeRenderDone = 'beforeRenderDone';
    BaseView.renderDone = 'renderDone';
    BaseView.afterRenderDone = 'afterRenderDone';

    // Share channels among all Views
    BaseView.prototype.channels = BaseView.prototype.channels || channels;

    return BaseView;

    function initialize (options) {
        this.options = _.extend({}, this.options, options);
        this.elementCache = _.memoize(elementCache);

        _setTemplate.call(this);
        _setModel.call(this, options);
        _setBoundEventListeners.call(this);
        _setViewRiveting.call(this);

        this.children = [];
    }

    /**
     * Wrapper method for lifecycle methods.
     *
     * In order, this method:
     * - Calls this.beforeRender()
     * - Starts any child views
     * - Notifies that beforeRender is done
     * - If the view has a parent, waits for its parent to render
     * - Calls this.render()
     * - Notifies that render is done
     * - Calls this.afterRender()
     * - Notifies that afterRender is done
     * - Resolves the returned promise
     *
     * @param {jQuery.promise} $parentRenderPromise - If passed in, the start method was called from a parent view
     * start() method.
     * @returns {jQuery.promise} A promise that is resolved when when the start method has completed
     */
    function start ($parentRenderPromise) {
        var self = this,
            $deferred = new $.Deferred(),
            deferredHelper = new DeferredHelper($deferred),
            $beforeRenderDeferred = _runLifeCycleMethod.call(this, this.beforeRender, 'BeforeRender');

        // ParentView calls .start() on all children
        // ParentView doesn't render until all children have notified that they are done
        // After rendering, the ParentView notifies all children and they continue their lifecycle
        _.defer(function () {
            $
                .when(
                    $beforeRenderDeferred
                )
                .always(deferredHelper.cacheNotification(BaseView.beforeRenderDone).notifyFromCache)
                .then(function () {
                    if ($parentRenderPromise) {
                        return $parentRenderPromise;
                    }
                    return undefined;
                })
                .then(
                function () {
                    var $renderDeferred = _runLifeCycleMethod.call(self, self.render, 'Render');
                    $
                        .when(
                            $renderDeferred
                        )
                        .always(deferredHelper.cacheNotification(BaseView.renderDone).notifyFromCache)
                        .then(
                        function () {
                            var $afterRenderDeferred = _runLifeCycleMethod.call(self, self.afterRender, 'AfterRender');
                            $
                                .when(
                                    $afterRenderDeferred,
                                    startChildren.call(self, $deferred)
                                )
                                .always(deferredHelper.cacheNotification(BaseView.afterRenderDone).notifyFromCache)
                                .then(
                                    _resolveStart.call(self, $deferred),
                                    _rejectStart.call(self, $deferred)
                                );
                        },
                        _rejectStart.call(self, $deferred)
                    );
                },
                _rejectStart.call(self, $deferred));
        });

        return $deferred.promise();
    }

    function startChildren ($parentDeferred) {
        _(this.children).each(function (child) {
            var $afterRenderDeferred = new $.Deferred();
            $parentDeferred.progress(function (step) {
                if (step === BaseView.renderDone) {
                    $afterRenderDeferred.resolve();
                }
            });

            child.start($afterRenderDeferred.promise());
        });
    }

    function render () {
        if (undefined === this.el && undefined !== this.options.el) {
            this.setElement($(this.options.el));
        }

        if (this.$el && this.template) {
            if (this.options.appendView) {
                this.$el.append(this.template(this.dataToJSON()));
                this.setElement(this.$el.children().last());
            } else {
                this.$el.html(this.template(this.dataToJSON()));
            }
        }
    }

    // This function is memoized in initialize
    function elementCache (selector) {
        return this.$el.find(selector);
    }

    function dataToJSON () {
        return this.model ? this.model.toJSON() : {};
    }

    /**
     * bindEventListeners
     * Bind all event listeners specified in 'defaultListeners' and 'options.listeners' using 'listenTo'
     *
     * @param (Array[Array]) listenerArray - A collection of arrays of arguments that will be used with
     * 'Backbone.Events.listenTo'
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
            _.each([argsArray[0], argsArray[1] , argsArray[2]], function (arg, index) {
                if (_.isString(arg) && index != 1) {
                    argsArray[index] = _getProperty(self, arg);
                } else if (index == 1) {
                    argsArray[index] = arg;
                }
            });

            return argsArray;
        });

        // TODO: test that duplicate items will pick the bindings from options, throwing out defaults
        listenerArray = _.uniq(listenerArgs, function (a, b) {
            return _.identity(a);
        });

        _.each(listenerArray, function (listenerArgs) {
            self.listenTo.apply(self, listenerArgs);
        });
    }

    function remove () {
        _(this.children).each(function (child) {
            child.remove();
        });
        Backbone.View.prototype.remove.apply(this, arguments);
    }

    function addChild (childView) {
        if (!_(this.children).contains(childView)) {
            this.children.push(childView);
            childView.parent = this;
        }
    }

    function removeChild (childView) {
        this.children = _(this.children).without(childView);
    }

    function refreshChildren () {
        _(this.children).each(function (child) {
            child.remove();
            child.start();
        });
    }

    /**
     * Private Methods - must be supplied with context
     * @private
     */

    function _setTemplate () {
        if (this.options.templateHtml) {
            this.template = _.template(this.options.templateHtml);
        }
    }

    function _setModel (options) {
        var self = this,
            ModelType = this.options.ModelType || Backbone.Model,
            modelData;
        if (!this.model) {
            modelData = this.options.modelData;
            _.each(modelData, function (datum, key) {
                if (datum instanceof ViewContext) {
                    modelData[key] = datum.getBoundFunction(self);
                }
            });
            this.model = new ModelType(this.options.modelData);
        } else {
            this.model = options.model;
        }
    }

    function _setBoundEventListeners () {
        if (this.options.bindings) {
            this.bindEventListeners(this.options.bindings);
        }
    }

    function _setViewRiveting () {
        if ('auto' === this.options.rivetConfig) {
            this.model.set('viewId', this.cid);
            this.domEl = this.cid;
            this.rivetView = rivetView({
                rivetScope : '#' + this.cid,
                rivetPrefix : 'rv'
            })
        } else if (this.options.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : this.options.rivetConfig.scope,
                rivetPrefix : this.options.rivetConfig.prefix,
                instaUpdateRivets : (this.options.rivetConfig.instaUpdateRivets ? true : false)
            })
        }
    }

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
                methodName : lifeCycleMethodName,
                name : this.options.name + ':pre' + lifeCycleMethodName,
                channel : this.channels.views
            },
            postEvent : {
                methodName : lifeCycleMethodName,
                name : this.options.name + ':post' + lifeCycleMethodName,
                channel : this.channels.views
            }
        }).call(this);
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

    function _getProperty (obj, parts, create) {
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
    }
});
