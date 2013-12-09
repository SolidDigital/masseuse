/*global define:false */
define(function () {
    'use strict';

    var publicApi = [
        'withArgs',
        'bindContext'
    ];

    function Closure (method) {
        var self = this;

        if (!(this instanceof Closure)) {
            return new Closure(method);
        }

        this.method = method;
        this.context = undefined;
        this.args = undefined;

        this.closure = function () {
            var args = (self.args || [])
                    .concat(Array.prototype.slice.apply(arguments)),
                context = self.context || this;

            self.method.apply(context, args);
        };

        for(var i = 0; i < publicApi.length; ++i) {
            (function (methodName) {
                self.closure[methodName] = function () {
                    return self[methodName].apply(self, arguments);
                };
            }(publicApi[i]));
        }

        this.closure.closure = this.closure;
    }

    Closure.prototype.withArgs = function () {
        this.args = Array.prototype.slice.apply(arguments);

        return this.closure;
    };

    Closure.prototype.bindContext = function (context) {
        this.context = context;

        return this.closure;
    };

    return Closure;
});
