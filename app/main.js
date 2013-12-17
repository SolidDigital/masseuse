define([
    './views/baseView', './utilities/channels', './utilities/configureMethod', './views/rivetView',
    './views/viewContext',
    './utilities/localStorage', './routers/masseuseRouter', './models/proxyProperty',
    './models/masseuseModel', './models/computedProperty', './collections/paginatedCollection', './utilities/enclose',
    './utilities/getProperty', './utilities/formatters', './utilities/validation'
], function (BaseView, channels, configureMethod, rivetView, ViewContext, localStorage, MasseuseRouter,
             ProxyProperty, MasseuseModel, ComputedProperty, PaginatedCollection, enclose, getProperty, formatters,
             validation) {
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
        BaseView : BaseView, // yes
        channels : channels, // yes
        ComputedProperty : ComputedProperty, // yes - thin out MM by using native set instead of hard coded overrides
        MasseuseModel : MasseuseModel, // yes
        MasseuseRouter : MasseuseRouter, // yes - add in loadMainContent
        ViewContext : ViewContext, // yes
        getProperty : getProperty, // internal
        enclose : enclose, // internal
        localStorage : localStorage, // no
        configureMethod : configureMethod, // no - potentially deferMethod
        formatters : formatters, // no
        PaginatedCollection : PaginatedCollection, // no
        ProxyProperty : ProxyProperty, // no
        rivetView : rivetView, // no - maybe as plugin later
        validation : validation // no
    };

});