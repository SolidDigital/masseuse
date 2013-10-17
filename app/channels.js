/*global define:false*/
define(['underscore', 'backbone'], function(_, Backbone) {
    "use strict";

    var aChannel,
        channels;

    // setup channels
    channels = {
        views: {

        }
    };

    // make channels use events
    for (aChannel in channels) {
        if (channels.hasOwnProperty(aChannel)) {
            _.extend(channels[aChannel], Backbone.Events);
        }
    }

    return channels;

    function namespace(ns_string) {

        var parts = ns_string.split('.'),
            parent = channels,
            i;

        // stip reduntant leading global
        if ('channels' === parts[0]) {
            parts = parts.slice(1);
        }

        for (i = 0; i < parts.length; ++i) {

            // build sub namespaces as needed
            if ("undefined" === typeof parent[parts[i]]) {
                parent[parts[i]] = {};
            }

            parent = parent[parts[i]];
        }

        return parent;
    };

});