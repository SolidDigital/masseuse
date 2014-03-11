/*global define:false */
define(['jquery', 'underscore'],
    function ($, _) {
        'use strict';

        // TODO: create constants module
        var BEFORE_RENDER_DONE = 'beforeRenderDone',
            RENDER_DONE = 'renderDone',
            AFTER_RENDER_DONE = 'afterRenderDone';

        return {
            runAllMethods : runAllMethods
        };

        function runAllMethods ($deferred, $parentRenderPromise) {
            var notifyBeforeRenderDone = $deferred.notify.bind(this, BEFORE_RENDER_DONE),
                waitForParentPromiseToBeResolved = _waitForParentPromiseToBeResolved.bind(this,$parentRenderPromise),
                afterRender = _afterRender.bind(this,$deferred),
                renderAndAfterRender = _renderAndAfterRender.bind(this, $deferred, afterRender),
                rejectStart = $deferred.reject.bind(this);

            $deferred.progress(this.trigger.bind(this));

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
         */
        function _runLifeCycleMethod (lifeCycleMethod, $startDeferred) {
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

            if ($startDeferred) {
                args.push($startDeferred);
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
            var rejectStart = $deferred.reject.bind(this);
            $
                .when(_runLifeCycleMethod.call(this, this.render, $deferred))
                .then($deferred.notify.bind(this,RENDER_DONE))
                .then(
                    afterRender,
                    rejectStart);
        }

        function _afterRender ($deferred) {
            var $allChildrenStartedPromise = _startChildren.call(this, $deferred),
                resolveStart = $deferred.resolve.bind(this),
                rejectStart = $deferred.reject.bind(this);

            $allChildrenStartedPromise
                .then(_runLifeCycleMethod.bind(this, this.afterRender))
                .then($deferred.notify.bind(this,AFTER_RENDER_DONE))
                .then(
                    resolveStart,
                    rejectStart);
        }

        function _startChildren ($parentDeferred) {
            var childPromiseArray = [],
                $afterRenderDeferred = new $.Deferred();

            $parentDeferred.progress(function (step) {
                if (step === RENDER_DONE) {
                    $afterRenderDeferred.resolve();
                }
            });

            _(this.children).each(function (child) {
                var $childDeferred = child.start($afterRenderDeferred.promise());
                childPromiseArray.push($childDeferred);
            });

            return $.when.apply($, childPromiseArray);
        }
    });
