define(['backbone', '../models/masseuseModel'], function(Backbone, MasseuseModel) {
    'use strict';

    return Backbone.Collection.extend({
        model : MasseuseModel
    });
});