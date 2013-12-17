define([
    './views/baseView', './utilities/channels', './views/viewContext', './routers/masseuseRouter',
    './models/masseuseModel', './models/computedProperty'
], function (BaseView, channels, ViewContext, MasseuseRouter, MasseuseModel, ComputedProperty) {
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
        ViewContext : ViewContext, // yes
        channels : channels, // yes
        MasseuseModel : MasseuseModel, // yes
        ComputedProperty : ComputedProperty, // yes - thin out MM by using native set instead of hard coded overrides
        MasseuseRouter : MasseuseRouter, // yes - add in loadMainContent
    };

//            getProperty : getProperty, // internal
//            enclose : enclose, // internal
//            deferMethod : deferMethod // internal

});