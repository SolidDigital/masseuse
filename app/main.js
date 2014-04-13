define([
    './views/baseView', './utilities/channels', './views/viewContext', './routers/masseuseRouter',
    './models/masseuseModel', './models/computedProperty', './models/proxyProperty', './models/observerProperty',
    './plugins/rivets/view', './collections/masseuseCollection'
], function (BaseView, channels, ViewContext, MasseuseRouter, MasseuseModel, ComputedProperty, ProxyProperty,
             ObserverProperty, RivetsView, MasseuseCollection) {
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

        // Old fields : @deprecated
        // TODO: remove these and bump major version
        BaseView : BaseView,
        MasseuseModel : MasseuseModel,
        MasseuseRouter : MasseuseRouter,
        utilities : {
            channels : channels
        },
        // TODO: move this out of this package, so this can be optimized w/o RivetsView
        plugins : {
            rivets : {
                RivetsView : RivetsView
            }
        }
    };
});
