/*global define:false */
define(['jquery', 'underscore', '../utilities/configureMethod', '../utilities/enclose', '../utilities/deferredHelper'],
    function ($, _, configureMethod, enclose, DeferredHelper) {
    'use strict';

        // TODO: create constants module
        var BEFORE_RENDER_DONE = 'beforeRenderDone',
            RENDER_DONE = 'renderDone',
            AFTER_RENDER_DONE = 'afterRenderDone';

    return {
        runAllMethods : runAllMethods
    }

    function runAllMethods ($deferred, $parentRenderPromise) {
        var deferredHelper = new DeferredHelper($deferred),
            notifyBeforeRenderDone = deferredHelper.cacheNotification(BEFORE_RENDER_DONE).notifyFromCache,
            waitForParentPromiseToBeResolved = enclose(_waitForParentPromiseToBeResolved).with($parentRenderPromise).closure,
            afterRender = enclose(_afterRender).with($deferred, deferredHelper).context(this).closure,
            renderAndAfterRender = enclose(_renderAndAfterRender).with($deferred, deferredHelper, afterRender).context(this).closure,
            rejectStart = enclose($deferred.reject).context(this).closure;

        $
            .when(_runLifeCycleMethod.call(this, this.beforeRender))
            .always(notifyBeforeRenderDone)
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
     * @param lifeCycleMethodName
     * @returns {*}
     * @private
     */
    function _runLifeCycleMethod (lifeCycleMethod) {
        if (!lifeCycleMethod) {
            return undefined;
        }

        return configureMethod({}, lifeCycleMethod).methodWithDefaultOptions({
            async : lifeCycleMethod.length
        }).methodWithActualOptions.call(this);
    }

    function _waitForParentPromiseToBeResolved ($parentRenderPromise) {
        if ($parentRenderPromise) {
            return $parentRenderPromise;
        }
        return undefined;
    }

    function _renderAndAfterRender ($deferred, deferredHelper, afterRender) {
        var rejectStart = enclose($deferred.reject).context(this).closure;
        $
            .when(_runLifeCycleMethod.call(this, this.render))
            .always(deferredHelper.cacheNotification(RENDER_DONE).notifyFromCache)
            .then(
                afterRender,
                rejectStart);
    }

    function _afterRender ($deferred, deferredHelper) {
        var $afterRenderDeferred = _runLifeCycleMethod.call(this, this.afterRender),
            resolveStart = enclose($deferred.resolve).context(this).closure,
            rejectStart = enclose($deferred.reject).context(this).closure;
        $
            .when(
                $afterRenderDeferred,
                _startChildren.call(this, $deferred)
            )
            .always(deferredHelper.cacheNotification(AFTER_RENDER_DONE).notifyFromCache)
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
        });
    }
});
