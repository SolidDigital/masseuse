define(function () {
    'use strict';

    return nameSpace;

    /**
     * From: http://addyosmani.com/blog/essential-js-namespacing/
     * @modlue utilities/nameSpace
     * @param ns
     * @param ns_string
     * @returns {*}
     */
    function nameSpace(ns, ns_string, plugin) {
        var parts = ns_string.split('.'),
            parent = ns,
            pl,
            i;

        pl = parts.length;
        for (i = 0; i < pl; i++) {
            //create a property if it doesn't exist
            if (typeof parent[parts[i]] == 'undefined') {
                parent[parts[i]] = plugin ? plugin({}) : {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    }
});
