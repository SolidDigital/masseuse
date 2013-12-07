/*global define:false*/
define([
    './views/baseView', './utilities/channels', './utilities/mixin', './views/rivetView', './views/viewContext',
    './utilities/deferredHelper', './utilities/localStorage', './routers/masseuseRouter', './models/proxyProperty',
    './models/masseuseModel', './models/computedProperty', './collections/paginatedCollection'
], function (BaseView, channels, mixin, rivetView, ViewContext, DeferredHelper, localStorage, MasseuseRouter,
             ProxyProperty, MasseuseModel, ComputedProperty, PaginatedCollection) {
    'use strict';

    return {
        BaseView : BaseView,
        channels : channels,
        ComputedProperty : ComputedProperty,
        DeferredHelper : DeferredHelper,
        localStorage : localStorage,
        MasseuseModel : MasseuseModel,
        MasseuseRouter : MasseuseRouter,
        mixin : mixin,
        PaginatedCollection : PaginatedCollection,
        ProxyProperty : ProxyProperty,
        rivetView : rivetView,
        ViewContext : ViewContext
    }
});