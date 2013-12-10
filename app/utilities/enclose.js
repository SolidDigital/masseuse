/*global define:false */
define(function () {
    'use strict';

    Closure.prototype.bindContext = bindContext;
    Closure.prototype.prependArgs = prependArgs;
    return Closure;

    function Closure (method) {
        if (!(this instanceof Closure)) {
            return new Closure(method);
        }

        this.method = method;
        this.context = undefined;
        this.args = [];

        _createClosure.call(this);
    }

    function bindContext(context) {
        this.context = context;
        return this;
    }

    function prependArgs() {
        this.args = _concatArguments.apply(this, arguments);
        return this;
    }

    /**
     * 
     * @private
     */

    function _createClosure () {
        var self = this;
        this.closure = function () {
            var args = _concatArguments.apply(self, arguments),
                context = self.context || this;

            self.method.apply(context, args);
        };
    }

    function _concatArguments () {
        return this.args.concat(Array.prototype.slice.apply(arguments));
    }
});
