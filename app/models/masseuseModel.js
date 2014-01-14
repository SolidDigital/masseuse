define(['backbone', './computedProperty', './proxyProperty', '../utilities/getProperty', 'underscore'],
    function (Backbone, ComputedProperty, ProxyProperty, getProperty, _) {
        'use strict';

        /**
         * A Backbone Model with Proxy and Computed Properties.
         * Proxy and Computed properties are tirggered directly and not via events for performance reasons.
         * @constructor
         * @alias module:MasseuseModel
         * @extends Backbone.Model
         */
        return Backbone.Model.extend({
            toggleAttribute : toggleAttribute,
            get : get,
            set : set,
            bindComputed : bindComputed,
            bindProxy : bindProxy,
            getListenableValues : getListenableValues
        });

        function toggleAttribute(attribute) {
            this.set(attribute, !this.get(attribute));
        }

        function get(key) {
            var propertyOn,
                wholeObj,
                result;

            if(key.indexOf('.') > 0 && _.isString(key)) {
                propertyOn = key.slice(key.indexOf('.') + 1);
                key = key.split('.')[0];
                wholeObj = Backbone.Model.prototype.get.call(this, key);
                result = getProperty.getProperty(wholeObj, propertyOn);
            } else {
                result = Backbone.Model.prototype.get.apply(this, arguments);
            }

            return result;
        }

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
                    } else {
                        if (self.computedCallbacks[attrKey]) {
                            stack.push(self.computedCallbacks[attrKey]);
                        }
                    }
                });
            } else {
                if (key.indexOf('.') > 0 && _.isString(key)) {
                    propertyOn = key.slice(key.indexOf('.') + 1);
                    key = key.split('.')[0];

                    wholeObj = this.get(key) || {};
                    getProperty.setProperty(wholeObj, propertyOn, val);
                    val = wholeObj;
                }
                attrs[key] = val;
                if (val instanceof ComputedProperty) {
                    this.bindComputed(key, val);
                    return;
                } else if (val instanceof ProxyProperty) {
                    this.bindProxy(key, val);
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

        function bindProxy(key, proxy) {
            var self = this,
                model = proxy.model,
                modelAttribute = proxy.propertyNameOnModel;

            this.set(key, model.get(modelAttribute));

            model.on('change:' + modelAttribute, function () {
                self.set(key, model.get(modelAttribute));
            });

            this.on('change:' + key, function () {
                model.set(modelAttribute, self.get(key));
            });

        }

        function getListenableValues(listenables) {
            var args = [],
                self = this;

            _.each(listenables, function (listenablePropertyKey) {
                args.push(self.get(listenablePropertyKey));
            });

            return args;
        }

        function _pushToComputedCallbacks (key, stack) {
            if (this.computedCallbacks[key]) {
                stack.push(this.computedCallbacks[key]);
            }
        }
    });

