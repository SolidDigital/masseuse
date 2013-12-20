/*global define:false*/
define(['underscore', 'backbone'], function (_, Backbone) {
    'use strict';
    function Channels(channelsArray) {
        this.channels = {};
        _.each(channelsArray, this.addChannel);
    }

    Channels.prototype.addChannel = function(channel) {
        this.channels[channel] = _.extend({}, Backbone.Events);
    };

    return Channels;
});