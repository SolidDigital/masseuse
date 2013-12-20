define([
    './views/baseView', './utilities/channels', './views/viewContext', './routers/masseuseRouter',
    './models/masseuseModel', './models/computedProperty', './models/proxyProperty'
], function (BaseView, channels, ViewContext, MasseuseRouter, MasseuseModel, ComputedProperty, ProxyProperty) {
    'use strict';

    /**
     * Masseuse is:
     *  BB helper library based on promises
     *      helps with
     *          the BB View lifecycle
     *          child views
     *          separating View definitions from View options
     *          models
     *              allows for model specific logic to be packaged with the model
     *                computed properties
     *          router
     *
     *
     *      has a BB BaseView with life cycle methods
     *
     *      Things to note in docs:
     *          BB removed this.options so we do not provide a way to attach app state
     *              but you can prototype it on in one line
     *
     *
     */
    return {
        BaseView : BaseView,
        ViewContext : ViewContext,
        channels : channels,
        MasseuseModel : MasseuseModel,
        ComputedProperty : ComputedProperty,
        MasseuseRouter : MasseuseRouter,
        ProxyProperty : ProxyProperty
    };
});