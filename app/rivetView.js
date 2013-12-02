/* jshint loopfunc: true */
define(['rivets', 'mixin', 'backbone', 'underscore'], function (Rivets, mixin, Backbone, _) {

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

        Rivets.formatters.withBackslash = function(value) {
            return value + ' / ';
        }

        Rivets.formatters.withColon = function(value) {
            return value + ' : ';
        }

        Rivets.formatters.spaceAfter = function(value) {
            return value + ' ';
        }

        Rivets.formatters.spaceBefore = function(value) {
            return ' ' + value;
        }

        Rivets.formatters.bytesToKilobytes = function(value) {
            return (value / 1000) + ' kb';
        }

        Rivets.formatters.prettyDate = function(dateStr) {
            var date = new Date(dateStr);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
        };

        Rivets.formatters.dollars = function(amount) {
            return '$' + (amount / 100);
        };

        Rivets.formatters.equals = function(value, args) {
            return (value === args);
        }

        Rivets.formatters.exists = function(value, args) {
            return value ? value : args;
        }

        Rivets.formatters.limit = function(value, args) {
            return value.slice(0, args);
        }

        Rivets.formatters.humanize = function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }

        Rivets.formatters.jsonAsString = function(value) {
            return JSON.stringify(value);
        }

        Rivets.formatters.includes = function() {
            var args = Array.prototype.slice.call(arguments),
                stringToCompare = args.shift();

            if(args.indexOf(stringToCompare) != -1) {
                return true;
            } else {
                return false;
            }
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

        Rivets.binders['eachwith-*'] = {
            block: true,
            bind: function(el) {
                console.log('bind fired');
                console.log('the Arguments Passed:');
                console.log(this.args);
//                var attr;
//                if (this.marker == null) {
//                    attr = ['data', this.view.config.prefix, this.type].join('-').replace('--', '-');
//                    this.marker = document.createComment(" rivets: " + this.type + " ");
//                    this.iterated = [];
//                    el.removeAttribute(attr);
//                    el.parentNode.insertBefore(this.marker, el);
//                    return el.parentNode.removeChild(el);
//                }
            },
            unbind: function(el) {
                console.log('unbind fired');
                console.log('the arguments passed are:');
                console.log(this.args);
//                var view, _i, _len, _ref, _results;
//                if (this.iterated != null) {
//                    _ref = this.iterated;
//                    _results = [];
//                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//                        view = _ref[_i];
//                        _results.push(view.unbind());
//                    }
//                    return _results;
//                }
            },
            routine: function(el, collection) {
                console.log('routine Fired');
                console.log('the arguments passed are:');
                console.log(this.args);
//                var data, i, index, k, key, model, modelName, options, previous, template, v, view, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
//                modelName = this.args[0];
//                collection = collection || [];
//                if (this.iterated.length > collection.length) {
//                    _ref = Array(this.iterated.length - collection.length);
//                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//                        i = _ref[_i];
//                        view = this.iterated.pop();
//                        view.unbind();
//                        this.marker.parentNode.removeChild(view.els[0]);
//                    }
//                }
//                _results = [];
//                for (index = _j = 0, _len1 = collection.length; _j < _len1; index = ++_j) {
//                    model = collection[index];
//                    data = {};
//                    data[modelName] = model;
//                    if (this.iterated[index] == null) {
//                        _ref1 = this.view.models;
//                        for (key in _ref1) {
//                            model = _ref1[key];
//                            if (data[key] == null) {
//                                data[key] = model;
//                            }
//                        }
//                        previous = this.iterated.length ? this.iterated[this.iterated.length - 1].els[0] : this.marker;
//                        options = {
//                            binders: this.view.options.binders,
//                            formatters: this.view.options.formatters,
//                            config: {}
//                        };
//                        _ref2 = this.view.options.config;
//                        for (k in _ref2) {
//                            v = _ref2[k];
//                            options.config[k] = v;
//                        }
//                        options.config.preloadData = true;
//                        template = el.cloneNode(true);
//                        view = new Rivets.View(template, data, options);
//                        view.bind();
//                        this.iterated.push(view);
//                        _results.push(this.marker.parentNode.insertBefore(template, previous.nextSibling));
//                    } else if (this.iterated[index].models[modelName] !== model) {
//                        _results.push(this.iterated[index].update(data));
//                    } else {
//                        _results.push(void 0);
//                    }
//                }
//                return _results;
            },
            update: function(models) {
                console.log('update fired');
                console.log('the arguments passed are:');
                console.log(this.args);

//                var data, key, model, view, _i, _len, _ref, _results;
//                data = {};
//                for (key in models) {
//                    model = models[key];
//                    if (key !== this.args[0]) {
//                        data[key] = model;
//                    }
//                }
//                _ref = this.iterated;
//                _results = [];
//                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
//                    view = _ref[_i];
//                    _results.push(view.update(data));
//                }
//                return _results;
            }
        }

        // bind data to rivets values.
        return Rivets.bind($(config.rivetScope), {data : this.model});

    });
});