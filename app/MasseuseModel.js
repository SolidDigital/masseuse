define(['backbone', 'ComputedProperty', 'underscore'], function (Backbone, ComputedProperty, _) {
    return Backbone.Model.extend({
        unsettableProperties: [],
        set: function (key, val, options) {
            var self = this,
                attrs = {},
                computedCallbacks = [];

            if (key == null) {
                return this;
            } else if (typeof key == 'object') {
                attrs = key;
                options = val;

                _.each(key, function (attrValue, attrKey) {
                    computedCallbacks.push(self.bindComputed(attrs, attrKey, attrValue));
                });
            } else {
                attrs[key] = val;
                computedCallbacks.push(this.bindComputed(attrs, key, val));
            }

            Backbone.Model.prototype.set.apply(this, [attrs, options]);

            _.each(computedCallbacks, function (callback) {
                if (callback) {
                    callback();
                }
            });
        },
        bindComputed: function (attributes, key, computed) {
            var self = this,
                callback;

            if (computed instanceof ComputedProperty) {
                callback = function () {
                    this.set(key, computed.callback.apply(this, this.getListenableValues(computed.listenables)));
                };

                this.listenTo(this, "change:" + computed.listenables.join(" change:"), callback);

                delete attributes[key];

                return function () {
                    callback.apply(self);
                };
            }

            return false;
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

