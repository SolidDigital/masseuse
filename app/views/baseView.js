/*global define:false*/
define([
    'backbone', 'underscore', '../utilities/channels', '../utilities/configureMethod', './rivetView',
    './viewContext', '../utilities/enclose', './lifeCycle', '../utilities/getProperty'
], function (Backbone, _, channels, configureMethod, rivetView, ViewContext, enclose, lifeCycle, getProperty) {
    'use strict';

    var BEFORE_RENDER_DONE = 'beforeRenderDone',
        RENDER_DONE = 'renderDone',
        AFTER_RENDER_DONE = 'afterRenderDone',
        BaseView = Backbone.View.extend({
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
        refreshChildren : refreshChildren,
        removeAllChildren : removeAllChildren

        // Dynamically created, so the cache is not shared on the prototype:
        // elementCache: elementCache
    });

    BaseView.beforeRenderDone = BEFORE_RENDER_DONE;
    BaseView.renderDone = RENDER_DONE;
    BaseView.afterRenderDone = AFTER_RENDER_DONE;

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
        var $deferred = new $.Deferred();

        // ParentView calls .start() on all children
        // ParentView doesn't render until all children have notified that they are done
        // After rendering, the ParentView notifies all children and they continue their lifecycle
        _.defer(enclose(lifeCycle.runAllMethods).appendArgs($deferred, $parentRenderPromise).bindContext(this).closure);

        return $deferred.promise();
    }

    function render () {
        _setEl.call(this);
        _appendOrInsertView.call(this);
    }

    function _setEl() {
        if (undefined === this.el && undefined !== this.options.el || this.parent && undefined !== this.options.el) {
            this.setElement($(this.options.el));
        }
    }

    function _appendOrInsertView() {
        if (this.$el && this.template) {
            if (this.options.appendView) {
                _appendView.call(this);
            } else {
                _insertView.call(this);
            }
        }
    }

    function _appendView(){
        this.$el.append(this.template(this.dataToJSON()));
        this.setElement(this.$el.children().last());
    }

    function _insertView(){
        this.$el.html(this.template(this.dataToJSON()));
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
     * @param listenerArray (Array[Array])  - A collection of arrays of arguments that will be used with
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
                    argsArray[index] = getProperty(self, arg);
                } else if (index == 1) {
                    argsArray[index] = arg;
                }
            });

            return argsArray;
        });

        // TODO: test that duplicate items will pick the bindings from options, throwing out defaults
        listenerArray = _.uniq(listenerArgs, function (a) {
            return _.identity(a);
        });

        _.each(listenerArray, function (listenerArgs) {
            self.listenTo.apply(self, listenerArgs);
        });
    }

    function remove () {
        this.removeAllChildren();

        if (this.parent) {
            this.parent.removeChild(this);
        }

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

    function removeAllChildren() {
        var self = this;
        _(this.children).each(function (child) {
            child.remove();
            self.removeChild(child);
        });
    }

    function refreshChildren () {
        _(this.children).each(function (child) {
            if (child.hasStarted) {
                child.remove();
            }
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
            }).methodWithActualOptions;
        } else if (this.options.rivetConfig) {
            this.rivetView = rivetView({
                rivetScope : this.options.rivetConfig.scope,
                rivetPrefix : this.options.rivetConfig.prefix,
                instaUpdateRivets : (this.options.rivetConfig.instaUpdateRivets ? true : false)
            }).methodWithActualOptions;
        }
    }
});
