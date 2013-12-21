/*global define:false*/
define(['underscore', 'backbone', './namespace'], function (_, Backbone, namespace) {
    'use strict';

    function Channels(channel) {
        _.extend(this, Backbone.Events);
        this.addChannel(channel);
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