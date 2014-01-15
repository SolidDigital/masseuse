define(['./plugin', './binders', './formatters', './view'], function(plugin, binders, formatters, view) {
    'use strict';
    /**
     * Require in as a package:
     * {
     *      name : 'rivetsPlugin',
     *      location : 'components/masseuse/app/plugins/rivets'
     *  }
     */
    return {
        plugin : plugin,
        binders : binders,
        formatters : formatters,
        view : view
    };
});
