/*global define:false */
define(['jquery', 'underscore', '../utilities/enclose'],
    function ($, _, enclose) {
        'use strict';

        // TODO: create constants module
        var BEFORE_RENDER_DONE = 'beforeRenderDone',
            RENDER_DONE = 'renderDone',
            AFTER_RENDER_DONE = 'afterRenderDone';

        return {
            runAllMethods : runAllMethods
        };

        function runAllMethods ($deferred, $parentRenderPromise) {
            var notifyBeforeRenderDone = enclose($deferred.notify)
                    .appendArgs(BEFORE_RENDER_DONE).bindContext($deferred).closure,
                waitForParentPromiseToBeResolved = enclose(_waitForParentPromiseToBeResolved)
                    .appendArgs($parentRenderPromise).closure,
                afterRender = enclose(_afterRender).appendArgs($deferred).bindContext(this).closure,
                renderAndAfterRender = enclose(_renderAndAfterRender)
                    .appendArgs($deferred, afterRender).bindContext(this).closure,
                rejectStart = enclose($deferred.reject).bindContext(this).closure;

            $
                .when(_runLifeCycleMethod.call(this, this.beforeRender))
                .then(notifyBeforeRenderDone)
                .then(waitForParentPromiseToBeResolved)
                .then(
                    renderAndAfterRender,
                    rejectStart);
        }

        /**
         * Life cycle methods have an event triggered before the run.
         * If a life cycle method has one or more arguments, then the first argument passed in is its deferred.
         * The life cycle method will automatically return this deferred, otherwise it will pass through whatever
         * the method itself returns.
         *
         * @param lifeCycleMethod
         * @returns {*}
         * @private
         */
        function _runLifeCycleMethod (lifeCycleMethod) {
            var $deferred,
                args = Array.prototype.slice.call(arguments),
                returned;

            if (!lifeCycleMethod) {
                return undefined;
            }

            if (lifeCycleMethod.length) {
                $deferred = new $.Deferred();
                args.unshift($deferred);
            }

            returned = lifeCycleMethod.apply(this, args);

            return lifeCycleMethod.length ? $deferred.promise() : returned;
        }

        function _waitForParentPromiseToBeResolved ($parentRenderPromise) {
            if ($parentRenderPromise) {
                return $parentRenderPromise;
            }
            return undefined;
        }

        function _renderAndAfterRender ($deferred, afterRender) {
            var rejectStart = enclose($deferred.reject).bindContext(this).closure;
            $
                .when(_runLifeCycleMethod.call(this, this.render))
                .then(enclose($deferred.notify).appendArgs(RENDER_DONE).bindContext($deferred).closure)
                .then(
                    afterRender,
                    rejectStart);
        }

        function _afterRender ($deferred) {
            var $afterRenderDeferred = _runLifeCycleMethod.call(this, this.afterRender),
                resolveStart = enclose($deferred.resolve).bindContext(this).closure,
                rejectStart = enclose($deferred.reject).bindContext(this).closure;
            $
                .when(
                    $afterRenderDeferred,
                    _startChildren.call(this, $deferred)
                )
                .then(enclose($deferred.notify).appendArgs(AFTER_RENDER_DONE).bindContext($deferred).closure)
                .then(
                    resolveStart,
                    rejectStart);
        }

        function _startChildren ($parentDeferred) {
            _(this.children).each(function (child) {
                var $afterRenderDeferred = new $.Deferred();
                $parentDeferred.progress(function (step) {
                    if (step === RENDER_DONE) {
                        $afterRenderDeferred.resolve();
                    }
                });

                child.start($afterRenderDeferred.promise());
                child.hasStarted = true;
            });
        }
    });
