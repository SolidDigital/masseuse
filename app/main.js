define([
    './views/baseView', './utilities/channels', './views/viewContext', './routers/masseuseRouter',
    './models/masseuseModel', './models/computedProperty', './models/proxyProperty', './models/observerProperty',
    './collections/masseuseCollection'
], function (BaseView, channels, ViewContext, MasseuseRouter, MasseuseModel, ComputedProperty, ProxyProperty,
             ObserverProperty, MasseuseCollection) {
    'use strict';

    /** @description `Masseuse` is:
     *  BB helper library
     *      helps with
     *          views
     *              baseView
     *                  the BB View lifecycle - based on promises
     *                  child views
     *                  separating View definitions from View options
     *              rivetView
     *                  a baseView with built in rivetjs
     *          models
     *              allows for model specific logic to be packaged with the model
     *                computed properties
     *                proxy properties
     *              nested models with bubbling up of change events
     *          router
     *              with a beforeRouting method
     *
     * @namespace masseuse
     */
    return {
        View : BaseView,
        ViewContext : ViewContext,
        Model : MasseuseModel,
        Collection : MasseuseCollection,
        Router : MasseuseRouter,
        ComputedProperty : ComputedProperty,
        ProxyProperty : ProxyProperty,
        ObserverProperty : ObserverProperty,
        channels : channels,
        plugins : {
            // convenience object to dynamically load your plugins into
            // by default none of the available plugins are loaded, so that rjs only includes them if you want them
                // this will reduce the size of the optimized build if you don't use a plugin
        }
    };
});
