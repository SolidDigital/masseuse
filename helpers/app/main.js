define(['./collections/paginatedCollection', './../../app/models/proxyProperty', './utilities/configureMethod',
    './utilities/formatters', './utilities/localStorage', './utilities/rivetsBinders', './utilities/validation',
    './views/rivetsPlugin', './views/rivetView'],
    function(PaginatedCollection, ProxyProperty, configureMethod, formatters, localStorage, rivetsBinders, validation,
        rivetsPlugin, rivetView) {
    'use strict';
    return {
        configureMethod : configureMethod,
        formatters : formatters,
        localStorage : localStorage,
        PaginatedCollection : PaginatedCollection,
        ProxyProperty : ProxyProperty,
        rivetsBinders : rivetsBinders,
        rivetsPlugin : rivetsPlugin,
        rivetView : rivetView,
        validation : validation
    };
});