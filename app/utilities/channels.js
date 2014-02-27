/*global define:false*/
define(['underscore', 'backbone', './nameSpace'], function (_, Backbone, namespace) {
    'use strict';

    var channels;

    /**
     * channels is a singleton event bus.
     * @param channel
     * @namespace masseuse/channels
     */
    function Channels(channel) {
        if (channels) {
            channels.addChannel(channel);
            return channels;
        } else if (!this instanceof Channels) {
            return new Channels(channel);
        } else {
            _.extend(this, Backbone.Events);
            this.addChannel(channel);
            channels = this;
        }
    }

    /**
     * Channel can either be a string or array of channel strings.
     * The string takes the form, 'name1.name2.name3'
     * @memberof masseuse/channels
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
