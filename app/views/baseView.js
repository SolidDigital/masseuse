/*global define:false*/
define([
    'jquery', 'backbone', 'underscore', '../utilities/channels', './viewContext', './lifeCycle',
    '../utilities/accessors', '../utilities/createOptions', '../models/masseuseModel'
], function ($, Backbone, _, Channels, ViewContext, lifeCycle, accessors, createOptions, MasseuseModel) {
    'use strict';

    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events',
        'name', 'appendTo', 'wrapper'],
        BEFORE_RENDER_DONE = 'beforeRenderDone',
        AFTER_TEMPLATING_DONE = 'afterTemplatingDone',
        RENDER_DONE = 'renderDone',
        AFTER_RENDER_DONE = 'afterRenderDone',
        MODEL_DATA = 'modelData',
        /**
         * @class A View that adds lifecycle methods to Views that are optionally async using jQuery promises.
         * Adds support for adding child Views
         * @namespace masseuse/BaseView
         * @type {*|extend|extend|extend|void|Object}
         */
        BaseView = Backbone.View.extend({
            constructor : constructor,
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
            removeAllChildren : removeAllChildren,
            appendOrInsertView : appendOrInsertView

            // Dynamically created, so the cache is not shared on the prototype:
            // elementCache: elementCache
        });

    BaseView.beforeRenderDone = BEFORE_RENDER_DONE;
    BaseView.afterTemplatingDone = AFTER_TEMPLATING_DONE;
    BaseView.renderDone = RENDER_DONE;
    BaseView.afterRenderDone = AFTER_RENDER_DONE;

    // Share channels among all Views
    BaseView.prototype.channels = BaseView.prototype.channels ||  new Channels();

    return BaseView;

    /**
     * The constructor of BaseView overrides the default BB constructor, so that the options object can be created and
     * applied to `this.el` before `this.initialize` is called.
     * @method constructor
     * @memberof masseuse/BaseView#
     * @param options
     * @param useDefaultOptions
     */
    function constructor(options, useDefaultOptions) {
        var args = Array.prototype.slice.call(arguments, 0);
        this.cid = _.uniqueId('view');
        options || (options = {});
        options = createOptions(options, this.defaultOptions, useDefaultOptions);
        args.shift();
        args.unshift(options);
        _.extend(this, _.pick(options, viewOptions));
        this._ensureElement();
        this.initialize.apply(this, args);
        this.delegateEvents();
    }

    /**
     * @method initialize
     * @memberof masseuse/BaseView#
     * @param options
     */
    function initialize (options) {
        var self = this;

        this.elementCache = _.memoize(elementCache);

        if(options) {
            options = _.clone(options, true);
            if (options.viewOptions) {
                viewOptions = viewOptions.concat(options.viewOptions);
            }
            _.extend(this, _.pick(options, viewOptions));
        }

        _setTemplate.call(this, options);
        _setModel.call(this, options);
        _setBoundEventListeners.call(this, options);
        if (options && options.plugins && options.plugins.length) {
            _.each(options.plugins, function (plugin) {
                plugin.call(self, options);
            });

        }

        this.children = [];
    }

    /**
     * Wrapper method for lifecycle methods. Life cycle event are notifed both throw the progress returned by this
     * method's promise, and by events triggered on the view. So - for example - plugins can hook into life cycle
     * events.
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
     * @memberof masseuse/BaseView#
     * @param {jQuery.promise} $parentRenderPromise - If passed in, the start method was called from a parent view
     * start() method.
     * @returns {jQuery.promise} A promise that is resolved when when the start method has completed
     */
    function start ($parentRenderPromise) {
        var $deferred = new $.Deferred();

        // ParentView calls .start() on all children
        // ParentView doesn't render until all children have notified that they are done
        // After rendering, the ParentView notifies all children and they continue their lifecycle
        _.defer(lifeCycle.runAllMethods.bind(this, $deferred, $parentRenderPromise));

        return $deferred.promise();
    }

    /**
     * @memberof masseuse/BaseView#
     */
    function render () {
        this.appendOrInsertView(arguments[arguments.length - 1]);

        _(this.children).each(function(child) {
            if (child.hasStarted) {
                child.render();
            }
        });
    }

    /**
     * @memberof masseuse/BaseView#
     * @param $startDeferred
     */
    function appendOrInsertView ($startDeferred) {
        this.appendTo ? _appendTo.call(this, $startDeferred) : _insertView.call(this, $startDeferred);
    }

    /**
     * And element cache that uses sizzle selectors and the context of the view.
     * @param selector - the sizzle selector to look for and cache
     * @returns {*|Mixed}
     */
    function elementCache (selector) {
        return this.$el.find(selector);
    }

    /**
     * @memberof masseuse/BaseView#
     * @returns {Object|string|*}
     */
    function dataToJSON () {
        return this.model ? this.model.toJSON() : {};
    }

    /**
     * bindEventListeners
     * Bind all event listeners specified in 'defaultListeners' and 'options.listeners' using 'listenTo'
     *
     * @memberof masseuse/BaseView#
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
                    argsArray[index] = accessors.getProperty(self, arg);
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

    /**
     * Removes this view and all its children. Additionally, this view removes itself from its parent view.
     * @memberof masseuse/BaseView#
     */
    function remove () {
        this.removeAllChildren();

        if (this.parent && _.contains(this.parent.children, this)) {
            this.parent.removeChild(this);
        }

        Backbone.View.prototype.remove.apply(this, arguments);
    }

    /**
     * Add a child view to the array of this views child view references.
     * The child must be started later. This happens in start or manually.
     * @memberof masseuse/BaseView#
     * @method
     * @param childView
     */
    function addChild (childView) {
        if (!_(this.children).contains(childView)) {
            this.children.push(childView);
            childView.parent = this;
        }
    }

    /**
     * Remove one child from the parentView.
     * @memberof masseuse/BaseView#
     * @param childView
     */
    function removeChild (childView) {
        // TODO: increase efficiency here
        this.children = _(this.children).without(childView);
        childView.remove();
    }

    /**
     * Remove all children from the parentView.
     * @memberof masseuse/BaseView#
     */
    function removeAllChildren () {
        _(this.children).each(this.removeChild.bind(this));
    }

    /**
     * Remove all children and restart them.
     * @memberof masseuse/BaseView#
     * @returns $promise - will be resolved once all children are restarted
     */
    function refreshChildren () {
        var $deferred = new $.Deferred(),
            childPromiseArray = [];

        _(this.children).each(function (child) {
            if (child.hasStarted) {
                Backbone.View.prototype.remove.apply(child);
            }
            childPromiseArray.push(child.start());
        });

        $.when.apply($, childPromiseArray).then($deferred.resolve);

        return $deferred.promise();
    }

    /**
     * Private Methods - must be supplied with context
     * @private
     */

    function _appendTo ($startDeferred) {
        var template = this.template,
            $newEl,
            wrapper = this.wrapper !== false;

        template = template ? template(this.dataToJSON()) : '';

        $newEl = wrapper ? this.el : $(template);
        // More than 1 root level element and no wrapper leads to this.el being incorrect.
        if (!wrapper && 1 === $newEl.length) {
            this.setElement($newEl);
        } else {
            this.$el.html(template);
        }

        $startDeferred && $startDeferred.notify && $startDeferred.notify(AFTER_TEMPLATING_DONE);
        $(this.appendTo).append(this.el);
    }

    function _insertView ($startDeferred) {
        var template = this.template;
        this.$el.html(template ? template(this.dataToJSON()) : ' ');
        $startDeferred && $startDeferred.notify && $startDeferred.notify(AFTER_TEMPLATING_DONE);
    }

    function _setTemplate (options) {
        if (options && options.template) {
            this.template = _.template(options.template);
        }
    }

    function _setModel (options) {
        var self = this,
            ModelType = MasseuseModel,
            modelData;

        if (options && options.ModelType) {
            ModelType = options.ModelType;
        }
        if (!this.model) {
            modelData = _.result(options, MODEL_DATA);
            _.each(modelData, function (datum, key) {
                if (datum instanceof ViewContext) {
                    modelData[key] = datum.getBoundFunction(self);
                }
            });
            this.model = new ModelType(modelData);
        } else {
            this.model = options.model;
        }
    }

    function _setBoundEventListeners (options) {
        if (options && options.bindings) {
            this.bindEventListeners(options.bindings);
        }
    }
});
