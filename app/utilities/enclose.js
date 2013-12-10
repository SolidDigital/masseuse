/*global define:false */
define(function () {
    'use strict';

    var publicApi = [
            ['prependArgs',prependArgs],
            ['bindContext',bindContext]
        ],
        apiLength = publicApi.length;

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
        _exposeClosure.call(this);
        _attachPublicApi.call(this);
    }

    function bindContext(context) {
        this.context = context;
        return this.closure;
    }

    function prependArgs() {
        this.args = _concatArguments.apply(this, arguments);
        return this.closure;
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

    function _exposeClosure () {
        var self = this;
        this.closure.closure = this.closure;
        this.closure.final = function () {
            self.closure();
        }
    }

    function _attachPublicApi () {
        var i,
            self = this;
        for (i = 0; i < apiLength; ++i) {
            (function (i) {
                self.closure[publicApi[i][0]] = function () {
                    return publicApi[i][1].apply(self, arguments);
                };
            }(i));
        }
    }
});
