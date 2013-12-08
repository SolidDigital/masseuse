/*global define:false*/
define([
    './views/baseView', './utilities/channels', './utilities/configureMethod', './views/rivetView', './views/viewContext',
    './utilities/localStorage', './routers/masseuseRouter', './models/proxyProperty',
    './models/masseuseModel', './models/computedProperty', './collections/paginatedCollection', './utilities/enclose'
], function (BaseView, channels, configureMethod, rivetView, ViewContext, localStorage, MasseuseRouter,
             ProxyProperty, MasseuseModel, ComputedProperty, PaginatedCollection, enclose) {
    'use strict';

    return {
        BaseView : BaseView,
        channels : channels,
        configureMethod : configureMethod,
        ComputedProperty : ComputedProperty,
        enclose : enclose,
        localStorage : localStorage,
        MasseuseModel : MasseuseModel,
        MasseuseRouter : MasseuseRouter,
        PaginatedCollection : PaginatedCollection,
        ProxyProperty : ProxyProperty,
        rivetView : rivetView,
        ViewContext : ViewContext
    }
});