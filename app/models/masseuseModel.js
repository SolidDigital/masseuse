define(['backbone', 'jquery', './computedProperty', './proxyProperty', './observerProperty', '../utilities/accessors',
    'underscore'],
    function (Backbone, $, ComputedProperty, ProxyProperty, ObserverProperty, accessors, _) {
        'use strict';

        var maxRecursionDepth = 10;
        /**
         * A Backbone Model with Proxy and Computed Properties.
         * Proxy and Computed properties are tirggered directly and not via events for performance reasons.
         *
         * ### Infinite Nesting
         *
         * Masseuse Models support infinite nesting. The properties of a model can be get() or set() infinitely deep.
         *
         * ```javascript
         * // 'change:object' event triggered
         * model.set('object.nestedObject.tripleNestedObject', 'Holy Diver');
         *
         * model.get('person.address.state.population.something.someOtherThing');
         * ```
         *
         * When setting a nested field, the model events are triggered for the appropriate model attribute.
         *
         * @constructor
         * @namespace masseuse/MasseuseModel
         * @extends Backbone.Model
         */
        return Backbone.Model.extend({
            toggleAttribute : toggleAttribute,
            get : get,
            set : set,
            unset : unset,
            bindComputed : bindComputed,
            bindProxy : bindProxy,
            bindObserver : bindObserver,
            getListenableValues : getListenableValues
        });

        /**
         * @function
         * @param attribute
         * @memberof masseuse/MasseuseModel#
         */
        function toggleAttribute(attribute) {
            this.set(attribute, !this.get(attribute));
        }

        /**
         * @function
         * @memberof masseuse/MasseuseModel#
         * @instance
         * @param key
         * @returns {*}
         */
        function get(key) {
            var propertyOn,
                wholeObj,
                result;

            if(_.isString(key) && key.indexOf('.') > 0) {
                propertyOn = key.slice(key.indexOf('.') + 1);
                key = key.split('.')[0];
                wholeObj = Backbone.Model.prototype.get.call(this, key);
                result = accessors.getProperty(wholeObj, propertyOn);
            } else {
                result = Backbone.Model.prototype.get.apply(this, arguments);
            }

            return result;
        }


        function listenToNestedModels(obj, parentModel, depth) {
            if (depth > maxRecursionDepth) {
                return;
            }
            if (typeof obj == 'object') {
                _.each(obj, function(value) {
                    if (value instanceof Backbone.Model) {
                        parentModel.listenTo(value, 'change', parentModel.trigger.bind(parentModel, 'change'));
                    } else if (typeof value == 'object') {
                        listenToNestedModels(value, parentModel, ++depth);
                    }
                });
            }
        }

        /**
         * @function
         * @memberof masseuse/MasseuseModel#
         * @instance
         * @param key
         * @param val
         * @param options
         * @returns {set}
         */
        function set(key, val, options) {
            var self = this,
                attrs = {},
                stack = [],
                delayInitial = [],
                callSelf = false,
                propertyOn,
                wholeObj;

            this.computedCallbacks = this.computedCallbacks || {};
            if (key === null) {
                return this;
            } else if (typeof key == 'object') {
                attrs = key;
                options = val;

                _.each(key, function (attrValue, attrKey) {
                    if (attrValue instanceof ComputedProperty) {
                        if (!attrValue.skipInitialComputation) {
                            self.bindComputed(attrKey, attrValue);
                            callSelf = true;
                        } else {
                            delayInitial.push(function () {
                                self.bindComputed(attrKey, attrValue);
                            });
                        }
                        delete attrs[attrKey];
                    } else if (attrValue instanceof ProxyProperty) {
                        self.bindProxy(attrKey, attrValue);
                        delete attrs[attrKey];
                    } else if (attrValue instanceof ObserverProperty) {
                        self.bindObserver(attrKey, attrValue);
                        delete attrs[attrKey];
                    } else if (attrValue instanceof Backbone.Model) {
                        self.listenTo(attrValue, 'change', self.trigger.bind(self, 'change'));
                    } else {
                        listenToNestedModels(attrValue, self, 0);
                        if (self.computedCallbacks[attrKey]) {
                            stack.push(self.computedCallbacks[attrKey]);
                        }
                    }
                });
            } else {
                if (val instanceof Backbone.Model) {
                    self.listenTo(val, 'change', self.trigger.bind(self, 'change'));
                }
                if (_.isString(key) && key.indexOf('.') > 0) {
                    propertyOn = key.slice(key.indexOf('.') + 1);
                    key = key.split('.')[0];

                    wholeObj = this.get(key) || {};

                    // This is a hack to have the change event fire exactly once without having to clone wholeObj
                    this.set(key, {}, {silent:true});

                    if (options && options.unset) {
                        accessors.unsetProperty(wholeObj, propertyOn);
                        options.unset = false;
                    } else {
                        accessors.setProperty(wholeObj, propertyOn, val);
                    }

                    val = wholeObj;
                }
                attrs[key] = val;
                if (val instanceof ComputedProperty) {
                    this.bindComputed(key, val);
                    return;
                } else if (val instanceof ProxyProperty) {
                    this.bindProxy(key, val);
                    return;
                } else if (val instanceof ObserverProperty) {
                    this.bindObserver(key, val);
                    return;
                } else {
                    _pushToComputedCallbacks.call(this, key, stack);
                }
            }

            if (callSelf) {
                this.set.apply(this, [attrs, options]);
            } else {
                Backbone.Model.prototype.set.apply(this, [attrs, options]);
                _.forEach(stack, function (callbackArray) {
                    _.forEach(callbackArray, function (callback) {
                        callback.call(self);
                    });
                });
            }
            if (delayInitial) {
                _.forEach(delayInitial, function (cb) {
                    cb();
                });
            }
        }

        function unset(attr, options) {
            return this.set(attr, void 0, _.extend({}, options, {unset: true}));
        }

        /**
         * Attach a ComputedProperty to a model and setup listeners for it.
         * @instance
         * @memberof masseuse/MasseuseModel#
         * @param key
         * @param computed
         */
        function bindComputed(key, computed) {
            var self = this,
                callback;

            callback = function () {
                this.set(key, computed.callback.apply(this, this.getListenableValues(computed.listenables)));
            };

            _.forEach(computed.listenables, function (listenTo) {
                self.computedCallbacks[listenTo] = self.computedCallbacks[listenTo] || [];
                self.computedCallbacks[listenTo].push(callback);
                if (!computed.skipInitialComputation) {
                    callback.call(self);
                }
            });
        }

        /**
         * @instance
         * @memberof masseuse/MasseuseModel#
         * @param key
         * @param proxy
         */
        function bindProxy(key, proxy) {
            var self = this,
                proxyModel = proxy.model;

            this.bindObserver(key, proxy, proxyModel);

            this.on('change:' + key, function () {
                proxyModel.set(proxy.propertyNameOnModel, self.get(key));
            });
        }

        /**
         * @instance
         * @memberof masseuse/MasseuseModel#
         * @param key
         * @param proxy
         */
        function bindObserver(key, proxy, proxyModel) {
            var self = this,
                modelAttribute = proxy.propertyNameOnModel;

            proxyModel = proxyModel || proxy.model;

            this.set(key, proxyModel.get(modelAttribute));

            if(_.isString(modelAttribute) && modelAttribute.indexOf('.') > 0) {
                modelAttribute = modelAttribute.split('.')[0];
            }

            proxyModel.on('change:' + modelAttribute, function () {
                self.set(key, proxyModel.get(proxy.propertyNameOnModel));
            });
        }

        /**
         * @instance
         * @memberof masseuse/MasseuseModel#
         * @param listenables
         * @returns {Array}
         */
        function getListenableValues(listenables) {
            var args = [],
                self = this;

            _.each(listenables, function (listenablePropertyKey) {
                args.push(self.get(listenablePropertyKey));
            });

            return args;
        }

        /**
         * @memberof masseuse/MasseuseModel#
         * @instance
         * @private
         * @param key
         * @param stack
         * @private
         */
        function _pushToComputedCallbacks (key, stack) {
            if (this.computedCallbacks[key]) {
                stack.push(this.computedCallbacks[key]);
            }
        }
    });

