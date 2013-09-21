define(['backbone', 'ComputedProperty', 'underscore'], function (Backbone, ComputedProperty, _) {
    return Backbone.Model.extend({
        unsettableProperties: [],

        set: function(key, val, options) {
            var self = this,
                attrs = {},
                stack = [],
                callSelf = false;

            this.computedCallbacks = this.computedCallbacks || {};
            if (key == null) {
                return this;
            } else if (typeof key == 'object') {
                attrs = key;
                options = val;

                _.each(key, function (attrValue, attrKey) {
                    if (attrValue instanceof ComputedProperty) {
                        self.bindComputed(attrs, attrKey, attrValue);
                        callSelf = true;
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

            if (!callSelf) {
                Backbone.Model.prototype.set.apply(this, [attrs, options]);
            }
            _.forEach(stack, function(callbackArray) {
                _.forEach(callbackArray, function(callback) {
                    callback.call(self);
                });
            });
            if (callSelf) {
                this.set.apply(this, [attrs, options]);
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
                callback.call(self);
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

