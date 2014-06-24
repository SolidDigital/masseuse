define(['backbone', 'underscore'], function (Backbone, _) {

    'use strict';

    var separators = /\.|\[|]/;

    return {
        getProperty : getProperty,
        setProperty : setProperty,
        unsetProperty : unsetProperty
    };

    /**
     * Get properties from a passed in object based on a string descriptor of the desired field.
     */
    function getProperty (obj, parts, create) {
        var part,
            number;

        if (typeof parts === 'string') {
            parts = _.compact(parts.split(separators));
        }

        while (typeof obj === 'object' && obj && parts.length) {
            part = parts.shift();
            if (!(part in obj) && create) {
                number = parseInt(part, 10);
                if (_.isNaN(number)) {
                    obj[part] = {};
                } else {
                    obj[part] = [];
                }
            }
            obj = getObjectProperty(obj, part);
        }

        return obj;
    }

    function setProperty (obj, parts, value) {
        var part;

        if (typeof parts === 'string') {
            parts = _.compact(parts.split(separators));
        }

        part = parts.pop();
        obj = this.getProperty(obj, parts, true);
        if (obj && typeof obj === 'object') {
            setModelProperty(obj, part, value);
            return obj;
        }
    }

    function unsetProperty (obj, parts) {
        var part;

        if (typeof parts === 'string') {
            parts = parts.split('.');
        }

        part = parts.pop();
        obj = this.getProperty(obj, parts, true);
        if (obj && typeof obj === 'object') {
            unsetModelProperty(obj, part);
            return obj;
        }
    }

    function getObjectProperty(model, keypath) {
        var number;
        if (model instanceof Backbone.Model) {
            return model.get(keypath);
        } else if(model instanceof Backbone.Collection) {
            return model.at(keypath);
        } else {
            number = parseInt(keypath, 10);
            if (_.isNaN(number)) {
                return model[keypath];
            } else {
                return model[number];
            }

        }
    }

    function setModelProperty(model, keypath, value) {
        var number,
            oldModel;

        if (model instanceof Backbone.Model) {
            model.set(keypath, value);
            if (value instanceof Backbone.Model) {
                model.listenTo(value, 'change', model.trigger.bind(model, 'change'));
            }
        } else if(model instanceof Backbone.Collection) {
            oldModel = model.at(keypath);
            if (oldModel) {
                oldModel.set(value);
            } else {
                model.models[keypath] = new Backbone.Model(value);
            }
        } else {
            number = parseInt(keypath, 10);
            if (_.isNaN(number)) {
                model[keypath] = value;
            } else {
                model[number] = value;
            }
        }
    }

    function unsetModelProperty(model, keypath) {
        if (model instanceof Backbone.Model) {
            model.unset(keypath);
        } else {
            delete model[keypath];
        }
    }
});
