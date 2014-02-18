define(['backbone'], function (Backbone) {

    'use strict';
    return {
        getProperty : getProperty,
        setProperty : setProperty
    };

    /**
     * Get properties from a passed in object based on a string descriptor of the desired field.
     */
    function getProperty (obj, parts, create) {
        var part;

        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

        while (typeof obj === 'object' && obj && parts.length) {
            part = parts.shift();
            if (!(part in obj) && create) {
                obj[part] = {};
            }
            obj = getModelProperty(obj, part);
        }

        return obj;
    }

    function setProperty (obj, parts, value) {
        var part;

        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

        part = parts.pop();
        obj = this.getProperty(obj, parts, true);
        if (obj && typeof obj === 'object') {
            setModelProperty(obj, part, value);
            return obj;
        }
    }

    function getModelProperty(model, keypath) {
        if (model instanceof Backbone.Model) {
            return model.get(keypath);
        } else {
            return model[keypath];
        }
    }

    function setModelProperty(model, keypath, value) {
        if (model instanceof Backbone.Model) {
            model.set(keypath, value);
            if (value instanceof Backbone.Model) {
                model.listenTo(value, 'change', model.trigger.bind(model, 'change'));
            }
        } else {
            model[keypath] = value;
        }
    }
});
