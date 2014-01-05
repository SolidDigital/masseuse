/*global define:false*/
define(['underscore', 'backbone', './namespace'], function (_, Backbone, namespace) {
    'use strict';

    var channels;

    /**
     * @class Channels is a singleton event bus.
     * @param channel
     * @module utilities/Channels
     */
    function Channels(channel) {
        if (channels) {
            channels.addChannel(channel);
            return channels;
        }
        _.extend(this, Backbone.Events);
        this.addChannel(channel);
        channels = this;
    }

    /**
     * Channel can either be a string or array of channel strings.
     * The string takes the form, 'name1.name2.name3'
     * @param channel
     */
    Channels.prototype.addChannel = function(channel) {
        if (!channel) {
            return;
        }

        if (_.isArray(channel)) {
            _.each(channel, this.addChannel.bind(this));
        } else {

            this.channels = namespace(this, channel, plugin);
        }
    };

    return Channels;

    function plugin(objIn) {
        return _.extend(objIn, Backbone.Events);
    }
});