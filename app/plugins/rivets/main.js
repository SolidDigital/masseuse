define(['./plugin', './binders', './formatters'], function(plugin, binders, formatters) {
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
        formatters : formatters
    };
});