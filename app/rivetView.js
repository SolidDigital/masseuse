/* jshint loopfunc: true */
define(['rivets', 'mixin', 'backbone'], function (Rivets, mixin, Backbone) {

    /**
     * Adapter originally from https://gist.github.com/mogadanez/5728747
     */

    return mixin({
        rivetScope : undefined,
        rivetPrefix : undefined,
        instaUpdateRivets : false
    }, function (config) {
        Rivets.configure({
            adapter : {
                subscribe: function (obj, keypath, callback) {
                    var parts = [keypath];
                    var index = keypath.indexOf('.');
                    if (index > -1) {
                        parts = keypath.split('.');
                    }
                    this.subscribe_nested(parts, obj, callback);
                },

                subscribe_nested: function rivets_backbone_adapter_subscribe_nested(parts, obj, callback) {
                    if (!obj) {
                        return;
                    }
                    while (parts.length > 0) {
                        var keypath = parts.shift();

                        if (obj instanceof Backbone.Collection) {
                            obj.on('add remove reset refresh', function (obj, keypath) {
                                callback(this.getValue(obj, keypath));
                            }.bind( this, obj, keypath ), this);
                        } else {
                            if (this.getValue(obj, keypath, true) instanceof Backbone.Collection) {
                                this.getValue(obj, keypath, true).on('add remove reset refresh', function ( obj, keypath ) {
                                    callback(this.getValue(obj, keypath));
                                }.bind( this, obj, keypath ), this);
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

                getValue: function rivets_backbone_adapter_getValue(model, key, not_expand_collection_to_model) {

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

                unsubscribe: function (obj, keypath, callback) {
                    if (typeof (obj) == 'undefined') {
                        return;
                    }
                    if (obj instanceof Backbone.Collection) {
                        obj.off('add remove reset refresh');
                    } else if (obj.off) {
                        obj.off('change:' + keypath);
                    }
                },
                read: function (obj, keypath) {
                    var args = keypath.split(' ');
                    if (args.length > 1) {
                        return _.map(args, function (x) {
                            return this.read(obj, x);
                        }, this);
                    }

                    var parts = [keypath];
                    var index = keypath.indexOf('.');
                    if (index > -1) {
                        parts = keypath.split('.');
                    }
                    var result = obj;
                    while (parts.length > 0) {
                        keypath = parts.shift();
                        result = this.getValue(result, keypath);
                        if (typeof (result) == 'undefined' || result === null) {
                            return result;
                        }
                    }
                    return result;
                },
                publish: function (obj, keypath, value) {
                    var parts = [keypath];
                    var index = keypath.indexOf('.');
                    if (index > -1) {
                        parts = keypath.split('.');
                    }
                    var result = obj;
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


        Rivets.formatters.withComma = function(value) {
            return value + ', ';
        }

        Rivets.formatters.joinWithComma = function(value) {
            return value.join(', ');
        }

        Rivets.formatters.withColon = function(value) {
            return value + ' : ';
        }

        Rivets.formatters.spaceAfter = function(value) {
            return value + ' ';
        }

        Rivets.formatters.secondsToTime = function(secs) {
            var hours = Math.floor(secs / (60 * 60)),
                divisor_for_minutes = secs % (60 * 60),
                minutes = Math.floor(divisor_for_minutes / 60),
                divisor_for_seconds = divisor_for_minutes % 60,
                seconds = Math.ceil(divisor_for_seconds),
                obj = {
                    "h": hours,
                    "m": minutes,
                    "s": seconds
                },
                time = (obj.h) ? ((obj.h > 1) ? obj.h + ' hrs ' : obj.h + ' hr ' ) : '';
                time += (obj.m) ? ((obj.m > 1) ? obj.m + ' mins ' : obj.m + ' min ') : '';
                time += (obj.s) ? ((obj.s > 1) ? obj.s + ' secs ' : obj.s + ' sec ') : '';

            return time;
        }

        Rivets.formatters.dollars = function(amount) {
            return '$' + (amount / 100);
        }

        Rivets.formatters.equals = function(value, args) {
            return (value === args);
        }

        Rivets.formatters.exists = function(value, args) {
            return value ? value : args;
        }

        Rivets.formatters.limit = function(value, args) {
            return value.slice(0, args);
        }

        Rivets.binders.addclass = function(el, value) {
            if(el.addedClass) {
                $(el).removeClass(el.addedClass)
                delete el.addedClass
            }

            if(value) {
                $(el).addClass(value)
                el.addedClass = value
            }
        }

        // bind data to rivets values.
        return Rivets.bind($(config.rivetScope), {data : this.model});

    });
});