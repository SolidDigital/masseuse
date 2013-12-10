/*global define:false*/
define(['underscore', 'backbone'], function (_, Backbone) {
    'use strict';

    var aChannel,
        channels;

    // setup channels
    channels = {
        views : {

        }
    };

    // make channels use events
    for (aChannel in channels) {
        if (channels.hasOwnProperty(aChannel)) {
            _.extend(channels[aChannel], Backbone.Events);
        }
    }

    return channels;
});