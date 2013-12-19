/* jshint loopfunc:true */
define(['jquery', 'rivets', '../utilities/configureMethod', 'backbone', 'underscore', '../utilities/formatters',
    '../utilities/rivetsBinders'],
    function ($, Rivets, configureMethod, Backbone, _, rivetsFormatters, rivetsBinders) {
    'use strict';

    /**
     * Adapter originally from https://gist.github.com/mogadanez/5728747
     */

    return configureMethod({
        rivetScope : undefined,
        rivetPrefix : undefined,
        instaUpdateRivets : false
    }, function (config) {
        Rivets.configure({
            adapter : {
                subscribe : function (obj, keypath, callback) {
                    var parts = [keypath],
                        index = keypath.indexOf('.');
                    if (index > -1) {
                        parts = keypath.split('.');
                    }
                    this.subscribe_nested(parts, obj, callback);
                },

                subscribe_nested : function rivets_backbone_adapter_subscribe_nested (parts, obj, callback) {
                    var keypath;
                    if (!obj) {
                        return;
                    }
                    while (parts.length > 0) {
                        keypath = parts.shift();

                        if (obj instanceof Backbone.Collection) {
                            obj.on('add remove reset refresh', function (obj, keypath) {
                                callback(this.getValue(obj, keypath));
                            }.bind(this, obj, keypath), this);
                        } else {
                            if (this.getValue(obj, keypath, true) instanceof Backbone.Collection) {
                                this.getValue(obj, keypath, true)
                                    .on('add remove reset refresh', function (obj, keypath) {
                                        callback(this.getValue(obj, keypath));
                                    }.bind(this, obj, keypath), this);
                            }
                            if (obj.on) {
                                obj.on('change:' + keypath, function (tail_parts, key, m, v) {
                                    callback(v);
                                    if (tail_parts.length > 0) {
                                        this.subscribe_nested(_.clone(tail_parts), this.getValue(m, key), callback);
                                    }
                                }.bind(this, _.clone(parts), keypath));
                            }
                        }
                        obj = this.getValue(obj, keypath);

                        if (!obj) {
                            break;
                        }
                        else {
                            this.subscribe_nested(_.clone(parts), obj, callback);
                        }
                    }
                },

                getValue : function rivets_backbone_adapter_getValue (model, key, not_expand_collection_to_model) {

                    if (model instanceof Backbone.Collection) {
                        return key ? model[key] : model.models;
                    }
                    if (!key) {
                        return model;
                    }
                    if (model instanceof Backbone.Model) {
                        var res = model.get(key);
                        if (typeof (res) == 'undefined') {
                            res = model[key];
                        }
                        if (res instanceof Backbone.Collection) {
                            return not_expand_collection_to_model ? res : res.models;
                        }
                        else {
                            return res;
                        }
                    } else {
                        return model[key];
                    }

                },

                unsubscribe : function (obj, keypath) {
                    if (typeof (obj) == 'undefined') {
                        return;
                    }
                    if (obj instanceof Backbone.Collection) {
                        obj.off('add remove reset refresh');
                    } else if (obj.off) {
                        obj.off('change:' + keypath);
                    }
                },
                read : function (obj, keypath) {
                    var args = keypath.split(' '),
                        parts,
                        index,
                        result;

                    if (args.length > 1) {
                        return _.map(args, function (x) {
                            return this.read(obj, x);
                        }, this);
                    }

                    parts = [keypath];
                    index = keypath.indexOf('.');
                    if (index > -1) {
                        parts = keypath.split('.');
                    }
                    result = obj;
                    while (parts.length > 0) {
                        keypath = parts.shift();
                        result = this.getValue(result, keypath);
                        if (typeof (result) == 'undefined' || result === null) {
                            return result;
                        }
                    }
                    return result;
                },
                publish : function (obj, keypath, value) {
                    var parts = [keypath],
                        index = keypath.indexOf('.'),
                        result;

                    if (index > -1) {
                        parts = keypath.split('.');
                    }
                    result = obj;
                    while (parts.length > 1) {
                        keypath = parts.shift();
                        result = this.getValue(result, keypath);
                        if (!result) {
                            return;
                        }
                    }
                    keypath = parts.shift();
                    if (result instanceof Backbone.Collection) {
                        result[keypath] = value;
                    }
                    else if (result instanceof Backbone.Model) {
                        result.set(keypath, value);
                    }
                    result[keypath] = value;

                }
            },
            prefix : config.rivetPrefix
            // preloadData: false
        });
        // Rivets works off of listening to the change event, which doesn't happen on inputs until loss of focus
        // Work around that if desired
        if (config.instaUpdateRivets) {
            this.elementCache(config.rivetScope + ' input').on('keypress paste textInput input', function () {
                $(this).trigger('change');
            });
        }

        Rivets.config.templateDelimiters = ['{{', '}}'];

        _.each(rivetsFormatters, function(value, key) {
            Rivets.formatters[key] = value;
        });

        _.each(rivetsBinders, function(value, key) {
            Rivets.binders[key] = value;
        });

        // bind data to rivets values.
        return Rivets.bind($(config.rivetScope), {data : this.model});

    }).methodWithDefaultOptions;
});