/*global define:false*/
define([
    './views/baseView', './utilities/channels', './utilities/configureMethod', './views/rivetView', './views/viewContext',
    './utilities/deferredHelper', './utilities/localStorage', './routers/masseuseRouter', './models/proxyProperty',
    './models/masseuseModel', './models/computedProperty', './collections/paginatedCollection'
], function (BaseView, channels, configureMethod, rivetView, ViewContext, DeferredHelper, localStorage, MasseuseRouter,
             ProxyProperty, MasseuseModel, ComputedProperty, PaginatedCollection) {
    'use strict';

    return {
        BaseView : BaseView,
        channels : channels,
        configureMethod : configureMethod,
        ComputedProperty : ComputedProperty,
        DeferredHelper : DeferredHelper,
        localStorage : localStorage,
        MasseuseModel : MasseuseModel,
        MasseuseRouter : MasseuseRouter,
        PaginatedCollection : PaginatedCollection,
        ProxyProperty : ProxyProperty,
        rivetView : rivetView,
        ViewContext : ViewContext
    }
});