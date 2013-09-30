define(['backbone', 'computedProperty', 'underscore'], function (Backbone, ComputedProperty, _) {
    return Backbone.Model.extend({
        unsettableProperties: [],

        set: function(key, val, options) {
            var self = this,
                attrs = {},
                stack = [],
                delayInitial = [],
                callSelf = false;

            this.computedCallbacks = this.computedCallbacks || {};
            if (key == null) {
                return this;
            } else if (typeof key == 'object') {
                attrs = key;
                options = val;

                _.each(key, function (attrValue, attrKey) {
                    if (attrValue instanceof ComputedProperty) {
                        if (!attrValue.skipInitialComputation) {
                            self.bindComputed(attrs, attrKey, attrValue);
                            callSelf = true;
                        } else {
                            delayInitial.push(function() {
                                self.bindComputed(attrs, attrKey, attrValue);
                            })
                        }
                        delete attrs[attrKey];
                    } else {
                        if (self.computedCallbacks[attrKey]) {
                            stack.push(self.computedCallbacks[attrKey]);
                        }
                    }
                });
            } else {
                attrs[key] = val;
                if (val instanceof ComputedProperty) {
                    this.bindComputed(attrs, key, val)
                    return;
                } else {
                    if (this.computedCallbacks[key]) {
                        stack.push(this.computedCallbacks[key]);
                    }
                }
            }

            if (callSelf) {
                this.set.apply(this, [attrs, options]);
            } else {
                Backbone.Model.prototype.set.apply(this, [attrs, options]);
                _.forEach(stack, function(callbackArray) {
                    _.forEach(callbackArray, function(callback) {
                        callback.call(self);
                    });
                });
            }
            if (delayInitial) {
                _.forEach(delayInitial, function(cb) {
                    cb();
                });
            }
        },
        bindComputed: function (attributes, key, computed) {
            var self = this,
                callback;

            callback = function () {
                this.set(key, computed.callback.apply(this, this.getListenableValues(computed.listenables)));
            };

            _.forEach(computed.listenables, function(listenTo) {
                self.computedCallbacks[listenTo] = self.computedCallbacks[listenTo] || [];
                self.computedCallbacks[listenTo].push(callback);
                if (!computed.skipInitialComputation) {
                    callback.call(self);
                }
            });
        },
        getListenableValues: function (listenables) {
            var args = [],
                self = this;

            _.each(listenables, function (listenablePropertyKey) {
                args.push(self.get(listenablePropertyKey));
            });

            return args;
        }
    });
});

